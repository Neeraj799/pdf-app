const express = require('express')
const dotenv = require('dotenv').config()
const cors = require('cors');
const mongoose = require('mongoose')
const path = require('path');
const fs = require('fs');
const { PDFDocument } = require('pdf-lib');
const userRoutes = require('./routes/authRoutes')
const app = express();

//database connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('Database not connected', err))

//middleware
app.use(express.json())
app.use(cors({
    credentials: true,
    origin: "http://127.0.0.1:5173" // Update the origin to allow requests from your frontend application
}));

// Serve static files from the 'files' directory
app.use("/files", express.static("files"))

//multer to insert files
const multer = require('multer')

// Configure disk storage for multer
const storage = multer.diskStorage({
    // Specify the destination directory for uploaded files
    destination: function (req, file, cb) {
        cb(null, './files')
    },

    // Generate a unique filename for each uploaded file
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now()
        cb(null, uniqueSuffix + file.originalname)
    }
})

require("./models/pdfModel")
const PdfSchema = mongoose.model("PdfDetails");
const upload = multer({ storage: storage })

// Handle POST request to upload a file
app.post("/upload", upload.single("file"), async (req, res) => {

    // Log information about the uploaded file
    console.log(req.file);
    // Extract title and filename from request body and multer upload
    const title = req.body.title;
    const fileName = req.file.filename;
    try {
        // Create a new document record in the database with title and filename
        await PdfSchema.create({ title: title, pdf: fileName })
        // Respond with success message if document creation is successful
        res.json({ status: "ok" })
    } catch (error) {
        // Respond with error message if document creation fails
        res.json({ status: error })
    }
})

// Handle GET request to retrieve all files
app.get("/getfiles", async (req, res) => {
    try {
        // Find all documents in the PdfSchema collection
        PdfSchema.find({}).then((data) => {
            // Respond with success status and data if documents are found
            res.send({ status: "ok", data: data })
        })
    } catch (error) {
        // Log any errors that occur during the process
        console.log(error)
    }
})

app.post('/extract', async (req, res) => {
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
        const pdfFilePath = path.join(__dirname, 'files', pdfFile);
        console.log('Loading PDF file:', pdfFilePath);

        try {
            // Load the existing PDF file as bytes
            const existingPdfBytes = fs.readFileSync(pdfFilePath);

            // Load the source PDF document
            const sourcePdf = await PDFDocument.load(existingPdfBytes);

            // Create a new PDF document
            const newPdf = await PDFDocument.create();

            // Copy the desired pages from the source document to the new document
            const pagesToCopy = pages.map(pageNumber => pageNumber - 1); // Adjust page indices if needed
            const copiedPages = await newPdf.copyPages(sourcePdf, pagesToCopy);

            // Add the copied pages to the new document
            copiedPages.forEach(page => newPdf.addPage(page));

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
});


// Mount userRoutes middleware to handle requests at the root endpoint
app.use('/', userRoutes)

const port = 8000;
app.listen(port, () => console.log(`server is running on port ${port}`))

