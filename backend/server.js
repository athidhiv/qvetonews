const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');// Middleware for handling file uploads   
const News = require('./models/news');
const userRoutes = require('./routes/userRoutes');
const app = express();
const port = 3000;
const path = require('path');
require('dotenv').config(); // Load environment variables from .env file   

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/users', userRoutes);
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
// Route: Edit (Update) news by ID
app.put('/newsedit/:id', upload.single('image'), async (req, res) => {
  try {
    const { headline, description, category } = req.body;
    const updateData = { headline, description, category };

    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedNews = await News.findByIdAndUpdate(req.params.id, updateData, {
      new: true, // Return the updated document
    });

    if (!updatedNews) {
      return res.status(404).json({ message: 'News not found' });
    }

    res.json({ message: '✅ News updated', data: updatedNews });
  } catch (error) {
    console.error('❌ Error updating news:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route: Delete news by ID
app.delete('/newsdelete/:id', async (req, res) => {
  try {
    const deletedNews = await News.findByIdAndDelete(req.params.id);
    if (!deletedNews) {
      return res.status(404).json({ message: 'News not found' });
    }

    res.json({ message: '🗑️ News deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting news:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
