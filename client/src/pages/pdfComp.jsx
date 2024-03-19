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
        //Checks if the selectedPages array already includes current page number
        if (selectedPages.includes(page)) {
            //If page is already selected this line removes the page from the selectedPages
            setSelectedPages(selectedPages.filter((p) => p !== page));
        } else {
            //Adding the clicked page to the selected pages list
            setSelectedPages([...selectedPages, page]);
        }
    }

    const handleDownloadSelected = () => {
        // Checks if the downloadSelectedPages function is provided as a prop.
        if (props.downloadSelectedPages) {

            //If provided calls the function selectedPages as an argument
            props.downloadSelectedPages(selectedPages);
        } else {
            console.log('downloadSelectedPages props not provided')
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
                                <Page
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