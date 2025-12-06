import productService from '../services/productService';

const productController = {
  // Fetch products with filters
  fetchProducts: async (filters = {}) => {
    try {
      const products = await productService.getAllProducts(filters);
      return { success: true, data: products };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error fetching products'
      };
    }
  },

  // Fetch single product
  fetchProduct: async (id) => {
    try {
      const product = await productService.getProductById(id);
      return { success: true, data: product };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error fetching product'
      };
    }
  },

  // Create product (Admin)
  createProduct: async (productData) => {
    try {
      const product = await productService.createProduct(productData);
      return { success: true, data: product };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error creating product'
      };
    }
  },

  // Update product (Admin)
  updateProduct: async (id, productData) => {
    try {
      const product = await productService.updateProduct(id, productData);
      return { success: true, data: product };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error updating product'
      };
    }
  },

  // Delete product (Admin)
  deleteProduct: async (id) => {
    try {
      await productService.deleteProduct(id);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error deleting product'
      };
    }
  },

  // Filter products by price
  filterByPrice: (products, minPrice, maxPrice) => {
    let filtered = [...products];
    
    if (minPrice) {
      const min = parseFloat(minPrice);
      if (!isNaN(min)) {
        filtered = filtered.filter(product => product.price >= min);
      }
    }
    
    if (maxPrice) {
      const max = parseFloat(maxPrice);
      if (!isNaN(max)) {
        filtered = filtered.filter(product => product.price <= max);
      }
    }
    
    return filtered;
  }
};

export default productController;

