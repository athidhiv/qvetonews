import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminPanel.css"; // We'll create this CSS file


export default function AdminPanel() {
  const [news, setNews] = useState([]);
  const [externalNews, setExternalNews] = useState([]);
  const [form, setForm] = useState({ title: "", content: "", image: "", source: "manual" });
  const [activeTab, setActiveTab] = useState("manual");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Get user role from localStorage (or your auth context)
  const userRole = localStorage.getItem("userRole"); // e.g., "admin" or "user"

  useEffect(() => {
    if (userRole !== "admin") {
      alert("Access denied. Admins only.");
      navigate("/login"); // redirect non-admins or not logged-in users
    }
  }, [navigate, userRole]);

  if (userRole !== "admin") return null; 
  // Load saved news
  const fetchNews = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/news/");
      setNews(res.data);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  // Load external API news
  const fetchExternal = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/news/external");
      setExternalNews(res.data);
    } catch (error) {
      console.error("Error fetching external news:", error);
    }
  };

  useEffect(() => {
    fetchNews();
    fetchExternal();
  }, []);

  // Create news
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/news/", form);
      setForm({ title: "", content: "", image: "", source: "manual" });
      fetchNews();
    } catch (error) {
      console.error("Error creating news:", error);
    } finally {
      setLoading(false);
    }
  };

  // Mark hot
  const makeHot = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/news/${id}/hot`);
      fetchNews();
    } catch (error) {
      console.error("Error marking as hot:", error);
    }
  };

  // Delete news
  const deleteNews = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/news/${id}`);
      fetchNews();
    } catch (error) {
      console.error("Error deleting news:", error);
    }
  };

  // Upload from external
  const uploadExternal = async (item) => {
    try {
      await axios.post("http://localhost:5000/api/news", {
        uuid: item.uuid,
        title: item.title,
        description: item.description,
        content: item.snippet || "",
        image: item.image_url,
        url: item.url,
        source: "api",
        locale: item.locale,
        language: item.language,
        categories: item.categories || [],
        published_at: item.published_at,
      });
      fetchNews();
    } catch (error) {
      console.error("Error uploading external news:", error);
    }
  };


  return (
    <div className="admin-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2><i className="fas fa-crown"></i> Admin Panel</h2>
        </div>
        <div className="nav-items">
          <div className={`nav-item ${activeTab === "manual" ? "active" : ""}`} onClick={() => setActiveTab("manual")}>
            <i className="fas fa-plus-circle"></i>
            <span>Create News</span>
          </div>
          <div className={`nav-item ${activeTab === "saved" ? "active" : ""}`} onClick={() => setActiveTab("saved")}>
            <i className="fas fa-bookmark"></i>
            <span>Saved News</span>
          </div>
          <div className={`nav-item ${activeTab === "external" ? "active" : ""}`} onClick={() => setActiveTab("external")}>
            <i className="fas fa-globe"></i>
            <span>External News</span>
          </div>
          <div className="nav-item" onClick={() => navigate("/")}>
            <i className="fas fa-sign-out-alt"></i>
            <span>Back to Site</span>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="main-content">
        <div className="header">
          <h1>News Management Dashboard</h1>
          <div className="user-info">
            <div className="user-avatar">A</div>
            <span>Admin User</span>
          </div>
        </div>
        
        {/* Manual Upload Form */}
        {activeTab === "manual" && (
          <div className="card">
            <div className="card-header">
              <h3 className="card-title"><i className="fas fa-plus-circle"></i> Create New Article</h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Enter news title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Content</label>
                <textarea 
                  className="form-textarea" 
                  placeholder="Enter news content"
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Enter image URL"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-upload"></i>}
                {loading ? " Uploading..." : " Upload News"}
              </button>
            </form>
          </div>
        )}
        
        {/* Saved News */}
        {activeTab === "saved" && (
          <div className="card">
            <div className="card-header">
              <h3 className="card-title"><i className="fas fa-bookmark"></i> Your News Articles</h3>
            </div>
            {news.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-newspaper"></i>
                <p>No news articles yet. Create your first one!</p>
              </div>
            ) : (
              <div className="news-list">
                {news.map((item) => (
                  <div key={item._id} className="news-item">
                    <div className="news-image">
                      <img src={item.image || "https://via.placeholder.com/300x160?text=No+Image"} alt={item.title} />
                    </div>
                    <div className="news-content">
                      <h4 className="news-title">{item.title}</h4>
                      <div className="news-stats">
                        <span><i className="fas fa-eye"></i> {item.views}</span>
                        <span><i className="fas fa-heart"></i> {item.likes}</span>
                        {item.isHot && <span className="hot-badge"><i className="fas fa-fire"></i> Hot</span>}
                      </div>
                      <div className="news-actions">
                        <button onClick={() => makeHot(item._id)} className="btn btn-sm btn-hot">
                          {item.isHot ? "Remove Hot" : "Make Hot"}
                        </button>
                        <button onClick={() => deleteNews(item._id)} className="btn btn-sm btn-delete">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* External News */}
        {activeTab === "external" && (
          <div className="card">
            <div className="card-header">
              <h3 className="card-title"><i className="fas fa-globe"></i> External News (from TheNewsAPI)</h3>
            </div>
            {externalNews.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-globe"></i>
                <p>No external news available at the moment.</p>
              </div>
            ) : (
              <div className="news-list">
                {externalNews.map((item, idx) => (
                  <div key={idx} className="news-item">
                    <div className="news-image">
                      <img src={item.image_url || "https://via.placeholder.com/300x160?text=No+Image"} alt={item.title} />
                    </div>
                    <div className="news-content">
                      <h4 className="news-title">{item.title}</h4>
                      <p className="news-description">{item.description}</p>
                      <div className="news-actions">
                        <button onClick={() => uploadExternal(item)} className="btn btn-sm btn-upload">
                          <i className="fas fa-download"></i> Import
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}