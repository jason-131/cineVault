const express = require('express');
const router = express.Router();
const {
  getTrendingMovies,
  searchMovies,
  getMovieDetails
} = require('../controllers/movieController');

router.get('/trending', getTrendingMovies);
router.get('/search', searchMovies);
router.get('/:id', getMovieDetails);

module.exports = router;
