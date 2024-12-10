import React from 'react';
import { useAnnotations } from '../hooks/useAnnotations';

export default function FileUpload({ setFile }) {
    const { clearAnnotations } = useAnnotations();

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            clearAnnotations();
        }
    };

    return (
        <input 
            type="file" 
            onChange={handleFileChange} 
            accept="application/pdf" 
        />
    );
}
