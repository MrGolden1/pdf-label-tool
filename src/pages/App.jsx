import React, { useState } from 'react';
import PDFViewer from '../components/PDFViewer';
import LabelSidebar from '../components/LabelSidebar';
import Toolbar from '../components/Toolbar';
import AnnotationCanvas from '../components/AnnotationCanvas';
import { AnnotationProvider } from '../hooks/useAnnotations';
import { LabelProvider } from '../hooks/useLabels';
import { ScaleProvider } from '../hooks/useScale';

export default function App() {
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    return (
        <ScaleProvider>
            <LabelProvider>
                <AnnotationProvider>
                    <div className="flex h-screen w-screen overflow-hidden">
                        {/* Sidebar for labels and file upload */}
                        <div className="w-64 bg-gray-100 border-r border-gray-300 flex flex-col">
                            <div className="p-4 border-b border-gray-300">
                                <input type="file" onChange={handleFileChange} accept="application/pdf" />
                            </div>
                            <LabelSidebar />
                        </div>

                        {/* Main content area with toolbar and PDF display */}
                        <div className="flex-1 flex flex-col">
                            <Toolbar />
                            <div className="flex-1 relative bg-gray-50 overflow-auto">
                                {file ? (
                                    <PDFViewer file={file} />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-500">
                                        <p>Please upload a PDF.</p>
                                    </div>
                                )}
                                {/* Remove the redundant AnnotationCanvas component */}
                                {/* {file && <AnnotationCanvas />} */}
                            </div>
                        </div>
                    </div>
                </AnnotationProvider>
            </LabelProvider>
        </ScaleProvider>
    );
}
