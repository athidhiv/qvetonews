import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Search, LogIn, LogOut, Menu, X, Flame, Clock, Settings, Save } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Settings Modal State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [preferredCategories, setPreferredCategories] = useState([]);
  const [savingSettings, setSavingSettings] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const categories = [
    { id: "all", name: "All News" },
    { id: "hot", name: "Hot" },
    { id: "politics", name: "Politics" },
    { id: "technology", name: "Technology" },
    { id: "sports", name: "Sports" },
    { id: "entertainment", name: "Entertainment" },
    { id: "business", name: "Business" }
  ];

  // Fetch current user & preferences
  useEffect(() => {
    const fetchUserAndPrefs = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/auth/me`, { withCredentials: true });
        if (res.data) {
          setUser(res.data);
          // If user logged in, fetch their preferences
          try {
            const prefRes = await axios.get(`${API_URL}/api/user-preferences/preferences`, { withCredentials: true });
            if (prefRes.data.preferredCategories) {
              setPreferredCategories(prefRes.data.preferredCategories);
            }
          } catch (e) {
            console.log("Could not load preferences", e);
          }
        }
      } catch {
        setUser(null);
      }
    };
    fetchUserAndPrefs();
  }, [API_URL]);

  // Logout
  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/api/auth/logout`, {}, { withCredentials: true });
      setUser(null);
      setPreferredCategories([]);
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
      // The backend /feed route handles personalization natively utilizing the user cookie.
      const res = await axios.get(`${API_URL}/api/users/feed`, { withCredentials: true });
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
  }, []); // Re-run when component mounts, feed relies on cookie which is implicit

  // Handle Settings Save
  const saveSettings = async () => {
    setSavingSettings(true);
    try {
      await axios.put(`${API_URL}/api/user-preferences/preferences`, {
        preferredCategories
      }, { withCredentials: true });
      setIsSettingsOpen(false);
      // Refresh feed with new preferences
      fetchNews();
    } catch (e) {
      console.error("Failed to save settings", e);
      alert("Failed to save preferences. Please try again.");
    } finally {
      setSavingSettings(false);
    }
  };

  const togglePreferenceCategory = (catId) => {
    setPreferredCategories(prev =>
      prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
    );
  };

  // Filter news by category and search (Client side filtering beyond the tailored feed)
  const filteredNews = news.filter(item => {
    const categoryMatch = activeCategory === "all" || item.categories?.includes(activeCategory);
    const searchMatch = item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content?.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans relative">

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-blue-600" /> Personalize Feed
              </h3>
              <button onClick={() => setIsSettingsOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-500 mb-6">Select the topics you care about most. We'll tailor your front page feed to prioritize these categories.</p>

              <div className="flex flex-wrap gap-3 mb-8">
                {categories.filter(c => c.id !== 'all' && c.id !== 'hot').map(category => {
                  const isSelected = preferredCategories.includes(category.id);
                  return (
                    <button
                      key={category.id}
                      onClick={() => togglePreferenceCategory(category.id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${isSelected
                          ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm ring-1 ring-blue-500"
                          : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                      {category.name}
                      {isSelected && <span className="ml-2">✓</span>}
                    </button>
                  );
                })}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="flex-1 py-2.5 px-4 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveSettings}
                  disabled={savingSettings}
                  className="flex-1 flex justify-center items-center py-2.5 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70"
                >
                  {savingSettings ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <><Save className="w-4 h-4 mr-2" /> Save Feed</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate("/")}>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                Qveto<span className="text-blue-600">News</span>
              </h1>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-1 overflow-x-auto no-scrollbar ml-10">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 whitespace-nowrap ${activeCategory === category.id
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Icons & Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all w-64"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>

              {user ? (
                <div className="flex items-center space-x-3 border-l border-gray-200 pl-4 ml-2">
                  <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="p-2 text-gray-500 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 rounded-full transition-colors"
                    title="Personalize Feed"
                  >
                    <Settings className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-500 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded-full transition-colors"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <button onClick={() => navigate("/login")} className="btn-primary flex items-center space-x-2">
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden space-x-2">
              {user && (
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="p-2 text-gray-500 bg-gray-50 rounded-full"
                >
                  <Settings className="h-5 w-5" />
                </button>
              )}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-gray-900 focus:outline-none p-2"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Content */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-2 pb-4 shadow-lg absolute w-full left-0 z-40">
            <div className="px-4 pb-4 pt-2">
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              <div className="flex flex-col space-y-1">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => { setActiveCategory(category.id); setIsMenuOpen(false); }}
                    className={`text-left px-4 py-3 rounded-lg text-base font-medium transition-colors ${activeCategory === category.id
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
              <div className="mt-4 border-t border-gray-100 pt-4 px-2">
                {user ? (
                  <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="w-full flex items-center justify-center text-red-600 font-medium py-3 bg-red-50 rounded-lg">
                    <LogOut className="w-5 h-5 mr-2" /> Logout
                  </button>
                ) : (
                  <button onClick={() => navigate("/login")} className="w-full btn-primary py-3">
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header Section */}
        <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-gray-200 pb-4 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center">
              {activeCategory === "hot" ? <Flame className="h-7 w-7 text-red-500 mr-2" /> : "Latest Headlines"}
            </h2>
            <p className="text-gray-500 mt-1">
              {activeCategory === "all" && user && preferredCategories.length > 0
                ? "A personalized mix of top stories, hot news, and your selected topics"
                : activeCategory === "all"
                  ? "Curated stories from around the globe"
                  : `Top stories in ${categories.find(c => c.id === activeCategory)?.name || activeCategory}`
              }
            </p>
          </div>

          {!loading && !error && filteredNews.length > 0 && (
            <div className="flex items-center text-sm font-medium text-gray-500 bg-white px-3 py-1.5 rounded-full border border-gray-200 self-start sm:self-auto">
              <Clock className="h-4 w-4 mr-2 text-blue-500" /> Updated moments ago
            </div>
          )}
        </div>

        {/* Content State */}
        {loading && (
          <div className="flex justify-center flex-col items-center h-64 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-500 font-medium animate-pulse">Curating your feed...</p>
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-8 rounded-xl text-center shadow-sm max-w-lg mx-auto">
            <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500 shadow-sm">
              <X className="w-6 h-6" />
            </div>
            <p className="font-bold text-lg mb-2">Feed Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && filteredNews.length === 0 && (
          <div className="text-center py-20 bg-white border border-gray-100 rounded-2xl shadow-sm max-w-2xl mx-auto">
            <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No articles found</h3>
            <p className="text-gray-500 mb-6">We couldn't find any news matching your criteria.</p>
            <button
              onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}
              className="btn-secondary"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* News Grid (Modern Masonry/Bento styling representation) */}
        {!loading && !error && filteredNews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {/* Featured Article - first element if viewing all news */}
            {filteredNews.map((item, index) => (
              <article
                key={item._id}
                className={`card group cursor-pointer flex flex-col ${index === 0 && activeCategory === 'all' ? 'lg:col-span-2 lg:flex-row' : ''}`}
                onClick={() => navigate(`/news-panel/${item._id}`)}
              >
                <div className={`relative overflow-hidden bg-gray-200 ${index === 0 && activeCategory === 'all' ? 'lg:w-2/3 lg:h-auto min-h-[300px]' : 'h-52 aspect-video'}`}>
                  <img
                    src={item.image || `https://picsum.photos/800/600?random=${Math.floor(Math.random() * 100) + index}`}
                    alt={item.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Category tag */}
                  {item.categories && item.categories[0] && (
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm backdrop-blur-sm bg-blue-600/90">
                        {item.categories[0]}
                      </span>
                    </div>
                  )}
                  {/* Hot tag */}
                  {item.isHot && (
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-lg z-10">
                      <Flame className="h-4 w-4 text-red-500" />
                    </div>
                  )}

                  {/* Gradient Overlay for Featured Article */}
                  {index === 0 && activeCategory === 'all' && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 lg:opacity-100 transition-opacity"></div>
                  )}
                </div>

                <div className={`p-6 flex flex-col flex-grow ${index === 0 && activeCategory === 'all' ? 'lg:w-1/3 lg:justify-center bg-white z-20' : ''}`}>
                  <h3 className={`font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-3 leading-snug ${index === 0 && activeCategory === 'all' ? 'text-2xl lg:text-3xl lg:-ml-12 lg:bg-white lg:p-4 lg:rounded-xl lg:shadow-xl lg:mt-0 mt-4' : 'text-xl'}`}>
                    {item.title}
                  </h3>
                  <p className={`text-gray-600 text-sm mb-4 line-clamp-3 ${index === 0 && activeCategory === 'all' ? 'lg:line-clamp-5' : ''}`}>
                    {item.content || item.description}
                  </p>

                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
                    <span>{item.published_at ? new Date(item.published_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : "Recently Added"}</span>
                    <span className="flex items-center text-blue-600 font-semibold group-hover:translate-x-1 transition-transform">
                      Read story &rarr;
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Simple Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} QvetoNews. All rights reserved. Built with modern web aesthetics.
        </div>
      </footer>
    </div>
  );
}
