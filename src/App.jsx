import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Dashboard from './components/Dashboard'
import DetailView from './components/DetailView'

function App() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/games', {
          method: 'POST',
        })

        if (!response.ok) {
          throw new Error('Failed to fetch games')
        }

        const gamesData = await response.json()
        // Sort games by rating (highest first)
        const sorted = [...gamesData].sort((a, b) => (b.rating || 0) - (a.rating || 0))
        setGames(sorted)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchGames()
  }, [])

  if (loading) {
    return <div className="container"><h1>Loading games...</h1></div>
  }

  if (error) {
    return <div className="container"><h1>Error: {error}</h1></div>
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard games={games} />} />
        <Route path="/game/:gameId" element={<DetailView games={games} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
