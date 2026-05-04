const express = require('express');
const router = express.Router();
const { addRating, getUserRatings } = require('../controllers/ratingController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, addRating);
router.get('/user', protect, getUserRatings);

module.exports = router;
