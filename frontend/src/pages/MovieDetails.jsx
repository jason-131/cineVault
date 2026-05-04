import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Star, BookmarkPlus, Calendar, Clock } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import './MovieDetails.css';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [showRatingUI, setShowRatingUI] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/movies/${id}`);
        const data = await response.json();
        setMovie(data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  const submitRating = async (score) => {
    setRatingLoading(true);
    setShowRatingUI(false);
    try {
      const response = await fetch('http://localhost:5000/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ movieId: id, rating: Number(score) })
      });
      
      if (!response.ok) {
        console.error("Failed to save rating.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setRatingLoading(false);
    }
  };

  const handleAddToList = async () => {
    setListLoading(true);
    try {
      // First try to get user lists
      const listsRes = await fetch('http://localhost:5000/api/lists', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const lists = await listsRes.json();
      
      let listId;
      if (lists.length === 0) {
        // Create a default list
        const createRes = await fetch('http://localhost:5000/api/lists', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`
          },
          body: JSON.stringify({ name: "Watchlist" })
        });
        const newList = await createRes.json();
        listId = newList._id;
      } else {
        listId = lists[0]._id; // Just add to the first list for now
      }

      // Add movie to list
      const addRes = await fetch(`http://localhost:5000/api/lists/${listId}/movie`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ movieId: id })
      });

      if (addRes.ok) {
        alert("Added to your list!");
      } else {
        alert("Failed to add to list.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setListLoading(false);
    }
  };

  if (loading) {
    return <div className="container" style={{paddingTop: '120px'}}><h2 className="text-gradient">Loading...</h2></div>;
  }

  if (!movie || movie.success === false) {
    return <div className="container" style={{paddingTop: '120px'}}><h2>Movie not found.</h2></div>;
  }

  return (
    <div className="movie-details-page container">
      <div className="movie-backdrop-container">
        <div 
          className="movie-backdrop" 
          style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }}
        ></div>
        <div className="movie-backdrop-overlay"></div>
      </div>

      <div className="movie-content glass-panel animate-fade-in">
        <img 
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
          alt={movie.title} 
          className="movie-poster" 
        />
        
        <div className="movie-info-detailed">
          <h1 className="movie-title-detailed text-gradient">{movie.title}</h1>
          <p className="movie-tagline">{movie.tagline}</p>
          
          <div className="movie-meta-detailed">
            <span className="meta-item"><Calendar size={16} /> {movie.release_date?.substring(0, 4)}</span>
            <span className="meta-item"><Clock size={16} /> {movie.runtime} min</span>
            <span className="meta-item">
              <Star size={16} fill="var(--accent-primary)" color="var(--accent-primary)" /> 
              {movie.vote_average?.toFixed(1)} / 10
            </span>
          </div>

          <div className="movie-genres">
            {movie.genres?.map(genre => (
              <span key={genre.id} className="genre-badge">{genre.name}</span>
            ))}
          </div>

          <div className="movie-overview">
            <h3>Overview</h3>
            <p>{movie.overview}</p>
          </div>

          {user ? (
            <div className="movie-actions-container">
              <div className="movie-actions">
                <button 
                  className="btn btn-primary action-btn" 
                  onClick={() => setShowRatingUI(!showRatingUI)} 
                  disabled={ratingLoading}
                >
                  <Star size={18} /> {ratingLoading ? 'Saving...' : 'Rate Movie'}
                </button>
                <button className="btn btn-outline action-btn" onClick={handleAddToList} disabled={listLoading}>
                  <BookmarkPlus size={18} /> {listLoading ? 'Saving...' : 'Add to List'}
                </button>
              </div>
              
              {showRatingUI && (
                <div className="rating-ui-container animate-fade-in">
                  <p>Select your rating:</p>
                  <div className="star-selector" onMouseLeave={() => setHoverRating(0)}>
                    {[1, 2, 3, 4, 5].map((index) => {
                      const isFilled = index <= hoverRating;
                      const isHalfFilled = index - 0.5 === hoverRating;

                      return (
                        <div key={index} className={`interactive-star-wrapper ${isFilled || isHalfFilled ? 'active' : ''}`}>
                          {/* Background Star */}
                          <Star size={32} color="var(--text-secondary)" />
                          
                          {/* Filled Star (Full or Half) */}
                          {(isFilled || isHalfFilled) && (
                            <div className="star-fill-overlay" style={{ width: isHalfFilled ? '50%' : '100%' }}>
                              <Star size={32} fill="var(--accent-primary)" color="var(--accent-primary)" />
                            </div>
                          )}

                          {/* Left Half Hover Target */}
                          <div 
                            className="star-click-target left"
                            onMouseEnter={() => setHoverRating(index - 0.5)}
                            onClick={() => submitRating(index - 0.5)}
                          />
                          {/* Right Half Hover Target */}
                          <div 
                            className="star-click-target right"
                            onMouseEnter={() => setHoverRating(index)}
                            onClick={() => submitRating(index)}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="login-prompt">
              <p>Please log in to rate this movie or add it to a list.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
