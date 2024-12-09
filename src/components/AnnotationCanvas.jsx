import React, { useRef, useState, useEffect } from 'react';
import { useAnnotations } from '../hooks/useAnnotations';
import { useLabels } from '../hooks/useLabels';
import { useScale } from '../hooks/useScale';

export default function AnnotationCanvas({ pageNumber }) {
    const {
        getAnnotationsForPage,
        createAnnotation,
        updateAnnotation,
        deleteAnnotations,
        selectedAnnotationId,
        setSelectedAnnotationId
    } = useAnnotations();
    const { selectedLabel, visibilityState, showLabels } = useLabels();
    const { scale } = useScale();
    const containerRef = useRef(null);
    const [startPoint, setStartPoint] = useState(null);
    const [tempAnnotation, setTempAnnotation] = useState(null);
    const [actionType, setActionType] = useState(null); // 'draw', 'move', 'resize', or null
    const [currentAnnotation, setCurrentAnnotation] = useState(null);
    const [moveOffset, setMoveOffset] = useState({ x: 0, y: 0 });

    const pageAnnotations = getAnnotationsForPage(pageNumber);

    const handleMouseDown = (e, ann = null, action = null) => {
        e.stopPropagation();
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / scale;
        const y = (e.clientY - rect.top) / scale;

        if (action === 'move') {
            setMoveOffset({
                x: x - ann.x,
                y: y - ann.y
            });
            setCurrentAnnotation(ann);
            setActionType('move');
            setSelectedAnnotationId(ann.id);
        } else if (action === 'resize') {
            setCurrentAnnotation(ann);
            setActionType('resize');
            setSelectedAnnotationId(ann.id);
        } else if (selectedLabel) {
            setStartPoint({ x, y });
            setActionType('draw');
        }
    };

    const handleMouseMove = (e) => {
        if (!actionType) return;
        e.preventDefault();
        
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / scale;
        const y = (e.clientY - rect.top) / scale;

        if (actionType === 'draw') {
            const width = x - startPoint.x;
            const height = y - startPoint.y;
            setTempAnnotation({ 
                x: startPoint.x, 
                y: startPoint.y, 
                width, 
                height, 
                label: selectedLabel 
            });
        } else if (actionType === 'move' && currentAnnotation) {
            setTempAnnotation({
                ...currentAnnotation,
                x: x - moveOffset.x,
                y: y - moveOffset.y
            });
        } else if (actionType === 'resize' && currentAnnotation) {
            const width = Math.max(10, x - currentAnnotation.x);
            const height = Math.max(10, y - currentAnnotation.y);
            setTempAnnotation({
                ...currentAnnotation,
                width,
                height
            });
        }
    };

    const handleMouseUp = () => {
        if (!actionType) return;
        
        if (tempAnnotation) {
            if (actionType === 'draw') {
                createAnnotation(tempAnnotation, pageNumber);
            } else {
                const normalizedAnnotation = {
                    ...tempAnnotation,
                    width: Math.abs(tempAnnotation.width),
                    height: Math.abs(tempAnnotation.height),
                    x: tempAnnotation.width < 0 ? tempAnnotation.x + tempAnnotation.width : tempAnnotation.x,
                    y: tempAnnotation.height < 0 ? tempAnnotation.y + tempAnnotation.height : tempAnnotation.y
                };
                updateAnnotation(normalizedAnnotation, pageNumber);
            }
        }
        
        setActionType(null);
        setTempAnnotation(null);
        setCurrentAnnotation(null);
        setMoveOffset({ x: 0, y: 0 });
    };

    // Add keyboard handler to delete the selected annotation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Delete' && selectedAnnotationId) {
                deleteAnnotations([selectedAnnotationId], pageNumber);
                setSelectedAnnotationId(null);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedAnnotationId, deleteAnnotations, pageNumber]);

    // Updated calculateLabelStyle to accept annotation parameter
    const calculateLabelStyle = (annotation, width, height) => {
        const boxSize = Math.sqrt(width * height);
        const baseFontSize = boxSize * 0.1; // 10% of box size
        const fontSize = Math.min(Math.max(10, baseFontSize), 16); // Clamp between 10px and 16px
        
        return {
            fontSize: `${fontSize}px`,
            backgroundColor: `${annotation.label?.color}40`,
            color: annotation.label?.color,
            transform: `translateY(-100%)`, // Move label above box
            padding: `${fontSize * 0.2}px ${fontSize * 0.4}px`, // Proportional padding
            whiteSpace: 'nowrap'
        };
    };

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 pointer-events-auto select-none"
            onMouseDown={(e) => handleMouseDown(e)}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            {pageAnnotations.map((ann) => (
                visibilityState[ann.label?.id] && (
                    <div
                        key={ann.id}
                        className={`absolute border-2 ${
                            selectedAnnotationId === ann.id ? 'border-blue-500' : ''
                        } group select-none`}
                        style={{
                            left: ann.x * scale,
                            top: ann.y * scale,
                            width: ann.width * scale,
                            height: ann.height * scale,
                            borderColor: ann.label?.color || '#FF0000'
                        }}
                        onMouseDown={(e) => handleMouseDown(e, ann, 'move')}
                    >
                        {/* Delete button */}
                        <button
                            className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 rounded-full text-white 
                                     flex items-center justify-center opacity-0 group-hover:opacity-100 
                                     transition-opacity"
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteAnnotations([ann.id], pageNumber);
                            }}
                        >
                            ×
                        </button>

                        {/* Resize handle */}
                        <div
                            className="absolute w-3 h-3 bg-white border border-gray-500 
                                     right-0 bottom-0 cursor-nwse-resize"
                            onMouseDown={(e) => handleMouseDown(e, ann, 'resize')}
                        />

                        {ann.label && showLabels && (
                            <span 
                                className="absolute left-0 top-0 rounded select-none"
                                style={calculateLabelStyle(ann, ann.width * scale, ann.height * scale)}
                            >
                                {ann.label.name}
                            </span>
                        )}
                    </div>
                )
            ))}
            {tempAnnotation && (
                <div
                    className="absolute border-2 border-dashed border-gray-500"
                    style={{
                        left: tempAnnotation.x * scale,
                        top: tempAnnotation.y * scale,
                        width: Math.abs(tempAnnotation.width) * scale,
                        height: Math.abs(tempAnnotation.height) * scale,
                    }}
                />
            )}
        </div>
    );
}
