import React from 'react'

const Header = ({ setSearchQuery }) => {
  return (
    <div className="flex justify-between items-center gap-4">
      <h1 className="text-3xl font-bold">📰 QVeto News</h1>
      <input
        type="text"
        className="border px-2 py-1 rounded-md w-full max-w-md"
        placeholder="Search news..."
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700">
        Login with Google
      </button>
    </div>
  )
}

export default Header
