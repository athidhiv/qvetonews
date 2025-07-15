const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
  headline: String,
  description: String,
  category: String,
  imageUrl: String, // store filename or full URL
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('News', NewsSchema);
