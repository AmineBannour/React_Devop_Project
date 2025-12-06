import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import productController from '../controllers/productController';
import '../styles/pages/Home.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const [featuredResult, trendingResult] = await Promise.all([
        productController.fetchProducts({ sort: 'rating' }),
        productController.fetchProducts({ sort: 'price-low' })
      ]);
      
      if (featuredResult.success) {
        setFeaturedProducts(featuredResult.data.slice(0, 8));
      }
      
      if (trendingResult.success) {
        setTrendingProducts(trendingResult.data.slice(0, 8));
      }
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
          <div className="hero-illustration">
            <svg width="100%" height="100%" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Shopping bags */}
              <g opacity="0.9">
                <path d="M80 200L100 80H140L120 200H80Z" fill="white" fillOpacity="0.3"/>
                <path d="M100 80C100 70 108 62 118 62H122C132 62 140 70 140 80L120 200" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                <rect x="105" y="85" width="10" height="15" rx="2" fill="white" fillOpacity="0.5"/>
              </g>
              
              {/* Shopping cart */}
              <g opacity="0.9" transform="translate(200, 120)">
                <circle cx="0" cy="0" r="40" fill="white" fillOpacity="0.2"/>
                <path d="M-25 -15L-15 -35H15L25 -15H-25Z" fill="white" fillOpacity="0.3"/>
                <path d="M-25 -15H25M-15 -35H15" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                <circle cx="-20" cy="25" r="8" fill="white" fillOpacity="0.4"/>
                <circle cx="20" cy="25" r="8" fill="white" fillOpacity="0.4"/>
              </g>
              
              {/* Product boxes */}
              <g opacity="0.7">
                <rect x="280" y="150" width="60" height="60" rx="4" fill="white" fillOpacity="0.25" transform="rotate(-15 310 180)"/>
                <rect x="290" y="160" width="40" height="40" rx="2" fill="white" fillOpacity="0.15" transform="rotate(-15 310 180)"/>
                <line x1="300" y1="170" x2="320" y2="170" stroke="white" strokeWidth="2" opacity="0.4" transform="rotate(-15 310 180)"/>
                <line x1="300" y1="185" x2="320" y2="185" stroke="white" strokeWidth="2" opacity="0.4" transform="rotate(-15 310 180)"/>
              </g>
              
              {/* Decorative elements */}
              <circle cx="50" cy="100" r="3" fill="white" fillOpacity="0.6"/>
              <circle cx="350" cy="80" r="4" fill="white" fillOpacity="0.5"/>
              <circle cx="320" cy="250" r="3" fill="white" fillOpacity="0.6"/>
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

