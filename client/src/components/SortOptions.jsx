import React from 'react'

const SortOptions = ({ setSortOption }) => {
  const handleChange = (e) => {
    const { name, value } = e.target
    setSortOption((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="flex gap-4 mt-4">
      <select name="category" onChange={handleChange} className="p-2 border rounded">
        <option value="">All Categories</option>
        <option value="sports">Sports</option>
        <option value="politics">Politics</option>
        <option value="tech">Tech</option>
        <option value="entertainment">Entertainment</option>
      </select>

      <select name="time" onChange={handleChange} className="p-2 border rounded">
        <option value="">Any Time</option>
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
      </select>

      <input
        type="text"
        name="place"
        placeholder="Search by place"
        className="p-2 border rounded"
        onChange={handleChange}
      />
    </div>
  )
}

export default SortOptions
