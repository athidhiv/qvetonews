import React, { useEffect, useState } from 'react'
import Header from './components/Header'
import NewsCard from './components/NewsCard'
import SortOptions from './components/SortOptions'

const App = () => {
  const [news, setNews] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOption, setSortOption] = useState({ category: '', time: '', place: '' })

  useEffect(() => {
    fetchNews()
  }, [searchQuery, sortOption])

  const fetchNews = async () => {
    try {
      const query = new URLSearchParams({
        search: searchQuery,
        category: sortOption.category,
        time: sortOption.time,
        place: sortOption.place,
      }).toString()

      const res = await fetch(`http://localhost:3000/news?${query}`)
      const data = await res.json()
      setNews(data)
    } catch (error) {
      console.error('Failed to fetch news:', error)
    }
  }

  return (
    <div className="p-4">
      <Header setSearchQuery={setSearchQuery} />
      <SortOptions setSortOption={setSortOption} />
      <div className="mt-4 grid gap-4">
        {news.map((item) => (
          <NewsCard key={item._id} news={item} />
        ))}
      </div>
    </div>
  )
}

export default App
