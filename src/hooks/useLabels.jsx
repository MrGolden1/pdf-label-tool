import React, { createContext, useContext, useState, useEffect } from 'react';

const LabelContext = createContext();

const PREDEFINED_LABELS = {
    'Account Information': [
        { id: 'account_name_title', name: 'Account Name Title', color: '#FF6B6B', shortcut: 'T' },
        { id: 'account_no_title', name: 'Account No Title', color: '#4ECDC4', shortcut: 'N' },
        { id: 'account_address_title', name: 'Account Address Title', color: '#45B7D1', shortcut: 'A' },
        { id: 'bank_name', name: 'Bank Name', color: '#96CEB4', shortcut: 'B' },
        { id: 'account_name', name: 'Account Name', color: '#FFEEAD', shortcut: 'M' },
        { id: 'account_no', name: 'Account No', color: '#D4A5A5', shortcut: 'O' },
        { id: 'account_address', name: 'Account Address', color: '#9B9B9B', shortcut: 'D' }
    ],
    'Balance Information': [
        { id: 'beginning_balance_title', name: 'Beginning Balance Title', color: '#FF9999', shortcut: 'G' },
        { id: 'ending_balance_title', name: 'Ending Balance Title', color: '#99FF99', shortcut: 'H' },
        { id: 'beginning_balance', name: 'Beginning Balance', color: '#9999FF', shortcut: 'I' },
        { id: 'ending_balance', name: 'Ending Balance', color: '#FFB366', shortcut: 'J' }
    ],
    'Date Information': [
        { id: 'beginning_date_title', name: 'Beginning Date Title', color: '#FF99CC', shortcut: 'K' },
        { id: 'ending_date_title', name: 'Ending Date Title', color: '#99FFCC', shortcut: 'L' },
        { id: 'beginning_date', name: 'Beginning Date', color: '#CC99FF', shortcut: 'Y' },
        { id: 'ending_date', name: 'Ending Date', color: '#FFCC99', shortcut: 'U' }
    ],
    'Transaction Totals': [
        { id: 'total_money_in_title', name: 'Total Money In Title', color: '#FF8080', shortcut: 'V' },
        { id: 'total_money_out_title', name: 'Total Money Out Title', color: '#80FF80', shortcut: 'C' },
        { id: 'total_money_in', name: 'Total Money In', color: '#8080FF', shortcut: 'X' },
        { id: 'total_money_out', name: 'Total Money Out', color: '#FFB380', shortcut: 'Z' }
    ],
    'Transaction Headers': [
        { id: 'transaction_date_title', name: 'Transaction Date Title', color: '#FF99FF', shortcut: 'Q' },
        { id: 'transaction_description_title', name: 'Transaction Description Title', color: '#99FFFF', shortcut: 'W' },
        { id: 'transaction_type_title', name: 'Transaction Type Title', color: '#FFFF99', shortcut: 'E' },
        { id: 'transaction_money_in_title', name: 'Transaction Money In Title', color: '#FF8080', shortcut: 'R' },
        { id: 'transaction_money_out_title', name: 'Transaction Money Out Title', color: '#80FF80', shortcut: 'F' },
        { id: 'transaction_balance_title', name: 'Transaction Balance Title', color: '#8080FF', shortcut: 'D' }
    ],
    'Transaction Details': [
        { id: 'transaction_date', name: 'Transaction Date', color: '#FFB3FF', shortcut: 'S' },
        { id: 'transaction_description', name: 'Transaction Description', color: '#B3FFFF', shortcut: 'A' },
        { id: 'transaction_type', name: 'Transaction Type', color: '#FFFFB3', shortcut: 'G' },
        { id: 'transaction_money_in', name: 'Transaction Money In', color: '#FFB3B3', shortcut: 'H' },
        { id: 'transaction_money_out', name: 'Transaction Money Out', color: '#B3FFB3', shortcut: 'J' },
        { id: 'transaction_balance', name: 'Transaction Balance', color: '#B3B3FF', shortcut: 'K' }
    ],
    'Transaction': [
        { id: 'transaction', name: 'Transaction', color: '#000000', shortcut: 'L' }
    ]
};

