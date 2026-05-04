const express = require('express');
const router = express.Router();
const { createList, getUserLists, addMovieToList, getListById } = require('../controllers/listController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createList).get(protect, getUserLists);
router.route('/:id').get(protect, getListById);
router.post('/:id/movie', protect, addMovieToList);

module.exports = router;
