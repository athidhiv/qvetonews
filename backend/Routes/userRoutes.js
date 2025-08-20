import express from "express";
import User from "../models/user.js";
import News from "../models/news.js";
import { requireAuth } from "../middleware/Auth.js";

const router = express.Router();

// Utility: Shuffle an array randomly
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

// ---------------------- FEED ----------------------
router.get("/feed", async (req, res) => {
  try {
    console.log("Generating news feed...");
    const user = req.user || {}; // empty if guest
    const seenNewsIds = user.seenNews || [];
    const preferredCategories = user.preferredCategories || [];
    const preferredLocale = user.preferredLocale;
    const preferredLanguage = user.preferredLanguage;

    // Base query: exclude seen news for logged-in users
    const baseQuery = { _id: { $nin: seenNewsIds } };
    if (preferredLocale) baseQuery.locale = preferredLocale;

    // Step 0: Hot news (for both guests and logged-in users)
    const hotNews = await News.find({
      ...baseQuery,
      isHot: true,
    })
      .sort({ updatedAt: -1 })
      .limit(5);

    // Step 1: Preferred language news (if logged in)
    let languageNews = [];
    if (preferredLanguage) {
      languageNews = await News.find({
        ...baseQuery,
        language: preferredLanguage,
      })
        .sort({ createdAt: -1 })
        .limit(20);
    }

    // Step 2: Preferred category news (if logged in)
    let categoryNews = [];
    if (preferredCategories.length > 0) {
      categoryNews = await News.find({
        ...baseQuery,
        categories: { $in: preferredCategories },
      })
        .sort({ createdAt: -1 })
        .limit(20);
    }

    // Step 3: Latest general news
    const latestNews = await News.find({
      ...baseQuery,
    })
      .sort({ createdAt: -1 })
      .limit(20);

    // Combine in priority order: hot → latest → language → category, remove duplicates
    const newsMap = new Map();
    [...hotNews, ...latestNews, ...languageNews, ...categoryNews].forEach((n) => {
      newsMap.set(n._id.toString(), n);
    });

    const finalNewsFeed = Array.from(newsMap.values()).slice(0, 20);
    console.log(`Generated news feed with ${finalNewsFeed.length} items`);
    res.json({
      loggedIn: !!req.user,
      userId: user._id || null,
      preferredCategories,
      preferredLocale,
      preferredLanguage,
      news: finalNewsFeed,
    });
  } catch (error) {
    console.error("Error generating news feed:", error);
    res.status(500).json({ error: "Server error" });
  }
});


// ---------------------- LIKE ----------------------
// routes/news.js
router.post("/:id/like", requireAuth, async (req, res) => {
  try {
    const newsId = req.params.id;

    const news = await News.findById(newsId);
    if (!news) return res.status(404).json({ error: "News not found" });

    // Increment likes
    news.likes = (news.likes || 0) + 1;
    await news.save();

    // Track for logged-in user
    req.user.seenNews = req.user.seenNews || [];
    req.user.likedNews = req.user.likedNews || [];

    if (!req.user.seenNews.includes(news._id)) {
      req.user.seenNews.push(news._id);
    }

    if (!req.user.likedNews.includes(news._id)) {
      req.user.likedNews.push(news._id);
    }

    await req.user.save();

    res.json({ message: "News liked", likesCount: news.likes, liked: true });
  } catch (error) {
    console.error("Error liking news:", error);
    res.status(500).json({ error: "Server error" });
  }
});


// ---------------------- SEARCH ----------------------
router.get("/search", requireAuth, async (req, res) => {
  try {
    const { q, category, locale, language } = req.query;

    const query = {};
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: "i" } },
        { content: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }
    if (category) query.categories = category;
    if (locale) query.locale = locale;
    if (language) query.language = language;

    const results = await News.find(query).sort({ createdAt: -1 }).limit(50);
    res.json(results);
  } catch (error) {
    console.error("Error searching news:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ---------------------- SORT ----------------------
router.get("/sort", requireAuth, async (req, res) => {
  try {
    const { by = "time", order = "desc", includeSeen = true } = req.query;

    const sortOptions = {};
    if (by === "time") sortOptions.createdAt = order === "asc" ? 1 : -1;
    if (by === "hot") sortOptions.isHot = -1;
    if (by === "likes") sortOptions.likes = order === "asc" ? 1 : -1;
    if (by === "views") sortOptions.views = order === "asc" ? 1 : -1;

    const query = {};
    if (!includeSeen) {
      query._id = { $nin: req.user.seenNews || [] };
    }

    const news = await News.find(query).sort(sortOptions).limit(50);
    res.json(news);
  } catch (error) {
    console.error("Error sorting news:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
