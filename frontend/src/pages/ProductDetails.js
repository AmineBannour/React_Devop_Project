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
  const { isAuthenticated, user } = useContext(AuthContext);
  const { fetchCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [imageZoom, setImageZoom] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [userReview, setUserReview] = useState(null);
  const [shareMessage, setShareMessage] = useState('');

  useEffect(() => {
    fetchProduct();
    fetchReviews();
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

  const fetchReviews = async () => {
    setReviewsLoading(true);
    try {
      const res = await axios.get(`/api/reviews/product/${id}`);
      setReviews(res.data);
      
      // Check if current user has a review
      if (isAuthenticated && user) {
        const review = res.data.find(r => {
          const reviewUserId = r.user?._id || r.user;
          return reviewUserId === user._id || reviewUserId === user._id?.toString();
        });
        if (review) {
          setUserReview(review);
          setReviewRating(review.rating);
          setReviewComment(review.comment);
        }
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setReviewsLoading(false);
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
    } catch (error) {
      console.error('Error adding to cart:', error.response?.data?.message || 'Unknown error');
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
      console.error('Error adding to cart:', error.response?.data?.message || 'Unknown error');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!reviewComment.trim()) {
      alert('Please enter a comment');
      return;
    }

    setSubmittingReview(true);
    try {
      if (userReview) {
        // Update existing review
        await axios.put(`/api/reviews/${userReview._id}`, {
          rating: reviewRating,
          comment: reviewComment
        });
        alert('Review updated successfully!');
      } else {
        // Create new review
        await axios.post('/api/reviews', {
          productId: id,
          rating: reviewRating,
          comment: reviewComment
        });
        alert('Review submitted successfully!');
      }
      
      // Refresh reviews and product
      await fetchReviews();
      await fetchProduct();
      setShowReviewForm(false);
      setReviewComment('');
      setReviewRating(5);
    } catch (error) {
      alert('Error submitting review: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!userReview) return;
    
    if (!window.confirm('Are you sure you want to delete your review?')) {
      return;
    }

    try {
      await axios.delete(`/api/reviews/${userReview._id}`);
      alert('Review deleted successfully!');
      setUserReview(null);
      setReviewComment('');
      setReviewRating(5);
      await fetchReviews();
      await fetchProduct();
    } catch (error) {
      alert('Error deleting review: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  const renderStarInput = () => {
    return (
      <div className="star-input">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`star-btn ${star <= reviewRating ? 'active' : ''}`}
            onClick={() => setReviewRating(star)}
            onMouseEnter={(e) => {
              if (!submittingReview) {
                e.target.closest('.star-input').querySelectorAll('.star-btn').forEach((btn, idx) => {
                  if (idx < star) btn.classList.add('hover');
                });
              }
            }}
            onMouseLeave={() => {
              document.querySelectorAll('.star-btn').forEach(btn => btn.classList.remove('hover'));
            }}
          >
            ★
          </button>
        ))}
        <span className="rating-label">{reviewRating} {reviewRating === 1 ? 'star' : 'stars'}</span>
      </div>
    );
  };

  const handleShare = async () => {
    const productUrl = `${window.location.origin}/products/${id}`;
    
    // Try to use Web Share API if available (mobile devices)
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name || 'Check out this product',
          text: product?.description || 'Check out this amazing product!',
          url: productUrl
        });
        setShareMessage('Shared successfully!');
      } catch (error) {
        // User cancelled or error occurred, fall back to copy
        if (error.name !== 'AbortError') {
          copyToClipboard(productUrl);
        }
      }
    } else {
      // Fall back to copying to clipboard
      copyToClipboard(productUrl);
    }
    
    // Clear message after 3 seconds
    setTimeout(() => setShareMessage(''), 3000);
  };

  const copyToClipboard = (text) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setShareMessage('✓ Link copied to clipboard!');
      }).catch(() => {
        // Fallback for older browsers
        fallbackCopyToClipboard(text);
      });
    } else {
      fallbackCopyToClipboard(text);
    }
  };

  const fallbackCopyToClipboard = (text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      setShareMessage('✓ Link copied to clipboard!');
    } catch (err) {
      setShareMessage('Failed to copy link');
    }
    document.body.removeChild(textArea);
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
          <div className="product-title-row">
            <h1 className="product-title">{product.name}</h1>
            <button
              className="share-btn"
              onClick={handleShare}
              title="Share this product"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
              <span>Share</span>
            </button>
          </div>
          {shareMessage && (
            <div className={`share-message ${shareMessage.includes('Copied') ? 'success' : ''}`}>
              {shareMessage}
            </div>
          )}
          <div className="product-rating-section">
            {renderStars(product.rating || 0)}
            <span className="rating-number">{product.rating?.toFixed(1) || '0.0'}</span>
            <span 
              className="reviews-link"
              onClick={() => {
                document.querySelector('.reviews-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ cursor: 'pointer' }}
            >
              ({product.numReviews || 0} {product.numReviews === 1 ? 'review' : 'reviews'})
            </span>
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

      {/* Reviews Section */}
      <div className="reviews-section">
        <div className="reviews-header">
          <h2>Customer Reviews</h2>
          {isAuthenticated && !userReview && (
            <button 
              className="btn btn-primary"
              onClick={() => setShowReviewForm(!showReviewForm)}
            >
              {showReviewForm ? 'Cancel Review' : 'Write a Review'}
            </button>
          )}
        </div>

        {/* Review Form */}
        {showReviewForm && isAuthenticated && !userReview && (
          <div className="review-form-container">
            <h3>Write Your Review</h3>
            <form onSubmit={handleSubmitReview} className="review-form">
              <div className="form-group">
                <label>Rating</label>
                {renderStarInput()}
              </div>
              <div className="form-group">
                <label htmlFor="review-comment">Your Review</label>
                <textarea
                  id="review-comment"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your experience with this product..."
                  rows="5"
                  maxLength="1000"
                  required
                />
                <span className="char-count">{reviewComment.length}/1000</span>
              </div>
              <button 
                type="submit" 
                className="btn btn-submit-review"
                disabled={submittingReview || !reviewComment.trim()}
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        )}

        {/* User's Existing Review */}
        {userReview && (
          <div className="user-review-card">
            <div className="review-card-header">
              <div>
                <h4>Your Review</h4>
                <div className="review-rating">
                  {renderStars(userReview.rating)}
                </div>
              </div>
              <div className="review-actions">
                <button 
                  className="btn-edit-review"
                  onClick={() => setShowReviewForm(!showReviewForm)}
                >
                  {showReviewForm ? 'Cancel' : 'Edit'}
                </button>
                <button 
                  className="btn-delete-review"
                  onClick={handleDeleteReview}
                >
                  Delete
                </button>
              </div>
            </div>
            {!showReviewForm ? (
              <p className="review-comment">{userReview.comment}</p>
            ) : (
              <form onSubmit={handleSubmitReview} className="review-form">
                <div className="form-group">
                  <label>Rating</label>
                  {renderStarInput()}
                </div>
                <div className="form-group">
                  <label htmlFor="edit-review-comment">Your Review</label>
                  <textarea
                    id="edit-review-comment"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your experience with this product..."
                    rows="5"
                    maxLength="1000"
                    required
                  />
                  <span className="char-count">{reviewComment.length}/1000</span>
                </div>
                <button 
                  type="submit" 
                  className="btn btn-submit-review"
                  disabled={submittingReview || !reviewComment.trim()}
                >
                  {submittingReview ? 'Updating...' : 'Update Review'}
                </button>
              </form>
            )}
            <span className="review-date">
              {new Date(userReview.createdAt).toLocaleDateString()}
              {userReview.updatedAt !== userReview.createdAt && ' (edited)'}
            </span>
          </div>
        )}

        {/* Reviews List */}
        {reviewsLoading ? (
          <div className="loading-reviews">
            <div className="loading-spinner"></div>
            <p>Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="no-reviews">
            <p>No reviews yet. Be the first to review this product!</p>
          </div>
        ) : (
          <div className="reviews-list">
            {reviews
              .filter(review => !userReview || review._id !== userReview._id)
              .map((review) => (
                <div key={review._id} className="review-card">
                  <div className="review-card-header">
                    <div>
                      <h4>{review.user?.name || 'Anonymous'}</h4>
                      <div className="review-rating">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <span className="review-date">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))}
          </div>
        )}
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
