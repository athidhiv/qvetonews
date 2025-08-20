import React, { useState } from 'react';
import { Search, Bell, User } from 'lucide-react';

const Header = ({ onSearch }) => {
  const [localQuery, setLocalQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(localQuery);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">NewsHub</div>
        
        <form onSubmit={handleSubmit} className="search-form">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search for news..."
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </form>

        <div className="header-actions">
          <button className="icon-button">
            <Bell size={20} />
          </button>
          <button className="icon-button">
            <User size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;