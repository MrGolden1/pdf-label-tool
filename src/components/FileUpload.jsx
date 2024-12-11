import React from 'react';
import { useAnnotations } from '../hooks/useAnnotations';

export default function FileUpload({ setFile, setFilename }) {
    const { clearAnnotations, importAnnotations } = useAnnotations();

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            if (selectedFile.type === 'application/pdf') {
                setFile(selectedFile);
                setFilename(selectedFile.name);
                clearAnnotations();
            } else if (selectedFile.type === 'application/json') {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const loadedAnnotations = JSON.parse(e.target.result);
                        importAnnotations(loadedAnnotations);
                    } catch (error) {
                        console.error('Failed to parse JSON:', error);
                    }
                };
                reader.readAsText(selectedFile);
            }
        }
    };

    return (
        <input 
            type="file" 
            onChange={handleFileChange} 
            accept="application/pdf,application/json" 
        />
    );
}
