import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user.js';

const router = express.Router();

// 1) Create admin (requires ADMIN_SECURITY_KEY)
router.post('/create-admin', async (req, res) => {
  try {
    const { email, password, securityKey } = req.body;
    if (securityKey !== process.env.ADMIN_SECURITY_KEY)
      return res.status(401).json({ message: 'Invalid security key' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already exists' });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ email, passwordHash, role: 'admin' });

    return res.status(201).json({ message: 'Admin created', id: user._id, role: user.role });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

// 2) Register user
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already exists' });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ email, passwordHash, role: 'user' });

    return res.status(201).json({ message: 'User created', id: user._id, role: user.role });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

// 3) Login — no cookies, just respond with role
const jwt = require("jsonwebtoken");

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create a JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1d" }
    );

    return res.json({
      message: "Logged in",
      token,          // <--- this is your token
      role: user.role,
      email: user.email,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
});


// 4) Who am I? — just dummy response since no auth
router.get('/me', async (req, res) => {
  res.json({ id: 'demo', email: 'demo@example.com', role: 'admin' });
});

// 5) Logout — irrelevant now
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out (no cookies used)' });
});

export default router;
