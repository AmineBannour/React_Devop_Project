import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import './Products.css';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    sort: ''
  });

  useEffect(() => {
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    if (category || search) {
      setFilters({
        category: category || '',
        search: search || '',
        sort: ''
      });
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      if (filters.sort) params.append('sort', filters.sort);

      const res = await axios.get(`/api/products?${params.toString()}`);
      setProducts(res.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['electronics', 'clothing', 'books', 'home', 'sports', 'toys'];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
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

