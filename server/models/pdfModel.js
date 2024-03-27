const mongoose = require("mongoose");

const pdfSchema = new mongoose.Schema({
    pdf: String,
    title: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { collection: "PdfDetails" })

const PdfModel = mongoose.model("PdfDetails", pdfSchema)

module.exports = PdfModel