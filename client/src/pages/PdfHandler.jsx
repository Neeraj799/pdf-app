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

    useEffect(() => {
        getPdf();
    }, []);

    // Get all the pdf files

    const getPdf = async () => {
        const result = await axios.get("/getfiles");
        console.log(result.data.data);
        setAllImages(result.data.data);
    }

    const submitImage = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("file", file);
        console.log(title, file)

        const response = await axios.post("/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        }
        );
        console.log(response);
        if (response.data.status == "ok") {
            alert("Uploaded Successfully!");
            getPdf()
        }
    }

    const showPdf = (pdf) => {

        setPdfFile(`http://localhost:8000/files/${pdf}`)
    }

    const downloadSelectedPages = async (selectedPages) => {
        try {
            const response = await axios.post('/extract', { pages: selectedPages, pdfFile: pdfFile }, {
                responseType: 'blob',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/pdf'
                }
            });
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'extracted.pdf');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
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
