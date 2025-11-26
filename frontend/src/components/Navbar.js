import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const { cartCount } = useContext(CartContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-top">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand">
            <span className="brand-logo">Shop</span>
          </Link>
          
          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              className="search-input"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>
          </form>

          <div className="navbar-right">
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="nav-link">
                  <span className="nav-link-label">Hello, {user?.name?.split(' ')[0]}</span>
                  <span className="nav-link-text">Account & Lists</span>
                </Link>
                <Link to="/orders" className="nav-link">
                  <span className="nav-link-label">Returns</span>
                  <span className="nav-link-text">& Orders</span>
                </Link>
                <Link to="/cart" className="nav-link cart-link">
                  <span className="cart-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="9" cy="21" r="1"></circle>
                      <circle cx="20" cy="21" r="1"></circle>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                  </span>
                  <span className="nav-link-text">Cart</span>
                </Link>
                <button onClick={handleLogout} className="nav-link logout-btn">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">
                  <span className="nav-link-label">Hello, Sign in</span>
                  <span className="nav-link-text">Account & Lists</span>
                </Link>
                <Link to="/register" className="nav-link">
                  <span className="nav-link-label">New customer?</span>
                  <span className="nav-link-text">Start here</span>
                </Link>
                <Link to="/cart" className="nav-link cart-link">
                  <span className="cart-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="9" cy="21" r="1"></circle>
                      <circle cx="20" cy="21" r="1"></circle>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                  </span>
                  <span className="nav-link-text">Cart</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="navbar-bottom">
        <div className="navbar-container">
          <div className="nav-categories">
            <Link to="/products" className="nav-category-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
              All
            </Link>
            <Link to="/products?category=electronics" className="nav-category-link">Electronics</Link>
            <Link to="/products?category=clothing" className="nav-category-link">Clothing</Link>
            <Link to="/products?category=books" className="nav-category-link">Books</Link>
            <Link to="/products?category=home" className="nav-category-link">Home</Link>
            <Link to="/products?category=sports" className="nav-category-link">Sports</Link>
            <Link to="/products?category=toys" className="nav-category-link">Toys</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

