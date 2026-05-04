import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Star, BookmarkPlus, Calendar, Clock, Check } from 'lucide-react';
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
  const [userLists, setUserLists] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserLists = async () => {
      if (!user) return;
      try {
        const res = await fetch('http://localhost:5000/api/lists', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const data = await res.json();
        setUserLists(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserLists();
  }, [user]);

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

  const handleToggleList = async (listName) => {
    setListLoading(true);
    try {
      let targetList = userLists.find(list => list.name === listName);
      let listId;
      
      if (!targetList) {
        // Create the list if it doesn't exist
        const createRes = await fetch('http://localhost:5000/api/lists', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`
          },
          body: JSON.stringify({ name: listName })
        });
        targetList = await createRes.json();
        listId = targetList._id;
      } else {
        listId = targetList._id;
      }

      const isMovieInList = targetList.movies.includes(Number(id));

      if (isMovieInList) {
        // Remove movie
        await fetch(`http://localhost:5000/api/lists/${listId}/movie/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${user.token}` }
        });
      } else {
        // Add movie
        await fetch(`http://localhost:5000/api/lists/${listId}/movie`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`
          },
          body: JSON.stringify({ movieId: id })
        });
      }

      // Refresh user lists
      const res = await fetch('http://localhost:5000/api/lists', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setUserLists(await res.json());

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

          {user ? (() => {
            const planToWatchList = userLists.find(l => l.name === 'Plan to Watch');
            const isPlanToWatch = planToWatchList && planToWatchList.movies.includes(Number(id));

            const watchedList = userLists.find(l => l.name === 'Watched');
            const isWatched = watchedList && watchedList.movies.includes(Number(id));

            return (
              <div className="movie-actions-container">
                <div className="movie-actions">
                  <button 
                    className="btn btn-primary action-btn" 
                    onClick={() => setShowRatingUI(!showRatingUI)} 
                    disabled={ratingLoading}
                  >
                    <Star size={18} /> {ratingLoading ? 'Saving...' : 'Rate Movie'}
                  </button>
                  <button 
                    className={`btn ${isPlanToWatch ? 'btn-primary' : 'btn-outline'} action-btn`}
                    onClick={() => handleToggleList('Plan to Watch')} 
                    disabled={listLoading}
                  >
                    <BookmarkPlus size={18} fill={isPlanToWatch ? 'currentColor' : 'none'} /> 
                    {listLoading ? 'Saving...' : 'Plan to Watch'}
                  </button>
                  <button 
                    className={`btn ${isWatched ? 'btn-primary' : 'btn-outline'} action-btn`}
                    onClick={() => handleToggleList('Watched')} 
                    disabled={listLoading}
                  >
                    <Check size={18} /> 
                    {listLoading ? 'Saving...' : 'Watched'}
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
            );
          })() : (
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
