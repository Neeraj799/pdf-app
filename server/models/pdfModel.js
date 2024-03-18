const mongoose = require("mongoose");

const PdfDetailsSchema = new mongoose.Schema({
    pdf: String,
    title: String
}, { collection: "PdfDetails" })

const pdfModel = mongoose.model("PdfDetails", PdfDetailsSchema)