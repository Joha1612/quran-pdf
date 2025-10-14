const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { convertPdfToJpg } = require('./convert');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

const uploadsDir = path.join(__dirname, 'uploads');
const publicImagesDir = path.join(__dirname, '..', 'public', 'images');

fs.mkdirSync(uploadsDir, { recursive: true });
fs.mkdirSync(publicImagesDir, { recursive: true });

// Multer setup
const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random()*1e6) + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Serve static files
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/images', express.static(publicImagesDir));

// Upload & convert PDF
app.post('/upload', upload.single('pdf'), async (req, res) => {
  try {
    if(!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const pdfPath = req.file.path;
    const jobId = uuidv4();
    const outDir = path.join(publicImagesDir, jobId);
    fs.mkdirSync(outDir, { recursive: true });

    // Convert PDF to JPG
    const result = await convertPdfToJpg(pdfPath, outDir, 'page', 90);

    const files = fs.readdirSync(outDir)
      .filter(f => f.match(/\.jpe?g$/i))
      .sort()
      .map(f => `/images/${jobId}/${f}`);

    // Delete uploaded PDF
    try { fs.unlinkSync(pdfPath); } catch(e){}

    res.json({ jobId, count: files.length, files });
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Conversion failed' });
  }
});

// Catch-all route
app.get('*', (req,res) => {
  res.sendFile(path.resolve(__dirname, '..', 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
