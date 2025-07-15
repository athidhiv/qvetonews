import React from 'react';
import NewsUpload from './NewsUpload'; // ✅ Import the component
import NewsList from './NewsList';

function App() {
  return (
    <div>
      <h1>Welcome to App</h1>
      <NewsUpload /> {/* ✅ Use it like a tag */}
      <p>Upload your news here!</p>
      <NewsList />
    </div>
  );
}

export default App;
