import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import './Dashboard.css'

function Dashboard({ games }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState('')

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

  // Chart 1: Top rated games by rating
  const topGamesData = games
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 10)
    .map(game => ({
      name: game.name.length > 15 ? game.name.substring(0, 12) + '...' : game.name,
      rating: parseFloat((game.rating || 0).toFixed(1))
    }))

  // Chart 2: Games distribution by platform (top 10)
  const allPlatformDistribution = platforms.map(platform => ({
    name: platform,
    count: games.filter(game => game.platforms?.some(p => p.name === platform)).length
  }))
  
  const topPlatforms = allPlatformDistribution
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
  
  const otherCount = allPlatformDistribution
    .slice(10)
    .reduce((sum, p) => sum + p.count, 0)
  
  const platformDistribution = otherCount > 0 
    ? [...topPlatforms, { name: 'Other', count: otherCount }]
    : topPlatforms

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0']

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

      {/* Charts */}
      <div className="charts-container">
        <div className="chart">
          <h3>Top 10 Highest Rated Games</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={topGamesData} margin={{ bottom: 120, left: 0, right: 0, top: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-90} 
                textAnchor="end" 
                height={140}
                tick={{ fontSize: 10 }}
                interval={0}
              />
              <YAxis />
              <Tooltip contentStyle={{ width: '140px', backgroundColor: '#fff', border: '1px solid #ccc' }} />
              <Bar dataKey="rating" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart">
          <h3>Games by Platform Distribution (Top 10)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={platformDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, count, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {platformDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} games`} />
            </PieChart>
          </ResponsiveContainer>
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
          <Link key={game.id} to={`/game/${game.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="game-row clickable">
              <span className="game-name">{game.name}</span>
              <span className="game-rating">{game.rating ? game.rating.toFixed(1) : 'N/A'}</span>
              <span className="game-genres" title={game.genres ? game.genres.map(g => g.name).join(', ') : 'N/A'}>
                {game.genres ? game.genres.map(g => g.name).join(', ') : 'N/A'}
              </span>
              <span className="game-platforms" title={game.platforms ? game.platforms.map(p => p.name).join(', ') : 'N/A'}>
                {game.platforms ? game.platforms.map(p => p.name).join(', ') : 'N/A'}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Dashboard
