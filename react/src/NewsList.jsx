import axios from 'axios';
import React, { useState, useEffect } from 'react';

function NewsTable() {
  const [newsList, setNewsList] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);

  const fetchNewsList = async () => {
    try {
      const res = await axios.get('http://localhost:3000/newslist');
      setNewsList(res.data);
    } catch (err) {
      console.error('Error fetching news list:', err);
    }
  };

  const deleteNews = async (id) => {
    if (!window.confirm('Are you sure you want to delete this news?')) return;
    try {
      await axios.delete(`http://localhost:3000/news/${id}`);
      fetchNewsList();
    } catch (err) {
      console.error('Error deleting news:', err);
    }
  };

  useEffect(() => {
    fetchNewsList();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">📰 News Table</h1>
      <table className="w-full table-auto border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">Headline</th>
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Category</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {newsList.map((news) => (
            <tr key={news._id} className="text-center">
              <td className="p-2 border cursor-pointer text-blue-600 hover:underline" onClick={() => setSelectedNews(news)}>{news.headline}</td>
              <td className="p-2 border">{news.description.slice(0, 50)}...</td>
              <td className="p-2 border">{news.category}</td>
              <td className="p-2 border">
                <button onClick={() => setSelectedNews(news)} className="bg-yellow-400 px-2 py-1 mr-2 rounded">Edit</button>
                <button onClick={() => deleteNews(news._id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedNews && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded w-[90%] max-w-2xl relative">
            <button className="absolute top-2 right-3 text-gray-600" onClick={() => setSelectedNews(null)}>✖</button>
            <h2 className="text-xl font-bold">{selectedNews.headline}</h2>
            <img
              src={`http://localhost:3000${selectedNews.imageUrl}`}
              alt="News"
              className="mt-2 max-h-64 object-cover rounded"
            />
            <p className="mt-2">{selectedNews.description}</p>
            <p className="mt-1 text-sm text-gray-500">Category: {selectedNews.category}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default NewsTable;
