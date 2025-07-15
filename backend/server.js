const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');// Middleware for handling file uploads   
const News = require('./models/news');
const app = express();
const port = 3000;
require('dotenv').config(); // Load environment variables from .env file   

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully!');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
  });
// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

app.get('/', (req, res) => {
  res.send('✅ Backend is up and running!');
});

// Route: Handle news upload
app.post('/news', upload.single('image'), async (req, res) => {
  try {
    const { headline, description, category } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    const newNews = new News({
      headline,
      description,
      category,
      imageUrl
    });

    await newNews.save();

    res.status(201).json({ message: '✅ News uploaded successfully', data: newNews });
  } catch (error) {
    console.error('❌ Error saving news:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/newslist', async (req,res)=>{
  try{
    const newsList = await News.find();
    res.status(200).json(newsList);
  }
  catch(error){
    console.error('❌ Error fetching news list:', error);
    res.status(500).json({ message: 'Server error' });
  } 
});
// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
