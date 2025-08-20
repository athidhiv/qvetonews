import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);

  const categories = [
    { id: "all", name: "All News" },
    { id: "hot", name: "Hot" },
    { id: "politics", name: "Politics" },
    { id: "technology", name: "Technology" },
    { id: "sports", name: "Sports" },
    { id: "entertainment", name: "Entertainment" },
    { id: "business", name: "Business" }
  ];

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", { withCredentials: true });
        if (res.data) setUser(res.data);
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  // Logout
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Fetch news
  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("http://localhost:5000/api/users/feed", { withCredentials: true });
      setNews(Array.isArray(res.data.news) ? res.data.news : []);
    } catch (err) {
      console.error("Failed to fetch news:", err);
      setError("Failed to fetch news. Please try again later.");
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Filter news by category and search
  const filteredNews = news.filter(item => {
    const categoryMatch = activeCategory === "all" || (item.categories && item.categories.includes(activeCategory));
    const searchMatch = item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.content?.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  return (
    <div className="news-feed-container">
      {/* Navbar */}
      <nav className="news-nav">
        <div className="nav-container">
          <div className="nav-brand">
            <h1 className="brand-text">News<span className="brand-accent">Hub</span></h1>
          </div>
          <div className="nav-links">
            {categories.map(category => (
              <button
                key={category.id}
                className={activeCategory === category.id ? "nav-link active" : "nav-link"}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
          <div className="nav-actions">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search news..."
                className="search-input"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <button className="search-btn" onClick={() => fetchNews()}>Search</button>
            </div>
            {user ? (
              <button className="signin-btn" onClick={handleLogout}>Logout</button>
            ) : (
              <button className="signin-btn" onClick={() => navigate("/login")}>Sign In</button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-section">
        <div className="hero-content">
          <h2 className="hero-title">Stay Informed with the Latest News</h2>
          <p className="hero-subtitle">Curated stories from around the world</p>
        </div>
      </section>

      {/* Main */}
      <main className="main-content">
        <div className="content-container">
          <h2 className="section-title">Latest News</h2>

          {/* Loading */}
          {loading && <p>Loading news...</p>}

          {/* Error */}
          {!loading && error && <p>{error}</p>}

          {/* News Grid */}
          {!loading && !error && filteredNews.length > 0 && (
            <div className="news-grid">
              {filteredNews.map(item => (
                <div
                  key={item._id}
                  className="news-card"
                  onClick={() => navigate(`/news-panel/${item._id}`)}
                >
                  <img
                    src={item.image || `https://picsum.photos/600/400?random=${Math.floor(Math.random() * 100)}`}
                    alt={item.title}
                    className="news-image"
                  />
                  <div className="news-content">
                    <h3 className="news-title">{item.title}</h3>
                    <p className="news-description">{item.content || item.description}</p>
                    <p className="news-date">{item.published_at ? new Date(item.published_at).toLocaleDateString() : "Unknown date"}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && !error && filteredNews.length === 0 && (
            <p>No news found for this category or search.</p>
          )}
        </div>
      </main>
    </div>
  );
}
