import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./NewsPanel.css";

export default function NewsPanel() {
  const { id } = useParams(); // news id from URL
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  // Fetch news by ID
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/news/${id}`);
        setNews(res.data.news);
        setLikesCount(res.data.news.likes || 0);
        setLiked(res.data.news.userLiked || false); // boolean if current user liked
      } catch (err) {
        console.error("Failed to fetch news:", err);
        setError("Failed to load news. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [id]);

  // Handle like/unlike
  const toggleLike = async () => {
    try {
      const res = await axios.post(`http://localhost:5000/api/news/${id}/like`);
      setLiked(res.data.liked);
      setLikesCount(res.data.likesCount);
    } catch (err) {
      console.error("Failed to like news:", err);
      setError("Could not like news");
    }
  };


  if (loading) return <p>Loading news...</p>;
  if (error) return <p>{error}</p>;
  if (!news) return <p>News not found.</p>;

  return (
    <div className="news-panel-container">
      <h1 className="news-panel-title">{news.title}</h1>
      <p className="news-panel-date">{news.published_at ? new Date(news.published_at).toLocaleDateString() : "Unknown date"}</p>
      {news.image && <img src={news.image} alt={news.title} className="news-panel-image" />}
      <p className="news-panel-content">{news.content || news.description}</p>

      <div className="news-panel">
      <h2>{news.title}</h2>
      <p>{news.content || news.description}</p>
      <button onClick={toggleLike}>
        {liked ? "❤️ Liked" : "🤍 Like"} ({likesCount})
      </button>
    </div>
    </div>
  );
}
