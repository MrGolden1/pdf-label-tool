import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useScale } from '../hooks/useScale';
import ZoomControls from './ZoomControls';
import AnnotationCanvas from './AnnotationCanvas';  // Add this import

// Set up the PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function PDFViewer({ file }) {
    const { scale, smoothZoom } = useScale();
    const [numPages, setNumPages] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const containerRef = useRef(null);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    const nextPage = () => {
        if (currentPage < numPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [file]);

    useEffect(() => {
        const handleWheel = (e) => {
            if (e.ctrlKey) {
                e.preventDefault();
                const delta = -e.deltaY / 1000; // Smoother zoom
                const rect = containerRef.current.getBoundingClientRect();
                const center = {
                    x: (e.clientX - rect.left) / rect.width,
                    y: (e.clientY - rect.top) / rect.height
                };
                smoothZoom(delta, center);
            }
        };
        const container = containerRef.current;
        container.addEventListener('wheel', handleWheel, { passive: false });
        return () => container.removeEventListener('wheel', handleWheel);
    }, [smoothZoom]);

    return (
        <div className="relative flex-1">
            {/* Controls container - fixed at the top */}
            <div className="sticky top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm p-2 border-b flex justify-between items-center">
                {/* Navigation controls */}
                <div className="flex space-x-2 items-center">
                    <button 
                        onClick={prevPage} 
                        className="p-1 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
                        disabled={currentPage <= 1}
                    >
                        Prev
                    </button>
                    <span>{currentPage}/{numPages || '?'}</span>
                    <button 
                        onClick={nextPage} 
                        className="p-1 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
                        disabled={currentPage >= numPages}
                    >
                        Next
                    </button>
                </div>

                {/* Zoom controls */}
                <ZoomControls />
            </div>

            {/* Scrollable PDF container */}
            <div ref={containerRef} className="overflow-auto h-[calc(100%-48px)]">
                <Document
                    file={file}
                    onLoadSuccess={onDocumentLoadSuccess}
                    renderMode="canvas"
                    className="w-full"
                >
                    <div className="relative">
                        <Page
                            pageNumber={currentPage}
                            scale={scale}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                        />
                        <AnnotationCanvas pageNumber={currentPage} />
                    </div>
                </Document>
            </div>
        </div>
    );
}
