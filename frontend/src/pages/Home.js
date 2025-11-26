import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import './Home.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const [featuredRes, trendingRes] = await Promise.all([
        axios.get('/api/products?sort=rating'),
        axios.get('/api/products?sort=price-low')
      ]);
      setFeaturedProducts(featuredRes.data.slice(0, 8));
      setTrendingProducts(trendingRes.data.slice(0, 8));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <h1>Welcome to Shop</h1>
          <p>Discover millions of products at great prices</p>
          <Link to="/products" className="hero-button">
            Shop Now
          </Link>
        </div>
        <div className="hero-image">
          <div className="hero-placeholder">
            <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2"></rect>
              <path d="M3 9h18M9 21V9"></path>
            </svg>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="products-section">
        <div className="section-header">
          <h2>Featured Products</h2>
          <Link to="/products" className="see-all-link">See all →</Link>
        </div>
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading products...</p>
          </div>
        ) : (
          <div className="products-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Trending Products */}
      <section className="products-section">
        <div className="section-header">
          <h2>Best Deals</h2>
          <Link to="/products?sort=price-low" className="see-all-link">See all →</Link>
        </div>
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading products...</p>
          </div>
        ) : (
          <div className="products-grid">
            {trendingProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;