export function LabelProvider({ children }) {
    const [visibilityState, setVisibilityState] = useState(
        Object.values(PREDEFINED_LABELS).flat().reduce((acc, label) => {
            acc[label.id] = true;
            return acc;
        }, {})
    );
    const [selectedLabel, setSelectedLabel] = useState(null);
    const [showLabels, setShowLabels] = useState(true);
    const [labels, setLabels] = useState(() => {
        const stored = localStorage.getItem("customLabels");
        if (stored) {
            return JSON.parse(stored);
        }
        return PREDEFINED_LABELS;
    });

    useEffect(() => {
        localStorage.setItem("customLabels", JSON.stringify(labels));
    }, [labels]);

    const updateLabelColor = (category, labelId, newColor) => {
        setLabels(prev => {
            const updated = { ...prev };
            updated[category] = updated[category].map(lbl =>
                lbl.id === labelId ? { ...lbl, color: newColor } : lbl
            );
            return updated;
        });
    };

    const toggleLabelVisibility = (labelId) => {
        setVisibilityState(prev => ({
            ...prev,
            [labelId]: !prev[labelId]
        }));
    };

    const toggleAllLabels = (visible) => {
        setVisibilityState(
            Object.values(labels).flat().reduce((acc, label) => {
                acc[label.id] = visible;
                return acc;
            }, {})
        );
    };

    const toggleCategoryLabels = (category, visible) => {
        setVisibilityState(prev => {
            const newState = { ...prev };
            labels[category].forEach(label => {
                newState[label.id] = visible;
            });
            return newState;
        });
    };

    const selectNextLabel = () => {
        if (!selectedLabel) {
            const firstCategory = Object.values(labels)[0];
            setSelectedLabel(firstCategory[0]);
            return;
        }

        // Find current category
        const currentCategory = Object.entries(labels).find(([_, labels]) =>
            labels.some(label => label.id === selectedLabel.id)
        );

        if (currentCategory) {
            const categoryLabels = currentCategory[1];
            const currentIndex = categoryLabels.findIndex(label => label.id === selectedLabel.id);
            const nextIndex = (currentIndex + 1) % categoryLabels.length;
            setSelectedLabel(categoryLabels[nextIndex]);
        }
    };

    const selectPreviousLabel = () => {
        if (!selectedLabel) {
            const firstCategory = Object.values(labels)[0];
            setSelectedLabel(firstCategory[0]);
            return;
        }

        // Find current category
        const currentCategory = Object.entries(labels).find(([_, labels]) =>
            labels.some(label => label.id === selectedLabel.id)
        );

        if (currentCategory) {
            const categoryLabels = currentCategory[1];
            const currentIndex = categoryLabels.findIndex(label => label.id === selectedLabel.id);
            const prevIndex = (currentIndex - 1 + categoryLabels.length) % categoryLabels.length;
            setSelectedLabel(categoryLabels[prevIndex]);
        }
    };

    // Add keyboard shortcut handler
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ignore if typing in an input, color picker, or textarea
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            
            // Ignore if Ctrl key is pressed (to avoid conflicts with other shortcuts)
            if (e.ctrlKey) return;

            const key = e.key.toUpperCase();
            const allLabels = Object.values(labels).flat();
            const matchingLabel = allLabels.find(label => label.shortcut === key);
            
            if (matchingLabel) {
                e.preventDefault(); // Prevent default browser behavior
                setSelectedLabel(matchingLabel);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [labels, setSelectedLabel]);

    return (
        <LabelContext.Provider value={{
            predefinedLabels: labels,
            visibilityState,
            toggleLabelVisibility,
            selectedLabel,
            setSelectedLabel,
            showLabels,
            setShowLabels,
            toggleAllLabels,
            toggleCategoryLabels,
            selectNextLabel,
            selectPreviousLabel,
            updateLabelColor
        }}>
            {children}
        </LabelContext.Provider>
    );
}

export function useLabels() {
    return useContext(LabelContext);
}
