import axios from 'axios';
import React, { useState } from 'react';
function NewsList() {
  const [newsList, setNewsList] = useState([]);

  const fetchNewsList = async () => {
    try {
      const response = await axios.get('http://localhost:3000/newslist');
      setNewsList(response.data);
      console.log('News list fetched successfully:', response.data);
    } catch (error) {
      console.error('Error fetching news list:', error);
    }
  };

  return (
    <div>
      <h1>News List</h1>
      <button onClick={fetchNewsList}>Fetch News List</button>
      <ul>
        {newsList.map((news, index) => (
          <li key={index}>
            <h2>{news.headline}</h2>
            <p>{news.description}</p>
            <p>Category: {news.category}</p>
            {news.image && <img src={`http://localhost:3000/${news.image}`} alt="News" />}
          </li>
        ))}
      </ul>
    </div>
  );
}
export default NewsList;