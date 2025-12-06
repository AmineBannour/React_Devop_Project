import axios from 'axios';

const productService = {
  // Get all products
  getAllProducts: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.category) queryParams.append('category', params.category);
    if (params.search) queryParams.append('search', params.search);
    if (params.sort) queryParams.append('sort', params.sort);
    
    const response = await axios.get(`/api/products?${queryParams.toString()}`);
    return response.data;
  },

  // Get product by ID
  getProductById: async (id) => {
    const response = await axios.get(`/api/products/${id}`);
    return response.data;
  },

  // Create product (Admin only)
  createProduct: async (productData) => {
    const response = await axios.post('/api/products', productData);
    return response.data;
  },

  // Update product (Admin only)
  updateProduct: async (id, productData) => {
    const response = await axios.put(`/api/products/${id}`, productData);
    return response.data;
  },

  // Delete product (Admin only)
  deleteProduct: async (id) => {
    const response = await axios.delete(`/api/products/${id}`);
    return response.data;
  }
};

export default productService;

