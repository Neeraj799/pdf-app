const mongoose = require("mongoose");

const pdfSchema = new mongoose.Schema({
    pdf: String,
    title: String
}, { collection: "PdfDetails" })

const PdfModel = mongoose.model("PdfDetails", pdfSchema)

module.exports = PdfModel