import React, { useEffect } from 'react';
import { useAnnotations } from '../hooks/useAnnotations';
import { useLabels } from '../hooks/useLabels';

export default function Toolbar() {
    const { undo, redo, exportAnnotations } = useAnnotations();
    const { showLabels, setShowLabels } = useLabels();

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.key === 'z') undo();
            if (e.ctrlKey && e.key === 'y') redo();
            // Add other shortcuts as needed
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [undo, redo]);

    return (
        <div className="h-10 border-b border-gray-300 flex items-center px-2 space-x-2 bg-white">
            <button onClick={undo} className="text-sm px-2 py-1 bg-gray-100 rounded">Undo</button>
            <button onClick={redo} className="text-sm px-2 py-1 bg-gray-100 rounded">Redo</button>
            <button onClick={() => exportAnnotations('json')} className="text-sm px-2 py-1 bg-gray-100 rounded">Export JSON</button>
            <div className="ml-4 flex items-center">
                <input
                    type="checkbox"
                    id="showLabels"
                    checked={showLabels}
                    onChange={(e) => setShowLabels(e.target.checked)}
                    className="mr-2"
                />
                <label htmlFor="showLabels" className="text-sm">Show Labels</label>
            </div>
        </div>
    );
}
