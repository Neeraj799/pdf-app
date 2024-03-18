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

app.use("/files", express.static("files"))

//multer to insert files
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './files')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now()
        cb(null, uniqueSuffix + file.originalname)
    }
})

require("./models/pdfModel")
const PdfSchema = mongoose.model("PdfDetails");
const upload = multer({ storage: storage })

app.post("/upload", upload.single("file"), async (req, res) => {
    console.log(req.file);
    const title = req.body.title;
    const fileName = req.file.filename;
    try {
        await PdfSchema.create({ title: title, pdf: fileName })
        res.json({ status: "ok" })
    } catch (error) {
        res.json({ status: error })
    }
})

app.get("/getfiles", async (req, res) => {
    try {
        PdfSchema.find({}).then((data) => {
            res.send({ status: "ok", data: data })
        })
    } catch (error) {
        console.log(error)
    }
})

app.post('/extract', async (req, res) => {
    try {
        const { pages, pdfFile } = req.body;
        if (!pages || !Array.isArray(pages) || pages.length === 0) {
            return res.status(400).json({ error: 'Invalid pages selection' });
        }

        if (!pdfFile) {
            return res.status(400).json({ error: 'PDF file path not provided' });
        }

        const pdfFilePath = path.join(__dirname, 'files', pdfFile);

        const pdfDoc = await PDFDocument.load(fs.readFileSync(pdfFilePath));
        const extractedPages = await pdfDoc.getPages(pages);
        const newPdf = await PDFDocument.create();

        extractedPages.forEach(async (page) => {
            newPdf.addPage(page);
        });

        const newPdfBytes = await newPdf.save();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="extracted.pdf"');
        res.send(newPdfBytes);
    } catch (err) {
        console.error('Error extracting pages:', err);
        res.status(500).json({ error: 'An error occurred while extracting pages' });
    }
});

app.use('/', userRoutes)

const port = 8000;
app.listen(port, () => console.log(`server is running on port ${port}`))

