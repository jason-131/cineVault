const List = require('../models/List');

// @desc    Create a new list
// @route   POST /api/lists
// @access  Private
const createList = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'List name is required' });
    }

    const list = await List.create({
      user: req.user._id,
      name,
      movies: [],
    });

    res.status(201).json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's lists
// @route   GET /api/lists
// @access  Private
const getUserLists = async (req, res) => {
  try {
    const lists = await List.find({ user: req.user._id });
    res.status(200).json(lists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add movie to list
// @route   POST /api/lists/:id/movie
// @access  Private
const addMovieToList = async (req, res) => {
  try {
    const { movieId } = req.body;
    const list = await List.findById(req.params.id);

    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }

    if (list.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (!list.movies.includes(movieId)) {
      list.movies.push(movieId);
      await list.save();
    }

    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single list by ID
// @route   GET /api/lists/:id
// @access  Private
const getListById = async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    
    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }

    if (list.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a list
// @route   DELETE /api/lists/:id
// @access  Private
const deleteList = async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    
    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }

    if (list.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await list.deleteOne();
    res.status(200).json({ id: req.params.id, message: 'List removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove movie from list
// @route   DELETE /api/lists/:id/movie/:movieId
// @access  Private
const removeMovieFromList = async (req, res) => {
  try {
    const list = await List.findById(req.params.id);

    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }

    if (list.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const movieIdNumber = Number(req.params.movieId);
    list.movies = list.movies.filter(id => id !== movieIdNumber);
    await list.save();

    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createList,
  getUserLists,
  addMovieToList,
  getListById,
  deleteList,
  removeMovieFromList,
};
