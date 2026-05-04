import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Film, User, LogIn, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Real-time search logic will go here
    navigate(`/?search=${searchQuery}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar glass-panel">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <Film className="logo-icon" />
          <span className="text-gradient">CineVault</span>
        </Link>

        <form className="search-bar" onSubmit={handleSearch}>
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="input-field search-input"
            placeholder="Search 100,000+ movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <div className="nav-links">
          {user ? (
            <>
              <Link to="/profile" className="nav-item">
                <User size={20} />
                <span>{user.name}</span>
              </Link>
              <button onClick={handleLogout} className="nav-item btn-outline" style={{border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'inherit', fontSize: '1rem'}}>
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link to="/login" className="nav-item">
              <LogIn size={20} />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
