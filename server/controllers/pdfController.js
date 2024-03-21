const PdfModel = require('../models/pdfModel');
const path = require('path');
const fs = require('fs');
const { PDFDocument } = require('pdf-lib');

// Upload PDF
const uploadPdf = async (req, res) => {
    // Log information about the uploaded file
    console.log(req.file);
    // Extract title and filename from request body and multer upload
    const title = req.body.title;
    const fileName = req.file.filename;
    try {
        // Create a new document record in the database with title and filename
        await PdfModel.create({ title: title, pdf: fileName });
        // Respond with success message if document creation is successful
        res.json({ status: 'ok' });
    } catch (error) {
        // Respond with error message if document creation fails
        res.json({ status: error });
    }
};

// Get all files
const getAllFiles = async (req, res) => {
    try {
        // Find all documents in the PdfModel collection
        PdfModel.find({}).then((data) => {
            // Respond with success status and data if documents are found
            res.send({ status: 'ok', data: data });
        });
    } catch (error) {
        // Log any errors that occur during the process
        console.log(error);
    }
};

// Extract pages from PDF
const extractPages = async (req, res) => {
    try {
        // Destructure pages and pdfFile from the request body
        const { pages, pdfFile } = req.body;

        // Check if pages is not provided or is not an array or is empty
        if (!pages || !Array.isArray(pages) || pages.length === 0) {
            // Respond with a 400 status code and an error message if pages is invalid
            return res.status(400).json({ error: 'Invalid pages selection' });
        }

        // Check if pdfFile path is not provided
        if (!pdfFile) {
            // Respond with a 400 status code and an error message if pdfFile path is not provided
            return res.status(400).json({ error: 'PDF file path not provided' });
        }

        // Construct the full path of the PDF file
        const pdfFilePath = path.join(__dirname, '..', 'files', pdfFile);
        console.log('Loading PDF file:', pdfFilePath);

        try {
            // Load the existing PDF file as bytes
            const existingPdfBytes = fs.readFileSync(pdfFilePath);

            // Load the source PDF document
            const sourcePdf = await PDFDocument.load(existingPdfBytes);

            // Create a new PDF document
            const newPdf = await PDFDocument.create();

            // Copy the desired pages from the source document to the new document
            const pagesToCopy = pages.map((pageNumber) => pageNumber - 1); // Adjust page indices if needed
            const copiedPages = await newPdf.copyPages(sourcePdf, pagesToCopy);

            // Add the copied pages to the new document
            copiedPages.forEach((page) => newPdf.addPage(page));

            // Serialize the new PDF document to bytes
            const newPdfBytes = await newPdf.save();

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename="extracted.pdf"');
            res.setHeader('Content-Length', newPdfBytes.length);
            res.end(newPdfBytes);
        } catch (err) {
            // Handle errors that occur while loading the PDF file or creating the new PDF
            console.error('Error extracting pages:', err);
            return res.status(500).json({ error: 'An error occurred while extracting pages' });
        }
    } catch (err) {
        // Handle other errors that may occur
        console.error('Error extracting pages:', err);
        res.status(500).json({ error: 'An error occurred while extracting pages' });
    }
};

module.exports = {
    uploadPdf,
    getAllFiles,
    extractPages
}