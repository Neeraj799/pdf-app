import React, { useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import './CSS/pdfComp.css';

function PdfComp(props) {
    // State variables
    const [numPages, setNumPages] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPages, setSelectedPages] = useState([]);

    // Reset selected pages and current page when PDF file changes
    useEffect(() => {
        setCurrentPage(1);
        setSelectedPages([]);
    }, [props.pdfFile]);

    // Function called when the PDF is successfully loaded
    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    // Function to handle selection of pages
    const handlePageSelection = (page) => {
        if (selectedPages.includes(page)) {
            setSelectedPages(selectedPages.filter((p) => p !== page));
        } else {
            setSelectedPages([...selectedPages, page]);
        }
    };

    // Function to handle download of selected pages
    const handleDownloadSelected = () => {
        if (props.downloadSelectedPages) {
            props.downloadSelectedPages(selectedPages);
        } else {
            console.log('downloadSelectedPages prop not provided');
        }
    };

    return (
        <div className='pdfContainer'>
            <div className='pdfViewer'>
                <Document file={props.pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
                    <Page pageNumber={currentPage} renderTextLayer={false} renderAnnotationLayer={false} />
                </Document>
            </div>
            <div className='pdfControls'>
                <button
                    onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <button
                    onClick={() => setCurrentPage(currentPage < numPages ? currentPage + 1 : numPages)}
                    disabled={currentPage === numPages}
                >
                    Next
                </button>
                <div className='checkbox'>
                    <input
                        type="checkbox"
                        checked={selectedPages.includes(currentPage)}
                        onChange={() => handlePageSelection(currentPage)}
                    />
                    <div>Select current page</div>

                </div>
                <button className='download-button' onClick={handleDownloadSelected}>Download</button>
            </div>
        </div>
    );
}

export default PdfComp;