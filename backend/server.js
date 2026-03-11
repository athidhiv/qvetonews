import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';

import authRoute from "./Routes/AuthRoutes.js";
import userRoute from "./Routes/userRoutes.js";
import newsRoute from "./Routes/NewsRoutes.js";
import preferenceRoute from "./Routes/preferenceRoutes.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cookieParser());

// Middleware
app.use(cors({
  origin: ['http://127.0.0.1:5173', 'http://localhost:5173'], // allow both frontend URLs
  credentials: true, // allow cookies
}));


// Routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/news", newsRoute);
app.use("/api/user-preferences", preferenceRoute);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error(err));
