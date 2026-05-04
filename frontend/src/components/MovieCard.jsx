import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Plus, Check } from 'lucide-react';
import './MovieCard.css';

const MovieCard = ({ movie, userRating }) => {
  const imageUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  return (
    <Link to={`/movie/${movie.id}`} className="movie-card glass-panel animate-fade-in">
      <div className="movie-image-container">
        <img src={imageUrl} alt={movie.title} className="movie-image" />
        {userRating && (
          <div className="user-rating-badge">
            <Star size={12} fill="var(--accent-primary)" color="var(--accent-primary)" />
            <span>{userRating}</span>
          </div>
        )}
        <div className="movie-overlay">
          <button className="btn btn-primary overlay-btn">
            View Details
          </button>
        </div>
      </div>
      <div className="movie-info">
        <div className="movie-header">
          <h3 className="movie-title">{movie.title}</h3>
          <span className="movie-year">{movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'}</span>
        </div>
        <div className="movie-meta">
          {/* We don't have genre names directly in movie list, just IDs. Could map them, but hiding for now */}
          <span></span>
          <div className="movie-rating">
            <Star size={16} fill="var(--accent-primary)" color="var(--accent-primary)" />
            <span>{movie.vote_average ? movie.vote_average.toFixed(1) : 'NR'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
