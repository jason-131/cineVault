const Rating = require('../models/Rating');

// @desc    Add or update a rating
// @route   POST /api/ratings
// @access  Private
const addRating = async (req, res) => {
  try {
    const { movieId, rating, review } = req.body;

    if (!movieId || !rating) {
      return res.status(400).json({ message: 'Movie ID and rating are required' });
    }

    // Check if user already rated this movie
    let existingRating = await Rating.findOne({ user: req.user._id, movieId });

    if (existingRating) {
      existingRating.rating = rating;
      existingRating.review = review;
      await existingRating.save();
      return res.status(200).json(existingRating);
    }

    const newRating = await Rating.create({
      user: req.user._id,
      movieId,
      rating,
      review,
    });

    res.status(201).json(newRating);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user's ratings
// @route   GET /api/ratings/user
// @access  Private
const getUserRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(ratings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addRating,
  getUserRatings,
};
