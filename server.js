import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = 5000

app.use(cors())
app.use(express.json())

// Endpoint to get games
app.post('/api/games', async (req, res) => {
  try {
    // Step 1: Get access token from Twitch
    const tokenResponse = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.VITE_IGDB_CLIENT_ID,
        client_secret: process.env.VITE_IGDB_CLIENT_SECRET,
        grant_type: 'client_credentials',
      }),
    })

    if (!tokenResponse.ok) {
      throw new Error('Failed to get access token')
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    // Step 2: Fetch games from IGDB API
    const gamesResponse = await fetch('https://api.igdb.com/v4/games', {
      method: 'POST',
      headers: {
        'Client-ID': process.env.VITE_IGDB_CLIENT_ID,
        'Authorization': `Bearer ${accessToken}`,
      },
      body: 'fields name,rating,release_dates.y,genres.name,platforms.name,cover.image_id,screenshots.image_id,summary; limit 100; where rating != null;',
    })

    if (!gamesResponse.ok) {
      const errorData = await gamesResponse.json()
      console.error('IGDB API Error:', errorData)
      throw new Error(`Failed to fetch games from IGDB: ${JSON.stringify(errorData)}`)
    }

    const gamesData = await gamesResponse.json()
    res.json(gamesData)
  } catch (err) {
    console.error('Server error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`)
})
