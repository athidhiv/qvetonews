// src/components/NewsFeed.jsx

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function NewsFeed() {
  const [news, setNews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef(null);

  // Fetch news from backend
  const fetchNews = async (pageNo = 1, reset = false) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/users/news?page=${pageNo}&search=${searchTerm}&sort=${sortOrder}`
      );
      const fetched = response.data;

      if (fetched.length === 0) {
        setHasMore(false);
      }

      setNews(prev =>
        reset ? fetched : [...prev, ...fetched]
      );
    } catch (err) {
      console.error('Failed to fetch news', err);
    }
  };

  // Search or sort trigger
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchNews(1, true);
  }, [searchTerm, sortOrder]);

  // Infinite Scroll trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 1.0 }
    );
    if (loader.current) observer.observe(loader.current);
    return () => observer.disconnect();
  }, [hasMore]);

  // Load more when page changes
  useEffect(() => {
    if (page > 1) fetchNews(page);
  }, [page]);

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1rem' }}>
      <h2>🗞️ News Feed</h2>

      {/* Search */}
      <input
        type="text"
        placeholder="Search news..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
      />

      {/* Sort */}
      <select
        value={sortOrder}
        onChange={e => setSortOrder(e.target.value)}
        style={{ marginBottom: '1rem', padding: '0.5rem' }}
      >
        <option value="desc">Newest First</option>
        <option value="asc">Oldest First</option>
      </select>

      {/* News List */}
      {news.map((item, idx) => (
        <div
          key={idx}
          style={{
            border: '1px solid #ccc',
            padding: '1rem',
            marginBottom: '1rem',
            borderRadius: '8px'
          }}
        >
          <h3>{item.headline}</h3>
          <p>{item.description}</p>
          <small>🕒 {new Date(item.createdAt).toLocaleString()}</small>
        </div>
      ))}

      {/* Loader */}
      {hasMore ? (
        <div ref={loader} style={{ textAlign: 'center' }}>
          ⏳ Loading more...
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>🚫 No more news.</div>
      )}
    </div>
  );
}

export default NewsFeed;
