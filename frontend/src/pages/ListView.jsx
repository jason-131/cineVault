import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Trash2, X } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import './ListView.css';

const ListView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [list, setList] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListAndMovies = async () => {
      try {
        // Fetch list details
        const listRes = await fetch(`http://localhost:5000/api/lists/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const listData = await listRes.json();
        setList(listData);

        // Fetch movie details for each movieId in the list
        if (listData.movies && listData.movies.length > 0) {
          const moviePromises = listData.movies.map(movieId => 
            fetch(`http://localhost:5000/api/movies/${movieId}`).then(res => res.json())
          );
          const moviesData = await Promise.all(moviePromises);
          setMovies(moviesData);
        }
      } catch (error) {
        console.error('Error fetching list:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchListAndMovies();
    }
  }, [id, user]);

  const handleRemoveMovie = async (movieId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/lists/${id}/movie/${movieId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (response.ok) {
        // Remove movie from local state to update UI immediately
        setMovies(prevMovies => prevMovies.filter(movie => movie.id !== movieId));
      } else {
        alert('Failed to remove movie from list.');
      }
    } catch (error) {
      console.error('Error removing movie:', error);
    }
  };

  const handleDeleteList = async () => {
    if (window.confirm("Are you sure you want to delete this list?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/lists/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        if (response.ok) {
          navigate('/profile');
        } else {
          alert('Failed to delete list.');
        }
      } catch (error) {
        console.error('Error deleting list:', error);
      }
    }
  };

  if (loading) {
    return <div className="container" style={{paddingTop: '120px'}}><h2 className="text-gradient">Loading List...</h2></div>;
  }

  if (!list || list.message) {
    return <div className="container" style={{paddingTop: '120px'}}><h2 className="text-gradient">List not found or unauthorized.</h2></div>;
  }

  return (
    <div className="list-view-page container">
      <header className="list-header" style={{ position: 'relative' }}>
        <h1 className="text-gradient">{list.name}</h1>
        <p className="text-secondary">{movies.length} movies</p>
        <button 
          onClick={handleDeleteList} 
          className="btn btn-outline" 
          style={{ position: 'absolute', top: '0', right: '0', borderColor: 'var(--accent-secondary)', color: 'var(--accent-secondary)' }}
          title="Delete List"
        >
          <Trash2 size={18} />
        </button>
      </header>

      {movies.length === 0 ? (
        <div className="empty-list">
          <p>This list is empty.</p>
          <Link to="/" className="btn btn-primary" style={{marginTop: '1rem'}}>Discover Movies</Link>
        </div>
      ) : (
        <div className="movie-grid">
          {movies.map((movie, index) => (
            <div key={movie.id} style={{ animationDelay: `${0.1 * index}s`, position: 'relative' }} className="animate-fade-in">
              <button 
                onClick={() => handleRemoveMovie(movie.id)}
                className="remove-movie-btn"
                title="Remove from list"
              >
                <X size={16} />
              </button>
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListView;
