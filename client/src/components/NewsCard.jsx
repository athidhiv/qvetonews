import React from 'react';
import { Calendar, Clock, Eye } from 'lucide-react';

const NewsCard = ({ news }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <article className="news-card">
      <div className="news-image-container">
        <img
          src={news.imageUrl || '/api/placeholder/400/250'}
          alt={news.headline}
          className="news-image"
        />
        <span className="news-category">{news.category}</span>
      </div>
      
      <div className="news-content">
        <h3 className="news-title">{news.headline}</h3>
        <p className="news-description">{news.description}</p>
        
        <div className="news-meta">
          <div className="meta-items">
            <span className="meta-item">
              <Calendar size={14} />
              {formatDate(news.createdAt)}
            </span>
          </div>
          <span className="meta-item">
            <Eye size={14} />
            1.2k
          </span>
        </div>
      </div>
    </article>
  );
};

export default NewsCard;