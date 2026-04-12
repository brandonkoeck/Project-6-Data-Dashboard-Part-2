import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import './DetailView.css'

function DetailView({ games }) {
  const { gameId } = useParams()
  const [expandedScreenshot, setExpandedScreenshot] = useState(null)
  
  // Find the game by ID
  const game = games.find(g => g.id === parseInt(gameId))

  // Helper function to convert IGDB image ID to full URL
  const getImageUrl = (imageId) => {
    return `https://images.igdb.com/igdb/image/upload/t_cover_big/${imageId}.jpg`
  }

  const getScreenshotUrl = (imageId) => {
    return `https://images.igdb.com/igdb/image/upload/t_screenshot_big/${imageId}.jpg`
  }

  if (!game) {
    return (
      <div className="container detail-container">
        <h1>Game Not Found</h1>
        <Link to="/" className="back-link">
          ← Back to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="detail-container">
      <Link to="/" className="back-link">
        ← Back to Dashboard
      </Link>

      <div className="detail-hero">
        <div className="cover-placeholder">
          {game.cover && game.cover.image_id ? (
            <img 
              src={getImageUrl(game.cover.image_id)} 
              alt={game.name}
              className="cover-image"
            />
          ) : (
            <div className="cover-image placeholder">IGDB Image Not Available</div>
          )}
        </div>
        <div className="detail-header">
          <h1>{game.name}</h1>
          <p className="detail-rating">{game.rating ? game.rating.toFixed(1) : 'N/A'} / 100</p>
        </div>
      </div>

      <div className="container detail-content">
        {game.summary && (
          <div className="detail-section">
            <h2>Description</h2>
            <p>{game.summary}</p>
          </div>
        )}

        <div className="detail-grid">
          <div className="detail-section">
            <h2>Rating</h2>
            <p className="detail-rating">{game.rating ? game.rating.toFixed(1) : 'N/A'} / 100</p>
          </div>

          <div className="detail-section">
            <h2>Genres</h2>
            <p>
              {game.genres && Array.isArray(game.genres) && game.genres.length > 0
                ? game.genres.map(g => (typeof g === 'object' ? g.name : g)).join(', ')
                : 'Not available'}
            </p>
          </div>

          <div className="detail-section">
            <h2>Platforms</h2>
            <p>
              {game.platforms && Array.isArray(game.platforms) && game.platforms.length > 0
                ? game.platforms.map(p => (typeof p === 'object' ? p.name : p)).join(', ')
                : 'Not available'}
            </p>
          </div>

          {game.release_dates && Array.isArray(game.release_dates) && game.release_dates.length > 0 && (
            <div className="detail-section">
              <h2>Release Year</h2>
              <p>{game.release_dates[0].y || 'N/A'}</p>
            </div>
          )}
        </div>

        {game.screenshots && Array.isArray(game.screenshots) && game.screenshots.length > 0 && (
          <div className="detail-section">
            <h2>Screenshots</h2>
            <div className="screenshots-grid">
              {game.screenshots.map((screenshot, index) => (
                <img
                  key={index}
                  src={getScreenshotUrl(screenshot.image_id)}
                  alt={`${game.name} screenshot ${index + 1}`}
                  className="screenshot"
                  onClick={() => setExpandedScreenshot(screenshot.image_id)}
                />
              ))}
            </div>
          </div>
        )}

        {expandedScreenshot && (
          <div className="modal-overlay" onClick={() => setExpandedScreenshot(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <img 
                src={getScreenshotUrl(expandedScreenshot)}
                alt="Expanded screenshot"
                className="expanded-screenshot"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DetailView

