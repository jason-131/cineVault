import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Star, List as ListIcon } from 'lucide-react';
import './Profile.css';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [ratings, setRatings] = useState([]);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      try {
        // Fetch Ratings
        const ratingsRes = await fetch('http://localhost:5000/api/ratings/user', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const ratingsData = await ratingsRes.json();
        setRatings(Array.isArray(ratingsData) ? ratingsData : []);

        // Fetch Lists
        const listsRes = await fetch('http://localhost:5000/api/lists', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const listsData = await listsRes.json();
        setLists(Array.isArray(listsData) ? listsData : []);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  if (!user) {
    return <div className="container" style={{paddingTop: '120px'}}><h2 className="text-gradient">Please log in to view your profile.</h2></div>;
  }

  return (
    <div className="profile-page container">
      <div className="profile-header glass-panel animate-fade-in">
        <div className="profile-avatar">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="profile-info">
          <h1 className="text-gradient">{user.name}</h1>
          <p className="text-secondary">{user.email}</p>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section glass-panel animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="section-header">
            <Star className="section-icon" />
            <h2>Your Ratings ({ratings.length})</h2>
          </div>
          {loading ? <p>Loading...</p> : ratings.length === 0 ? (
            <p className="empty-state">You haven't rated any movies yet.</p>
          ) : (
            <ul className="rating-list">
              {ratings.map(rating => (
                <li key={rating._id} className="rating-item">
                  <span className="rating-movie-id">Movie ID: {rating.movieId}</span>
                  <div className="rating-stars">
                    <Star size={16} fill="var(--accent-primary)" color="var(--accent-primary)" />
                    <span>{rating.rating} / 5</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="profile-section glass-panel animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="section-header">
            <ListIcon className="section-icon" />
            <h2>Your Lists ({lists.length})</h2>
          </div>
          {loading ? <p>Loading...</p> : lists.length === 0 ? (
            <p className="empty-state">You haven't created any lists yet.</p>
          ) : (
            <div className="lists-grid">
              {lists.map(list => (
                <Link to={`/list/${list._id}`} key={list._id} className="list-card" style={{display: 'block'}}>
                  <h3>{list.name}</h3>
                  <p>{list.movies.length} movies</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
