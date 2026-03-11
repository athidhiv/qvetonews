import express from "express";
import User from "../models/user.js";
import { requireAuth } from "../middleware/Auth.js";

const router = express.Router();

// Get current preferences
router.get("/preferences", requireAuth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ error: "User not found" });

        res.json({
            preferredLocale: user.preferredLocale,
            preferredCategories: user.preferredCategories,
        });
    } catch (error) {
        console.error("Error fetching preferences:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Update preferences
router.put("/preferences", requireAuth, async (req, res) => {
    try {
        const { preferredCategories, preferredLocale } = req.body;
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ error: "User not found" });

        if (preferredCategories !== undefined) user.preferredCategories = preferredCategories;
        if (preferredLocale !== undefined) user.preferredLocale = preferredLocale;

        await user.save();

        res.json({
            message: "Preferences updated successfully",
            preferredCategories: user.preferredCategories,
            preferredLocale: user.preferredLocale
        });
    } catch (error) {
        console.error("Error updating preferences:", error);
        res.status(500).json({ error: "Server error" });
    }
});

export default router;
