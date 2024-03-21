import React, { useEffect, useState } from 'react'
import './CSS/PdfHandler.css'
import axios from 'axios';
import { pdfjs } from 'react-pdf';
import PdfComp from './pdfComp';

// This is to display the pdf
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url,
).toString();

const PdfHandler = () => {
    const [title, setTitle] = useState("");
    const [file, setFile] = useState("");
    const [allImages, setAllImages] = useState(null)
    const [pdfFile, setPdfFile] = useState(null);
    const [downloadFile, setDownloadFile] = useState(null)

    useEffect(() => {
        getPdf();
    }, []);

    // Get all the pdf files

    const getPdf = async () => {
        const result = await axios.get("/pdf/getfiles");
        console.log(result.data.data);
        setAllImages(result.data.data);
    }

    // Handle the form submission when user uploads a pdf. Creates a FormData containing the title and file, then append them to the form data. 
    const submitImage = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("file", file);
        console.log(title, file)

        // Send a post request to the server
        const response = await axios.post("/pdf/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        }
        );
        console.log(response);
        if (response.data.status == "ok") {
            alert("Uploaded Successfully!");
            getPdf()
        }
    }

    // Display the pdf
    const showPdf = (pdf) => {
        const filename = pdf.split('/').pop();
        const pdfFilePath = `http://localhost:8000/files/${pdf}`;
        setPdfFile(pdfFilePath);
        console.log('pdfFile:', pdfFilePath);
        setDownloadFile(filename)
    }

    const downloadSelectedPages = async (selectedPages) => {
        try {
            // Send a POST request to the server to extract selected pages from the pdf file
            const response = await axios.post('/pdf/extract', { pages: selectedPages, pdfFile: downloadFile }, { responseType: 'arraybuffer' });
            console.log(response.data)
            //Create a Blob object from the response data containing the extracted pdf
            const downloadBlob = new Blob([response.data], { type: 'application/pdf' });
            const downloadUrl = window.URL.createObjectURL(downloadBlob);

            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = 'extracted.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            // Handle any errors that occur during the download process
            console.error('Error downloading selected pages:', error);
        }
    };

    return (
        <div className='mainContainer'>
            <form className='formStyle' onSubmit={submitImage}>
                <h4>Upload your pdf file</h4>
                <input type="text"
                    className='form-control'
                    placeholder='Title'
                    required
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input type="file"
                    className='form-control'
                    accept='application/pdf'
                    required
                    onChange={(e) => setFile(e.target.files[0])}
                />
                <button className='btn btn-primary' type='submit'>Submit</button>
            </form>

            <div className="uploaded">
                <h4>Uploaded PDF:</h4>
                <div className="output-div">
                    {allImages == null ? "" : allImages.map((data) => {
                        return (
                            <div className="inner-div" key={data.pdf}>
                                <h6>Title: {data.title}</h6>
                                <button className="btn btn-primary" onClick={() => showPdf(data.pdf)}> Show Pdf </button>
                            </div>
                        );
                    })}
                </div>
            </div>
            <PdfComp pdfFile={pdfFile} downloadSelectedPages={downloadSelectedPages} />
        </div>


    );
}

export default PdfHandler