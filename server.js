const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, 'assets', 'wedding_app', 'images');
    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    // Use the original filename or generate a unique name
    const category = req.body.category || 'misc';
    const timestamp = Date.now();
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `${category}_${timestamp}${ext}`);
  }
});

const upload = multer({ storage: storage });

// Serve static files from the assets directory
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Handle image uploads
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  // Return the path to the uploaded file
  const filePath = `/assets/wedding_app/images/${req.file.filename}`;
  res.json({ 
    success: true, 
    filePath,
    originalName: req.file.originalname,
    size: req.file.size,
    mimetype: req.file.mimetype
  });
});

// Handle base64 image uploads
app.post('/api/upload-base64', (req, res) => {
  const { imageData, category = 'misc', filename } = req.body;
  
  if (!imageData) {
    return res.status(400).json({ error: 'No image data provided' });
  }
  
  try {
    // Extract the base64 data
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Create directory if it doesn't exist
    const dir = path.join(__dirname, 'assets', 'wedding_app', 'images');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Generate filename
    const timestamp = Date.now();
    const finalFilename = filename || `${category}_${timestamp}.jpg`;
    const filePath = path.join(dir, finalFilename);
    
    // Write the file
    fs.writeFileSync(filePath, buffer);
    
    // Return the path to the uploaded file
    res.json({ 
      success: true, 
      filePath: `/assets/wedding_app/images/${finalFilename}`,
      size: buffer.length
    });
  } catch (error) {
    console.error('Error saving base64 image:', error);
    res.status(500).json({ error: 'Failed to save image' });
  }
});

// API endpoint to save wedding data
app.post('/api/save-data', (req, res) => {
  const { key, data } = req.body;
  
  if (!key || !data) {
    return res.status(400).json({ error: 'Missing key or data' });
  }
  
  try {
    // Create directory if it doesn't exist
    const dir = path.join(__dirname, 'assets', 'wedding_app', 'data');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Write data to file
    const filePath = path.join(dir, `${key}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    
    res.json({ 
      success: true, 
      message: `Data saved to ${key}.json`
    });
  } catch (error) {
    console.error(`Error saving data to ${key}.json:`, error);
    res.status(500).json({ error: 'Failed to save data' });
  }
});

// API endpoint to get wedding data
app.get('/api/get-data/:key', (req, res) => {
  const { key } = req.params;
  
  try {
    const filePath = path.join(__dirname, 'assets', 'wedding_app', 'data', `${key}.json`);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Data not found' });
    }
    
    const data = fs.readFileSync(filePath, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error(`Error reading data from ${key}.json:`, error);
    res.status(500).json({ error: 'Failed to read data' });
  }
});

// Serve the main app for any other routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Image uploads will be saved to ${path.join(__dirname, 'assets', 'wedding_app', 'images')}`);
});
