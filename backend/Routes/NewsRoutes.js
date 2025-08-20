import express from "express";
import axios from "axios";

import News from "../models/news.js";
import { requireAuth, requireAdmin } from "../middleware/Auth.js";

const router = express.Router();

// ----------------- ADMIN ROUTES -----------------
// All CRUD routes for managing news are admin-only
router.get("/external", async (req, res) => {
  try {
    const apiKey = process.env.NEWS_API2;
    const response = await axios.get(
      `https://api.thenewsapi.com/v1/news/top?api_token=${apiKey}&locale=us&limit=10`
    );
    res.json(response.data.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Create news
router.post("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const news = new News(req.body);
    await news.save();
    res.status(201).json(news);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ error: "News not found" });
    res.json({ news, userLiked: req.user ? req.user.likedNews.includes(news._id) : false });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update news
router.put("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!news) return res.status(404).json({ error: "News not found" });
    res.json(news);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete news
router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    if (!news) return res.status(404).json({ error: "News not found" });
    res.json({ message: "News deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all news (for admins only)
router.get("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const news = await News.find();
    res.json(news);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
router.patch("/:id/hot", requireAuth, requireAdmin, async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(req.params.id, { isHot: true }, { new: true });
    if (!news) return res.status(404).json({ error: "News not found" });
    res.json(news);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
