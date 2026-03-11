import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Clock, Heart, Share2, BookmarkPlus } from "lucide-react";

export default function NewsPanel() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/api/news/${id}`);
        setNews(res.data.news);
        setLikesCount(res.data.news.likes || 0);
        setLiked(res.data.news.userLiked || false);
      } catch (err) {
        console.error("Failed to fetch news:", err);
        setError("Failed to load news. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [id, API_URL]);

  const toggleLike = async () => {
    try {
      const res = await axios.post(`${API_URL}/api/news/${id}/like`, {}, { withCredentials: true });
      setLiked(res.data.liked);
      setLikesCount(res.data.likesCount);
    } catch (err) {
      console.error("Failed to like news:", err);
      // Optional: Redirect to login if unauthorized
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        alert("Could not like news. Please ensure you are logged in.");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">{error || "Article not found"}</p>
          <button onClick={() => navigate("/")} className="btn-primary w-full">
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* Top Nav for Return */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors py-2 px-3 rounded-lg hover:bg-gray-50 -ml-3"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span className="font-medium">Back to News</span>
          </button>

          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-colors">
              <Share2 className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-colors">
              <BookmarkPlus className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Article Header */}
        <header className="mb-10 text-center sm:text-left">
          {news.categories && news.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-6">
              {news.categories.map((cat, idx) => (
                <span key={idx} className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {cat}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight sm:leading-tight mb-6">
            {news.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center sm:justify-start text-sm text-gray-500 font-medium space-x-4 mb-8">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1.5" />
              <time dateTime={news.published_at}>
                {news.published_at ? new Date(news.published_at).toLocaleDateString(undefined, {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                }) : "Unknown date"}
              </time>
            </div>
            {news.author && (
              <div className="flex items-center">
                <span className="w-1 h-1 bg-gray-300 rounded-full mr-4"></span>
                By <span className="text-gray-900 ml-1">{news.author}</span>
              </div>
            )}
          </div>
        </header>

        {/* Article Hero Image */}
        <figure className="mb-12">
          <div className="w-full aspect-video sm:aspect-[21/9] bg-gray-100 rounded-2xl overflow-hidden shadow-sm relative">
            <img
              src={news.image || `https://picsum.photos/1200/600?random=${news._id || 1}`}
              alt={news.title}
              className="w-full h-full object-cover"
            />
          </div>
          {news.imageCaption && (
            <figcaption className="text-center text-sm text-gray-500 mt-3 italic">
              {news.imageCaption}
            </figcaption>
          )}
        </figure>

        {/* Article Body */}
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-lg prose-blue max-w-none text-gray-700 leading-relaxed font-serif">
            {/* If content is just plain text, format it nicely. Ideally this would be HTML or Markdown */}
            {news.content ? (
              news.content.split('\n').map((paragraph, idx) => (
                paragraph.trim() ? <p key={idx} className="mb-6">{paragraph}</p> : null
              ))
            ) : (
              <p className="text-xl text-gray-500 italic text-center">No content available for this article.</p>
            )}
          </div>

          /* Interactive Footer */
          <div className="mt-16 pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleLike}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all ${liked
                    ? "bg-red-50 text-red-600 border border-red-200"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
              >
                <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
                <span>{liked ? "Liked" : "Like Article"}</span>
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${liked ? "bg-red-100" : "bg-gray-200"}`}>
                  {likesCount}
                </span>
              </button>
            </div>

            <div className="text-sm font-medium text-gray-500">
              Tags: {(news.categories || ['News']).join(', ')}
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
