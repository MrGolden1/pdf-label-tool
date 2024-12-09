import React, { useState } from 'react';
import { useLabels } from '../hooks/useLabels';

export default function LabelSidebar() {
    const { predefinedLabels, visibilityState, toggleLabelVisibility, selectedLabel, setSelectedLabel } = useLabels();
    const [expandedCategories, setExpandedCategories] = useState(new Set(Object.keys(predefinedLabels)));

    const toggleCategory = (category) => {
        setExpandedCategories(prev => {
            const next = new Set(prev);
            if (next.has(category)) {
                next.delete(category);
            } else {
                next.add(category);
            }
            return next;
        });
    };

    return (
        <div className="flex-1 overflow-auto bg-gray-50">
            {Object.entries(predefinedLabels).map(([category, labels]) => (
                <div key={category} className="mb-2">
                    <button
                        onClick={() => toggleCategory(category)}
                        className="w-full px-4 py-2 text-left font-semibold bg-gray-200 hover:bg-gray-300 focus:outline-none"
                    >
                        {expandedCategories.has(category) ? '▼' : '▶'} {category}
                    </button>
                    
                    {expandedCategories.has(category) && (
                        <div className="pl-4">
                            {labels.map((label) => (
                                <div
                                    key={label.id}
                                    className={`flex items-center p-2 hover:bg-gray-100 ${
                                        selectedLabel?.id === label.id ? 'bg-blue-50' : ''
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={visibilityState[label.id]}
                                        onChange={() => toggleLabelVisibility(label.id)}
                                        className="mr-2"
                                    />
                                    <button
                                        onClick={() => setSelectedLabel(label)}
                                        className="flex-1 text-left flex items-center"
                                    >
                                        <span
                                            className="w-4 h-4 rounded-full mr-2"
                                            style={{ backgroundColor: label.color }}
                                        />
                                        <span className="text-sm">{label.name}</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
