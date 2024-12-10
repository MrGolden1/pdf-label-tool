import React, { createContext, useContext, useState } from 'react';

const LabelContext = createContext();

const PREDEFINED_LABELS = {
    'Account Information': [
        { id: 'account_name_title', name: 'Account Name Title', color: '#FF6B6B' },
        { id: 'account_no_title', name: 'Account No Title', color: '#4ECDC4' },
        { id: 'account_address_title', name: 'Account Address Title', color: '#45B7D1' },
        { id: 'bank_name', name: 'Bank Name', color: '#96CEB4' },
        { id: 'account_name', name: 'Account Name', color: '#FFEEAD' },
        { id: 'account_no', name: 'Account No', color: '#D4A5A5' },
        { id: 'account_address', name: 'Account Address', color: '#9B9B9B' }
    ],
    'Balance Information': [
        { id: 'beginning_balance_title', name: 'Beginning Balance Title', color: '#FF9999' },
        { id: 'ending_balance_title', name: 'Ending Balance Title', color: '#99FF99' },
        { id: 'beginning_balance', name: 'Beginning Balance', color: '#9999FF' },
        { id: 'ending_balance', name: 'Ending Balance', color: '#FFB366' }
    ],
    'Date Information': [
        { id: 'beginning_date_title', name: 'Beginning Date Title', color: '#FF99CC' },
        { id: 'ending_date_title', name: 'Ending Date Title', color: '#99FFCC' },
        { id: 'beginning_date', name: 'Beginning Date', color: '#CC99FF' },
        { id: 'ending_date', name: 'Ending Date', color: '#FFCC99' }
    ],
    'Transaction Totals': [
        { id: 'total_money_in_title', name: 'Total Money In Title', color: '#FF8080' },
        { id: 'total_money_out_title', name: 'Total Money Out Title', color: '#80FF80' },
        { id: 'total_money_in', name: 'Total Money In', color: '#8080FF' },
        { id: 'total_money_out', name: 'Total Money Out', color: '#FFB380' }
    ],
    'Transaction Headers': [
        { id: 'transaction_date_title', name: 'Transaction Date Title', color: '#FF99FF' },
        { id: 'transaction_description_title', name: 'Transaction Description Title', color: '#99FFFF' },
        { id: 'transaction_type_title', name: 'Transaction Type Title', color: '#FFFF99' },
        { id: 'transaction_money_in_title', name: 'Transaction Money In Title', color: '#FF8080' },
        { id: 'transaction_money_out_title', name: 'Transaction Money Out Title', color: '#80FF80' },
        { id: 'transaction_balance_title', name: 'Transaction Balance Title', color: '#8080FF' }
    ],
    'Transaction Details': [
        { id: 'transaction_date', name: 'Transaction Date', color: '#FFB3FF' },
        { id: 'transaction_description', name: 'Transaction Description', color: '#B3FFFF' },
        { id: 'transaction_type', name: 'Transaction Type', color: '#FFFFB3' },
        { id: 'transaction_money_in', name: 'Transaction Money In', color: '#FFB3B3' },
        { id: 'transaction_money_out', name: 'Transaction Money Out', color: '#B3FFB3' },
        { id: 'transaction_balance', name: 'Transaction Balance', color: '#B3B3FF' }
    ],
    'Transaction': [
        { id: 'transaction', name: 'Transaction', color: '#000000' }
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
    
    const toggleLabelVisibility = (labelId) => {
        setVisibilityState(prev => ({
            ...prev,
            [labelId]: !prev[labelId]
        }));
    };

    const toggleAllLabels = (visible) => {
        setVisibilityState(
            Object.values(PREDEFINED_LABELS).flat().reduce((acc, label) => {
                acc[label.id] = visible;
                return acc;
            }, {})
        );
    };

    const toggleCategoryLabels = (category, visible) => {
        setVisibilityState(prev => {
            const newState = { ...prev };
            PREDEFINED_LABELS[category].forEach(label => {
                newState[label.id] = visible;
            });
            return newState;
        });
    };

    const selectNextLabel = () => {
        if (!selectedLabel) {
            const firstCategory = Object.values(PREDEFINED_LABELS)[0];
            setSelectedLabel(firstCategory[0]);
            return;
        }

        // Find current category
        const currentCategory = Object.entries(PREDEFINED_LABELS).find(([_, labels]) =>
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
            const firstCategory = Object.values(PREDEFINED_LABELS)[0];
            setSelectedLabel(firstCategory[0]);
            return;
        }

        // Find current category
        const currentCategory = Object.entries(PREDEFINED_LABELS).find(([_, labels]) =>
            labels.some(label => label.id === selectedLabel.id)
        );

        if (currentCategory) {
            const categoryLabels = currentCategory[1];
            const currentIndex = categoryLabels.findIndex(label => label.id === selectedLabel.id);
            const prevIndex = (currentIndex - 1 + categoryLabels.length) % categoryLabels.length;
            setSelectedLabel(categoryLabels[prevIndex]);
        }
    };

    return (
        <LabelContext.Provider value={{
            predefinedLabels: PREDEFINED_LABELS,
            visibilityState,
            toggleLabelVisibility,
            selectedLabel,
            setSelectedLabel,
            showLabels,
            setShowLabels,
            toggleAllLabels,
            toggleCategoryLabels,
            selectNextLabel,
            selectPreviousLabel
        }}>
            {children}
        </LabelContext.Provider>
    );
}

export function useLabels() {
    return useContext(LabelContext);
}
