const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true,
  },
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },

  preferredCategories: {
    type: [String], // e.g., ['technology', 'sports']
    default: [],
  },

  preferredPlaces: {
    type: [String], // e.g., ['India', 'USA']
    default: [],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', userSchema);
