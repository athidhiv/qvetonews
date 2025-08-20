import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import NewsPanel from './components/NewsPanel';
import UserLogin from './components/UserLogin';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminPanel />} />
        <Route path="/news-panel/:id" element={<NewsPanel />} />
        <Route path="/login" element={<UserLogin />} />
      </Routes>
    </Router>
  );
};

export default App;
