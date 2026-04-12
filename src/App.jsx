import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState('')

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

  // Filter games based on search query
  const filteredGames = games.filter((game) =>
    game.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Extract unique genres and platforms
  const genres = [...new Set(games.flatMap(game => game.genres?.map(g => g.name) || []))].sort()
  const platforms = [...new Set(games.flatMap(game => game.platforms?.map(p => p.name) || []))].sort()

  // Apply genre and platform filters
  const finalFilteredGames = filteredGames.filter((game) => {
    const hasGenre = !selectedGenre || game.genres?.some(g => g.name === selectedGenre)
    const hasPlatform = !selectedPlatform || game.platforms?.some(p => p.name === selectedPlatform)
    return hasGenre && hasPlatform
  })

  // Calculate summary statistics
  const stats = {
    totalGames: games.length,
    averageRating: games.length > 0 
      ? (games.reduce((sum, game) => sum + (game.rating || 0), 0) / games.length).toFixed(1)
      : 'N/A',
    highestRating: games.length > 0
      ? Math.max(...games.map(game => game.rating || 0)).toFixed(1)
      : 'N/A',
  }

  return (
    <div className="container">
      <h1>Video Game Dashboard</h1>
      
      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Games</h3>
          <p className="stat-value">{stats.totalGames}</p>
        </div>
        <div className="stat-card">
          <h3>Average Rating</h3>
          <p className="stat-value">{stats.averageRating}</p>
        </div>
        <div className="stat-card">
          <h3>Highest Rating</h3>
          <p className="stat-value">{stats.highestRating}</p>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search games..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar"
      />

      <div className="filters-container">
        <div className="filter-group">
          <label>Genre:</label>
          <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Platform:</label>
          <select value={selectedPlatform} onChange={(e) => setSelectedPlatform(e.target.value)}>
            <option value="">All Platforms</option>
            {platforms.map((platform) => (
              <option key={platform} value={platform}>
                {platform}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p>Found {finalFilteredGames.length} games</p>
      <div className="games-list">
        <div className="game-row header-row">
          <span className="game-name">Name</span>
          <span className="game-rating">Rating</span>
          <span className="game-genres">Genres</span>
          <span className="game-platforms">Platforms</span>
        </div>
        {finalFilteredGames.map((game) => (
          <div key={game.id} className="game-row">
            <span className="game-name">{game.name}</span>
            <span className="game-rating">{game.rating ? game.rating.toFixed(1) : 'N/A'}</span>
            <span className="game-genres" title={game.genres ? game.genres.map(g => g.name).join(', ') : 'N/A'}>
              {game.genres ? game.genres.map(g => g.name).join(', ') : 'N/A'}
            </span>
            <span className="game-platforms" title={game.platforms ? game.platforms.map(p => p.name).join(', ') : 'N/A'}>
              {game.platforms ? game.platforms.map(p => p.name).join(', ') : 'N/A'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
