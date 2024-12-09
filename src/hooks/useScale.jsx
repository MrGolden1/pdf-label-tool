import React, { createContext, useContext, useState, useCallback } from 'react';

const ScaleContext = createContext();

const MIN_SCALE = 0.5;  // 50%
const MAX_SCALE = 2.0;  // 200%
const ZOOM_STEP = 0.1;

export function ScaleProvider({ children }) {
    const [scale, setScale] = useState(2.0);

    const boundedScale = useCallback((newScale) => {
        return Math.min(Math.max(newScale, MIN_SCALE), MAX_SCALE);
    }, []);

    const setZoomPreset = useCallback((preset) => {
        setScale(boundedScale(preset));
    }, [boundedScale]);

    const zoomIn = useCallback(() => {
        setScale(prev => boundedScale(prev + ZOOM_STEP));
    }, [boundedScale]);

    const zoomOut = useCallback(() => {
        setScale(prev => boundedScale(prev - ZOOM_STEP));
    }, [boundedScale]);

    const smoothZoom = useCallback((delta, center) => {
        setScale(prev => boundedScale(prev * (1 + delta)));
    }, [boundedScale]);

    return (
        <ScaleContext.Provider value={{
            scale,
            setScale: (newScale) => setScale(boundedScale(newScale)),
            zoomIn,
            zoomOut,
            smoothZoom,
            setZoomPreset
        }}>
            {children}
        </ScaleContext.Provider>
    );
}

export function useScale() {
    return useContext(ScaleContext);
}