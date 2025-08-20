import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      default: null, // present if fetched from API
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    url: {
      type: String,
      default: "",
    },
    source: {
      type: String,
      enum: ["manual", "api"],
      default: "manual",
    },
    locale: {
      type: String,
      default: "us",
    },
    language: {
      type: String,
      default: "en",
    },
    categories: {
      type: [String],
      default: [],
    },
    published_at: {
      type: Date,
    },
    isHot: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true } // adds createdAt & updatedAt
);

const News = mongoose.model("News", newsSchema);

export default News;
