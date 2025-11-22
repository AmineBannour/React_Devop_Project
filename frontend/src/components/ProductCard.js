import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="star-rating">
        {[...Array(fullStars)].map((_, i) => (
          <span key={i} className="star star-full">★</span>
        ))}
        {hasHalfStar && <span className="star star-half">★</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={i} className="star star-empty">★</span>
        ))}
      </div>
    );
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product._id}`} className="product-link">
        <div className="product-image-container">
          <div className="product-image">
            <img src={product.image} alt={product.name} />
          </div>
          {product.stock === 0 && (
            <div className="out-of-stock-badge">Out of Stock</div>
          )}
        </div>
        <div className="product-info">
          <h3 className="product-title" title={product.name}>
            {product.name}
          </h3>
          <div className="product-rating-section">
            {renderStars(product.rating || 0)}
            <span className="rating-number">{product.rating?.toFixed(1) || '0.0'}</span>
            <span className="reviews-count">({product.numReviews || 0})</span>
          </div>
          <div className="product-price-section">
            <span className="product-price">${product.price.toFixed(2)}</span>
            {product.stock > 0 && (
              <span className="shipping-info">FREE Shipping</span>
            )}
          </div>
          {product.stock > 0 && product.stock < 10 && (
            <div className="stock-warning">Only {product.stock} left in stock</div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;

