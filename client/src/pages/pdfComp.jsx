import { useState } from 'react';
import { Document, Page } from 'react-pdf';
import './CSS/pdfComp.css'

function PdfComp(props) {
    const [numPages, setNumPages] = useState();
    const [pageNumber, setPageNumber] = useState(1);
    const [selectedPages, setSelectedPages] = useState([])

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    const handlePageSelection = (page) => {
        if (selectedPages.includes(page)) {
            setSelectedPages(selectedPages.filter((p) => p !== page));
        } else {
            setSelectedPages([...selectedPages, page]);
        }
    }

    const handleDownloadSelected = () => {
        if (props.downloadSelectedPages) {
            if (selectedPages && selectedPages.length > 0) {
                props.downloadSelectedPages(selectedPages);
            } else {
                console.error('selectedPages is empty or undefined');
            }
        } else {
            console.error('downloadSelectedPages prop not provided');
        }
    }

    return (
        <div className='pdfContainer'>
            <p>
                Page {pageNumber} of {numPages}
            </p>
            <Document file={props.pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
                {Array.apply(null, Array(numPages))
                    .map((x, i) => i + 1)
                    .map((page) => {
                        return (
                            <div key={page}>
                                <input type="checkbox"
                                    checked={selectedPages.includes(page)}
                                    onChange={() => handlePageSelection(page)}
                                />
                                < Page
                                    pageNumber={page}
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false}
                                />
                            </div>
                        )
                    })}

            </Document>
            <button onClick={handleDownloadSelected}>Download Selected Pages</button>

        </div>
    );
}
export default PdfComp