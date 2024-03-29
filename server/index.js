const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');
const dotenv = require('dotenv')
const userRoutes = require('./routes/authRoutes')
const pdfRoutes = require('./routes/pdfRoutes');
const { validateUser } = require('./middlewares/authMiddleware');


dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;


// Middleware
app.use(express.json())
app.use(cors({
    credentials: true,
    origin: "http://127.0.0.1:5173" // Update the origin to allow requests from your frontend application
}));

// Routes
app.use('/', userRoutes)
app.use('/pdf', pdfRoutes)


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('Database not connected', err))



// Serve static files from the 'files' directory
app.use("/files", express.static("files"))

app.listen(PORT, () => console.log(`server is running on port ${PORT}`))