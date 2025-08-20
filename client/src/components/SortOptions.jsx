import React from 'react';
import { Filter, X } from 'lucide-react';

const categories = [
  'All',
  'Politics',
  'Technology',
  'Business',
  'Sports',
  'Entertainment',
  'Health',
  'Science'
];

const timeFilters = [
  { label: 'All Time', value: '' },
  { label: 'Last 24 Hours', value: '24h' },
  { label: 'This Week', value: '7d' },
  { label: 'This Month', value: '30d' }
];

const sortOptions = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Oldest First', value: 'oldest' }
];

const SortOptions = ({ sortOption, onSortChange }) => {
  const handleCategoryChange = (category) => {
    onSortChange({
      ...sortOption,
      category: category === 'All' ? '' : category
    });
  };

  const handleTimeChange = (time) => {
    onSortChange({
      ...sortOption,
      time
    });
  };

  const handleSortByChange = (sortBy) => {
    onSortChange({
      ...sortOption,
      sortBy
    });
  };

  const clearFilters = () => {
    onSortChange({
      category: '',
      time: '',
      sortBy: 'newest'
    });
  };

  const hasActiveFilters = sortOption.category || sortOption.time || sortOption.sortBy !== 'newest';

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Filter className="w-5 h-5 mr-2" />
          Filters
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
          >
            <X className="w-4 h-4 mr-1" />
            Clear All
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-3">Category</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                (category === 'All' && !sortOption.category) || 
                sortOption.category === category
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Time Filter */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-3">Time Period</h4>
        <select
          value={sortOption.time}
          onChange={(e) => handleTimeChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {timeFilters.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Sort By */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-3">Sort By</h4>
        <select
          value={sortOption.sortBy}
          onChange={(e) => handleSortByChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SortOptions;