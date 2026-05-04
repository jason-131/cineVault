const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Helper function for TMDB requests
const fetchFromTMDB = async (endpoint) => {
  const response = await fetch(`${TMDB_BASE_URL}${endpoint}&api_key=${TMDB_API_KEY}`);
  if (!response.ok) {
    throw new Error('Failed to fetch from TMDB');
  }
  return await response.json();
};

// @desc    Get trending movies
// @route   GET /api/movies/trending
// @access  Public
const getTrendingMovies = async (req, res) => {
  try {
    const data = await fetchFromTMDB('/trending/movie/week?language=en-US');
    res.json(data.results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search movies
// @route   GET /api/movies/search?query=...
// @access  Public
const searchMovies = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.json([]);
    
    const data = await fetchFromTMDB(`/search/movie?query=${encodeURIComponent(query)}&language=en-US&page=1`);
    res.json(data.results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get movie details
// @route   GET /api/movies/:id
// @access  Public
const getMovieDetails = async (req, res) => {
  try {
    const data = await fetchFromTMDB(`/movie/${req.params.id}?language=en-US`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTrendingMovies,
  searchMovies,
  getMovieDetails
};
