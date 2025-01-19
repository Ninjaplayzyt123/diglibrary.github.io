const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

// Set up storage configuration for uploaded PDFs
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads'); // Files will be stored in the "uploads" folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Use timestamp for unique filename
    }
});

// Create the multer instance with the storage configuration
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        // Only allow PDF files
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'), false);
        }
    }
});

// Serve static files from the "public" folder
app.use(express.static('public'));

// Handle file upload requests (via POST)
app.post('/upload', upload.single('pdf-file'), (req, res) => {
    if (req.file) {
        res.json({ message: 'File uploaded successfully', fileUrl: `/uploads/${req.file.filename}` });
    } else {
        res.status(400).json({ error: 'Failed to upload file' });
    }
});

// Serve files from the "uploads" folder
app.use('/uploads', express.static('uploads'));

// New route to get a list of all uploaded PDFs
app.get('/get-uploaded-pdfs', (req, res) => {
    fs.readdir('uploads', (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read uploads directory' });
        }
        
        // Filter out non-pdf files (if needed, you can adjust this for other files)
        const pdfFiles = files.filter(file => file.endsWith('.pdf'));

        // Return the list of PDFs with URLs
        const fileUrls = pdfFiles.map(file => `/uploads/${file}`);
        res.json({ pdfFiles: fileUrls });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
