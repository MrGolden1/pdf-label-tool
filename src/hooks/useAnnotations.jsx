import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const AnnotationContext = createContext();

export function AnnotationProvider({ children }) {
    // Changed to store annotations by page
    const [annotations, setAnnotations] = useState({});
    const [history, setHistory] = useState([]);
    const [future, setFuture] = useState([]);
    const [selectedAnnotationId, setSelectedAnnotationId] = useState(null);
    const [filteredAnnotations, setFilteredAnnotations] = useState([]);

    const commitHistory = (newAnnotations) => {
        setHistory((prev) => [...prev, annotations]);
        setAnnotations(newAnnotations);
        setFuture([]);
    };

    const createAnnotation = (ann, pageNumber) => {
        const newAnn = { ...ann, id: uuidv4() };
        commitHistory({
            ...annotations,
            [pageNumber]: [...(annotations[pageNumber] || []), newAnn]
        });
    };

    const updateAnnotation = (updatedAnn, pageNumber) => {
        const pageAnnotations = annotations[pageNumber] || [];
        const updatedAnnotations = pageAnnotations.map((ann) =>
            ann.id === updatedAnn.id ? updatedAnn : ann
        );
        commitHistory({
            ...annotations,
            [pageNumber]: updatedAnnotations
        });
    };

    const undo = () => {
        if (history.length > 0) {
            const prev = history[history.length - 1];
            setFuture((f) => [annotations, ...f]);
            setAnnotations(prev);
            setHistory(history.slice(0, -1));
        }
    };

    const redo = () => {
        if (future.length > 0) {
            const next = future[0];
            setHistory((h) => [...h, annotations]);
            setAnnotations(next);
            setFuture(future.slice(1));
        }
    };

    useEffect(() => {
        const savedAnnotations = JSON.parse(localStorage.getItem('annotations'));
        if (savedAnnotations) {
            setAnnotations(savedAnnotations);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('annotations', JSON.stringify(annotations));
    }, [annotations]);

    useEffect(() => {
        setFilteredAnnotations(annotations);
    }, [annotations]);

    const deleteAnnotations = (ids, pageNumber) => {
        const pageAnnotations = annotations[pageNumber] || [];
        commitHistory({
            ...annotations,
            [pageNumber]: pageAnnotations.filter((ann) => !ids.includes(ann.id))
        });
    };

    // Update the filtered annotations when page changes
    const getAnnotationsForPage = (pageNumber) => {
        return annotations[pageNumber] || [];
    };

    const exportAnnotations = (format) => {
        let data;
        if (format === 'json') {
            data = JSON.stringify(annotations, null, 2);
        } else if (format === 'xml') {
            // Convert annotations to XML format
            // ...conversion code...
        } else if (format === 'coco') {
            // Convert annotations to COCO format
            // ...conversion code...
        }
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `annotations.${format}`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const clearAnnotations = () => {
        setAnnotations({});
        setHistory([]);
        setFuture([]);
    };

    return (
        <AnnotationContext.Provider value={{
            annotations,
            getAnnotationsForPage,
            filteredAnnotations,
            setFilteredAnnotations,
            selectedAnnotationId,
            setSelectedAnnotationId,
            createAnnotation,
            updateAnnotation,
            undo,
            redo,
            exportAnnotations,
            deleteAnnotations,
            clearAnnotations
        }}>
            {children}
        </AnnotationContext.Provider>
    );
}

export function useAnnotations() {
    return useContext(AnnotationContext);
}