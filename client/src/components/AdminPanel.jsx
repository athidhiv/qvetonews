import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  PlusCircle, Bookmark, Globe, LogOut,
  Crown, Eye, Heart, Flame, Trash2,
  Upload, Download, User
} from "lucide-react";

export default function AdminPanel() {
  const [news, setNews] = useState([]);
  const [externalNews, setExternalNews] = useState([]);
  const [form, setForm] = useState({ title: "", content: "", image: "", source: "manual" });
  const [activeTab, setActiveTab] = useState("manual");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Note: in a real app, this should be a robust auth check, 
  // currently we're keeping the basic localStorage implementation for continuity
  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    // For local dev without a concrete token check yet, we'll bypass strict redirection 
    // unless explicitly stated it's user.
    if (userRole === "user") {
      alert("Access denied. Admins only.");
      navigate("/login");
    }
  }, [navigate, userRole]);

  const fetchNews = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/news/`, { withCredentials: true });
      setNews(res.data);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  const fetchExternal = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/news/external`, { withCredentials: true });
      setExternalNews(res.data);
    } catch (error) {
      console.error("Error fetching external news:", error);
    }
  };

  useEffect(() => {
    fetchNews();
    if (activeTab === 'external') {
      fetchExternal();
    }
  }, [activeTab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/news/`, form, { withCredentials: true });
      setForm({ title: "", content: "", image: "", source: "manual" });
      alert("Article published successfully!");
      fetchNews();
    } catch (error) {
      console.error("Error creating news:", error);
      alert("Failed to publish article. Ensure you are an Admin.");
    } finally {
      setLoading(false);
    }
  };

  const makeHot = async (id) => {
    try {
      await axios.patch(`${API_URL}/api/news/${id}/hot`, {}, { withCredentials: true });
      fetchNews();
    } catch (error) {
      console.error("Error marking as hot:", error);
    }
  };

  const deleteNews = async (id) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;
    try {
      await axios.delete(`${API_URL}/api/news/${id}`, { withCredentials: true });
      fetchNews();
    } catch (error) {
      console.error("Error deleting news:", error);
    }
  };

  const uploadExternal = async (item) => {
    try {
      await axios.post(`${API_URL}/api/news`, {
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
      }, { withCredentials: true });
      alert("Imported successfully!");
      fetchNews();
    } catch (error) {
      console.error("Error uploading external news:", error);
      alert("Failed to import. You might not have admin rights.");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans">

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col shadow-sm relative z-10 transition-all duration-300">
        <div className="p-6 border-b border-gray-100 flex items-center space-x-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Crown className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-gray-900">Admin</h2>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto hidden-scrollbar">
          <button
            onClick={() => setActiveTab("manual")}
            className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activeTab === "manual" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
          >
            <PlusCircle className="h-5 w-5" />
            <span>Create News</span>
          </button>

          <button
            onClick={() => setActiveTab("saved")}
            className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activeTab === "saved" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
          >
            <Bookmark className="h-5 w-5" />
            <span>Saved News</span>
          </button>

          <button
            onClick={() => setActiveTab("external")}
            className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activeTab === "external" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
          >
            <Globe className="h-5 w-5" />
            <span>External API</span>
          </button>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-600 rounded-xl hover:bg-red-50 hover:text-red-700 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Exit Dashboard</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">

        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sm:px-8 shadow-sm z-0">
          <h1 className="text-lg font-semibold text-gray-900">
            {activeTab === 'manual' && "Article Editor"}
            {activeTab === 'saved' && "Published Articles"}
            {activeTab === 'external' && "External Sources"}
          </h1>
          <div className="flex items-center space-x-3 bg-gray-50 py-1.5 px-3 rounded-full border border-gray-200">
            <div className="bg-blue-600 text-white p-1 rounded-full">
              <User className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium text-gray-700 pr-1">Admin User</span>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-gray-50">
          <div className="max-w-5xl mx-auto">

            {/* === MANUAL UPLOAD TAB === */}
            {activeTab === "manual" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <PlusCircle className="h-5 w-5 text-blue-600 mr-2" />
                    Compose Article
                  </h3>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Headline</label>
                    <input
                      type="text"
                      required
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow text-gray-900"
                      placeholder="Catchy news headline..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Article Body</label>
                    <textarea
                      required
                      rows="8"
                      value={form.content}
                      onChange={(e) => setForm({ ...form, content: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow text-gray-900 resize-y"
                      placeholder="Write your story here..."
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
                    <div className="flex rounded-lg shadow-sm">
                      <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                        https://
                      </span>
                      <input
                        type="text"
                        value={form.image}
                        onChange={(e) => setForm({ ...form, image: e.target.value })}
                        className="flex-1 block w-full px-4 py-2 rounded-none rounded-r-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="example.com/image.jpg"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center justify-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      ) : (
                        <Upload className="h-5 w-5 mr-2" />
                      )}
                      {loading ? "Publishing..." : "Publish Article"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* === SAVED NEWS TAB === */}
            {activeTab === "saved" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden min-h-[500px]">
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Bookmark className="h-5 w-5 text-blue-600 mr-2" />
                    Manage Library
                  </h3>
                  <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                    {news.length} Articles
                  </span>
                </div>

                <div className="p-0 sm:p-6">
                  {news.length === 0 ? (
                    <div className="text-center py-20">
                      <Bookmark className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900">No articles found</h3>
                      <p className="mt-1 text-sm text-gray-500">Get started by creating a new article or importing one.</p>
                      <button onClick={() => setActiveTab('manual')} className="mt-6 text-blue-600 font-medium hover:underline">
                        Compose now &rarr;
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-6">
                      {news.map((item) => (
                        <div key={item._id} className="flex flex-col sm:flex-row bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow group">
                          <div className="w-full sm:w-48 h-48 sm:h-auto bg-gray-100 flex-shrink-0 relative">
                            <img
                              src={item.image || `https://picsum.photos/400/300?random=${item._id}`}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                            {item.isHot && (
                              <div className="absolute top-2 left-2 bg-red-500 text-white p-1 rounded-full shadow-lg">
                                <Flame className="h-4 w-4" />
                              </div>
                            )}
                          </div>
                          <div className="p-5 flex flex-col flex-1">
                            <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{item.title}</h4>

                            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                              <span className="flex items-center"><Eye className="h-4 w-4 mr-1" /> {item.views || 0}</span>
                              <span className="flex items-center"><Heart className="h-4 w-4 mr-1" /> {item.likes || 0}</span>
                            </div>

                            <div className="mt-auto flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                              <button
                                onClick={() => makeHot(item._id)}
                                className={`flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${item.isHot ? 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                                  }`}
                              >
                                <Flame className={`h-3.5 w-3.5 mr-1 ${item.isHot ? 'fill-current' : ''}`} />
                                {item.isHot ? "Unmark Hot" : "Mark Hot"}
                              </button>
                              <button
                                onClick={() => deleteNews(item._id)}
                                className="flex items-center px-3 py-1.5 text-xs font-semibold bg-red-50 text-red-600 border border-red-100 rounded-lg hover:bg-red-100 transition-colors ml-auto"
                              >
                                <Trash2 className="h-3.5 w-3.5 mr-1" />
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* === EXTERNAL IMPORT TAB === */}
            {activeTab === "external" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden min-h-[500px]">
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Globe className="h-5 w-5 text-blue-600 mr-2" />
                    TheNewsAPI Integration
                  </h3>
                </div>

                <div className="p-0 sm:p-6">
                  {externalNews.length === 0 ? (
                    <div className="text-center py-20">
                      <div className="animate-pulse flex justify-center mb-4">
                        <Globe className="h-12 w-12 text-blue-300" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">Fetching live feeds...</h3>
                      <p className="mt-1 text-sm text-gray-500">Please ensure your backend NEWS_API2 key is valid.</p>
                    </div>
                  ) : (
                    <div className="grid text-left grid-cols-1 md:grid-cols-2 gap-6">
                      {externalNews.map((item, idx) => (
                        <div key={idx} className="flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow group">
                          <div className="w-full h-40 bg-gray-100 relative">
                            <img
                              src={item.image_url || `https://picsum.photos/400/200?random=${idx + 100}`}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-5 flex flex-col flex-1">
                            <h4 className="text-md font-bold text-gray-900 mb-2 line-clamp-2">{item.title}</h4>
                            <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1">{item.description}</p>

                            <button
                              onClick={() => uploadExternal(item)}
                              className="w-full flex justify-center items-center px-4 py-2 mt-auto text-sm font-semibold bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                            >
                              <Download className="h-4 w-4 mr-2" /> Import Article
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}