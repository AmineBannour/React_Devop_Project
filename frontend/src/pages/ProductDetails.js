import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const { fetchCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [imageZoom, setImageZoom] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`/api/products/${id}`);
      setProduct(res.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    if (!product) return;
    try {
      const res = await axios.get(`/api/products?category=${product.category}`);
      const filtered = res.data.filter(p => p._id !== id).slice(0, 4);
      setRelatedProducts(filtered);
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  };

  useEffect(() => {
    if (product) {
      fetchRelatedProducts();
    }
  }, [product, id]);

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

  const addToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setAddingToCart(true);
    try {
      await axios.post('/api/cart/add', {
        productId: id,
        quantity: quantity
      });
      await fetchCart();
      alert('Product added to cart!');
    } catch (error) {
      alert('Error adding to cart: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setAddingToCart(false);
    }
  };

  const buyNow = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setAddingToCart(true);
    try {
      await axios.post('/api/cart/add', {
        productId: id,
        quantity: quantity
      });
      await fetchCart();
      navigate('/checkout');
    } catch (error) {
      alert('Error adding to cart: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="error-container">
        <h2>Product not found</h2>
        <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="product-details">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/products">Products</Link>
        <span>/</span>
        <Link to={`/products?category=${product.category}`}>{product.category}</Link>
        <span>/</span>
        <span>{product.name}</span>
      </nav>

      <div className="product-details-container">
        {/* Image Section */}
        <div className="product-image-section">
          <div 
            className="main-image-container"
            onMouseEnter={() => setImageZoom(true)}
            onMouseLeave={() => setImageZoom(false)}
          >
            <img 
              src={product.image} 
              alt={product.name}
              className={imageZoom ? 'zoomed' : ''}
            />
          </div>
        </div>

        {/* Info Section */}
        <div className="product-info-section">
          <h1 className="product-title">{product.name}</h1>
          
          <div className="product-rating-section">
            {renderStars(product.rating || 0)}
            <span className="rating-number">{product.rating?.toFixed(1) || '0.0'}</span>
            <Link to="#" className="reviews-link">
              ({product.numReviews || 0} {product.numReviews === 1 ? 'review' : 'reviews'})
            </Link>
          </div>

          <div className="price-section">
            <span className="product-price">${product.price.toFixed(2)}</span>
            {product.price > 50 && (
              <span className="price-info">FREE Shipping</span>
            )}
          </div>

          <div className="product-highlights">
            <h3>About this item</h3>
            <ul>
              <li>{product.description}</li>
              <li>Category: <strong>{product.category.charAt(0).toUpperCase() + product.category.slice(1)}</strong></li>
              {product.stock > 0 && (
                <li>In Stock - {product.stock} available</li>
              )}
            </ul>
          </div>

          {product.stock > 0 ? (
            <div className="product-actions">
              <div className="quantity-selector">
                <label>Quantity:</label>
                <div className="quantity-controls">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="qty-btn"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      setQuantity(Math.min(Math.max(1, val), product.stock));
                    }}
                    className="qty-input"
                  />
                  <button 
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="qty-btn"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="action-buttons">
                <button 
                  onClick={addToCart} 
                  className="btn btn-add-cart"
                  disabled={addingToCart}
                >
                  {addingToCart ? 'Adding...' : 'Add to Cart'}
                </button>
                <button 
                  onClick={buyNow} 
                  className="btn btn-buy-now"
                  disabled={addingToCart}
                >
                  Buy Now
                </button>
              </div>

              <div className="shipping-info">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z"></path>
                  <circle cx="5.5" cy="18.5" r="2.5"></circle>
                  <circle cx="18.5" cy="18.5" r="2.5"></circle>
                </svg>
                <span>FREE delivery on orders over $50</span>
              </div>
            </div>
          ) : (
            <div className="out-of-stock">
              <p className="stock-message">Currently unavailable</p>
              <p className="stock-subtitle">We don't know when or if this item will be back in stock.</p>
            </div>
          )}
        </div>
      </div>

      {/* Product Description Section */}
      <div className="product-description-section">
        <h2>Product Description</h2>
        <p>{product.description}</p>
        <div className="product-specs">
          <div className="spec-item">
            <strong>Category:</strong> {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
          </div>
          <div className="spec-item">
            <strong>Rating:</strong> {product.rating?.toFixed(1) || '0.0'} out of 5 stars
          </div>
          <div className="spec-item">
            <strong>Reviews:</strong> {product.numReviews || 0} customer reviews
          </div>
          {product.stock > 0 && (
            <div className="spec-item">
              <strong>Availability:</strong> In Stock ({product.stock} units available)
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="related-products">
          <h2>Customers who viewed this item also viewed</h2>
          <div className="related-products-grid">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct._id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;

