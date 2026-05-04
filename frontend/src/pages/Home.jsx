import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import './Home.css';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const endpoint = searchQuery 
          ? `http://localhost:5000/api/movies/search?query=${searchQuery}`
          : 'http://localhost:5000/api/movies/trending';
        
        const response = await fetch(endpoint);
        const data = await response.json();
        setMovies(data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [searchQuery]);

  return (
    <div className="home-page container">
      <header className="hero-section">
        <h1 className="text-gradient animate-fade-in hero-title">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'Explore Trending Movies'}
        </h1>
        <p className="hero-subtitle animate-fade-in" style={{ animationDelay: '0.1s' }}>
          Discover, rate, and save your favorite films from a collection of over 100,000 titles.
        </p>
      </header>

      <div className="movie-grid">
        {loading ? (
          <h3 style={{gridColumn: '1 / -1', textAlign: 'center'}}>Loading...</h3>
        ) : movies.length > 0 ? (
          movies.map((movie, index) => (
            <div key={movie.id} style={{ animationDelay: `${0.1 * index}s` }} className="animate-fade-in">
              <MovieCard movie={movie} />
            </div>
          ))
        ) : (
          <h3 style={{gridColumn: '1 / -1', textAlign: 'center'}}>No movies found.</h3>
        )}
      </div>
    </div>
  );
};

export default Home;
