import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import productController from '../controllers/productController';
import '../styles/pages/Products.css';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: ''
  });

  useEffect(() => {
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    if (category || search || minPrice || maxPrice) {
      setFilters({
        category: category || '',
        search: search || '',
        minPrice: minPrice || '',
        maxPrice: maxPrice || '',
        sort: ''
      });
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [filters.category, filters.search, filters.sort]);

  useEffect(() => {
    if (allProducts.length > 0) {
      const filtered = productController.filterByPrice(
        allProducts,
        filters.minPrice,
        filters.maxPrice
      );
      setProducts(filtered);
    }
  }, [allProducts, filters.minPrice, filters.maxPrice]);

  const fetchProducts = async () => {
    setLoading(true);
    const result = await productController.fetchProducts({
      category: filters.category,
      search: filters.search,
      sort: filters.sort
    });
    
    if (result.success) {
      setAllProducts(result.data);
      const filtered = productController.filterByPrice(
        result.data,
        filters.minPrice,
        filters.maxPrice
      );
      setProducts(filtered);
    } else {
      console.error('Error fetching products:', result.message);
      setAllProducts([]);
      setProducts([]);
    }
    setLoading(false);
  };

  const categories = ['electronics', 'clothing', 'books', 'home', 'sports', 'toys'];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update URL params
    const params = new URLSearchParams();
    if (newFilters.category) params.set('category', newFilters.category);
    if (newFilters.search) params.set('search', newFilters.search);
    if (newFilters.minPrice) params.set('minPrice', newFilters.minPrice);
    if (newFilters.maxPrice) params.set('maxPrice', newFilters.maxPrice);
    setSearchParams(params);
  };

  const handlePriceFilterChange = (key, value) => {
    handleFilterChange(key, value);
  };

  const clearPriceFilter = () => {
    const newFilters = { ...filters, minPrice: '', maxPrice: '' };
    setFilters(newFilters);
    
    // Update URL params
    const params = new URLSearchParams();
    if (newFilters.category) params.set('category', newFilters.category);
    if (newFilters.search) params.set('search', newFilters.search);
    setSearchParams(params);
  };

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>
          {filters.search ? `Search Results for "${filters.search}"` : 
           filters.category ? `${filters.category.charAt(0).toUpperCase() + filters.category.slice(1)}` : 
           'All Products'}
        </h1>
        {products.length > 0 && (
          <p className="results-count">{products.length} {products.length === 1 ? 'result' : 'results'}</p>
        )}
      </div>

      <div className="products-layout">
        <aside className="filters-sidebar">
          <h3>Filter Products</h3>
          
          <div className="filter-section">
            <label className="filter-label">Category</label>
            <div className="filter-options">
              <button
                className={`filter-option ${!filters.category ? 'active' : ''}`}
                onClick={() => handleFilterChange('category', '')}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`filter-option ${filters.category === cat ? 'active' : ''}`}
                  onClick={() => handleFilterChange('category', cat)}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <label className="filter-label">Price Range</label>
            <div className="price-filter-container">
              <div className="price-input-group">
                <label className="price-input-label">Min Price ($)</label>
                <input
                  type="number"
                  className="price-input"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => handlePriceFilterChange('minPrice', e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="price-input-group">
                <label className="price-input-label">Max Price ($)</label>
                <input
                  type="number"
                  className="price-input"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => handlePriceFilterChange('maxPrice', e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>
              {(filters.minPrice || filters.maxPrice) && (
                <div className="price-filter-active">
                  <span className="active-price-range">
                    {filters.minPrice && filters.maxPrice
                      ? `$${parseFloat(filters.minPrice).toFixed(2)} - $${parseFloat(filters.maxPrice).toFixed(2)}`
                      : filters.minPrice
                      ? `$${parseFloat(filters.minPrice).toFixed(2)}+`
                      : `Up to $${parseFloat(filters.maxPrice).toFixed(2)}`}
                  </span>
                  <button
                    className="clear-price-filter-btn"
                    onClick={clearPriceFilter}
                    type="button"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="filter-section">
            <label className="filter-label">Sort By</label>
            <select
              className="filter-select"
              value={filters.sort}
              onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
            >
              <option value="">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </aside>

        <div className="products-content">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="no-products">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <h2>No products found</h2>
              <p>Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;

