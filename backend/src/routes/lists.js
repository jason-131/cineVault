const express = require('express');
const router = express.Router();
const { createList, getUserLists, addMovieToList, getListById, deleteList, removeMovieFromList } = require('../controllers/listController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createList).get(protect, getUserLists);
router.route('/:id').get(protect, getListById).delete(protect, deleteList);
router.post('/:id/movie', protect, addMovieToList);
router.delete('/:id/movie/:movieId', protect, removeMovieFromList);

module.exports = router;
