const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { uploadPdf, getAllFiles, extractPages } = require('../controllers/pdfController')

// Configure disk storage for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './files');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, uniqueSuffix + file.originalname);
    },
});

const upload = multer({ storage: storage });

// Define your PDF routes here
router.post('/upload', upload.single('file'), uploadPdf);
router.get('/getfiles', getAllFiles);
router.post('/extract', extractPages);

module.exports = router;