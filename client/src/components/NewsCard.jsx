import React from 'react'

const NewsCard = ({ news }) => {
  return (
    <div className="border rounded-md p-4 shadow">
      <h2 className="text-xl font-semibold">{news.headline}</h2>
      <p className="text-gray-700">{news.description}</p>
      <div className="text-sm text-gray-500 mt-2">
        🏷 {news.category} | 📍 {news.place} | 📅 {new Date(news.createdAt).toLocaleDateString()}
      </div>
    </div>
  )
}

export default NewsCard
