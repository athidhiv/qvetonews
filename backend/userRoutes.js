const express = require('express');
const router = express.Router();
const User = require('../models/user');
const News = require('../models/news');

// Utility: Shuffle an array randomly
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

// GET news feed (login optional)
router.get('/newsfeed', async (req, res) => {
  try {
    const userId = req.query.userId; // Optional user ID (passed via query param)

    // If user is not logged in, show recent news sorted by createdAt
    if (!userId) {
      const generalNews = await News.find().sort({ createdAt: -1 }).limit(20);
      return res.json({
        loggedIn: false,
        news: generalNews,
      });
    }

    // If user is logged in, fetch user and prepare custom feed
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const preferredCategories = user.preferredCategories || [];

    // Fetch news in preferred categories
    const categoryNews = await News.find({
      category: { $in: preferredCategories },
    }).sort({ createdAt: -1 }).limit(10);

    // Fetch general recent news excluding already shown preferred
    const recentNews = await News.find({
      category: { $nin: preferredCategories },
    }).sort({ createdAt: -1 }).limit(10);

    // 🔒 Future: When place support is added in News schema
    // const placeNews = await News.find({
    //   place: { $in: user.preferredPlaces },
    // }).sort({ createdAt: -1 });

    // Mix and shuffle preferred + recent
    const finalNewsFeed = [...categoryNews, ...recentNews];
    const shuffled = shuffleArray(finalNewsFeed).slice(0, 20); // Limit to 20 items

    return res.json({
      loggedIn: true,
      userId: userId,
      preferredCategories: preferredCategories,
      news: shuffled,
    });

  } catch (error) {
    console.error('Error generating news feed:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
