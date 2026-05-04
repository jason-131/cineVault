const mongoose = require('mongoose');

const listSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    movies: [
      {
        type: Number, // Array of movie IDs
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('List', listSchema);
