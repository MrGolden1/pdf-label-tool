
import React from 'react';
import { useScale } from '../hooks/useScale';

export default function ZoomControls() {
    const { scale, setScale, zoomIn, zoomOut, setZoomPreset } = useScale();

    const presets = [0.5, 1, 1.5, 2];

    return (
        <div className="flex items-center space-x-2 bg-white p-2 rounded shadow">
            <button onClick={zoomOut} className="p-1 bg-gray-100 rounded hover:bg-gray-200">
                <span className="px-2">−</span>
            </button>

            <input
                type="range"
                min="25"
                max="400"
                value={scale * 100}
                onChange={(e) => setScale(Number(e.target.value) / 100)}
                className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />

            <button onClick={zoomIn} className="p-1 bg-gray-100 rounded hover:bg-gray-200">
                <span className="px-2">+</span>
            </button>

            <div className="text-sm w-16">{Math.round(scale * 100)}%</div>

            <div className="border-l border-gray-300 pl-2 flex space-x-1">
                {presets.map((preset) => (
                    <button
                        key={preset}
                        onClick={() => setZoomPreset(preset)}
                        className={`px-2 py-1 text-sm rounded ${
                            Math.abs(scale - preset) < 0.01 ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                    >
                        {preset * 100}%
                    </button>
                ))}
            </div>
        </div>
    );
}