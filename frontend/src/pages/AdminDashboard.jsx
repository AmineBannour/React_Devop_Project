import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import adminController from '../controllers/adminController';
import productController from '../controllers/productController';
import '../styles/pages/AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [editingProduct, setEditingProduct] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    stock: ''
  });

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    const result = await adminController.fetchDashboardStats();
    if (result.success) {
      setOrders(result.data.orders);
      setProducts(result.data.products);
      setStats({
        totalOrders: result.data.totalOrders,
        totalProducts: result.data.totalProducts,
        totalRevenue: result.data.totalRevenue,
        pendingOrders: result.data.pendingOrders
      });
    } else {
      console.error('Error fetching data:', result.message);
    }
    setLoading(false);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    const result = await productController.deleteProduct(id);
    if (result.success) {
      setProducts(products.filter(p => p._id !== id));
      setStats(prev => ({ ...prev, totalProducts: prev.totalProducts - 1 }));
    } else {
      alert('Error deleting product: ' + result.message);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product._id);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      stock: product.stock
    });
  };

  const handleUpdateProduct = async (id) => {
    const result = await productController.updateProduct(id, productForm);
    if (result.success) {
      setProducts(products.map(p => p._id === id ? result.data : p));
      setEditingProduct(null);
      setProductForm({
        name: '',
        description: '',
        price: '',
        image: '',
        category: '',
        stock: ''
      });
    } else {
      alert('Error updating product: ' + result.message);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    const result = await productController.createProduct(productForm);
    if (result.success) {
      setProducts([...products, result.data]);
      setStats(prev => ({ ...prev, totalProducts: prev.totalProducts + 1 }));
      setProductForm({
        name: '',
        description: '',
        price: '',
        image: '',
        category: '',
        stock: ''
      });
      setShowCreateForm(false);
    } else {
      alert('Error creating product: ' + result.message);
    }
  };

  const handleMarkDelivered = async (orderId) => {
    const result = await adminController.markOrderDelivered(orderId);
    if (result.success) {
      fetchData();
    } else {
      alert('Error updating order: ' + result.message);
    }
  };

  if (loading) {
    return <div className="admin-dashboard-loading">Loading...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back, {user?.name}</p>
      </div>

      <div className="admin-tabs">
        <button
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={activeTab === 'orders' ? 'active' : ''}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
        <button
          className={activeTab === 'products' ? 'active' : ''}
          onClick={() => setActiveTab('products')}
        >
          Products
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="admin-overview">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Orders</h3>
              <p className="stat-value">{stats.totalOrders}</p>
            </div>
            <div className="stat-card">
              <h3>Total Products</h3>
              <p className="stat-value">{stats.totalProducts}</p>
            </div>
            <div className="stat-card">
              <h3>Total Revenue</h3>
              <p className="stat-value">${stats.totalRevenue.toFixed(2)}</p>
            </div>
            <div className="stat-card">
              <h3>Pending Orders</h3>
              <p className="stat-value">{stats.pendingOrders}</p>
            </div>
          </div>

          <div className="recent-orders">
            <h2>Recent Orders</h2>
            <div className="orders-table">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map(order => (
                    <tr key={order._id}>
                      <td>{order._id.substring(0, 8)}...</td>
                      <td>{order.user?.name || 'N/A'}</td>
                      <td>${order.totalPrice?.toFixed(2)}</td>
                      <td>
                        <span className={`status-badge ${order.isDelivered ? 'delivered' : order.isPaid ? 'paid' : 'pending'}`}>
                          {order.isDelivered ? 'Delivered' : order.isPaid ? 'Paid' : 'Pending'}
                        </span>
                      </td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="admin-orders">
          <h2>All Orders</h2>
          <div className="orders-table">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Delivery</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id}>
                    <td>{order._id.substring(0, 8)}...</td>
                    <td>{order.user?.name || 'N/A'}</td>
                    <td>{order.orderItems?.length || 0}</td>
                    <td>${order.totalPrice?.toFixed(2)}</td>
                    <td>
                      <span className={`status-badge ${order.isPaid ? 'paid' : 'pending'}`}>
                        {order.isPaid ? 'Paid' : 'Pending'}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${order.isDelivered ? 'delivered' : 'pending'}`}>
                        {order.isDelivered ? 'Delivered' : 'Pending'}
                      </span>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      {!order.isDelivered && (
                        <button
                          className="btn-deliver"
                          onClick={() => handleMarkDelivered(order._id)}
                        >
                          Mark Delivered
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="admin-products">
          <div className="products-header">
            <h2>Products Management</h2>
            {!showCreateForm && editingProduct === null && (
              <button className="btn-create" onClick={() => setShowCreateForm(true)}>
                + Add New Product
              </button>
            )}
          </div>

          {showCreateForm ? (
            <div className="product-form-container">
              <h3>Create New Product</h3>
              <form onSubmit={handleCreateProduct} className="product-form">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Price</label>
                    <input
                      type="number"
                      step="0.01"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Stock</label>
                    <input
                      type="number"
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      required
                    >
                      <option value="">Select category</option>
                      <option value="electronics">Electronics</option>
                      <option value="clothing">Clothing</option>
                      <option value="books">Books</option>
                      <option value="home">Home</option>
                      <option value="sports">Sports</option>
                      <option value="toys">Toys</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Image URL</label>
                    <input
                      type="url"
                      value={productForm.image}
                      onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-primary">Create Product</button>
                  <button type="button" className="btn-secondary" onClick={() => {
                    setShowCreateForm(false);
                    setProductForm({
                      name: '',
                      description: '',
                      price: '',
                      image: '',
                      category: '',
                      stock: ''
                    });
                  }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="products-table">
              <table>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product._id}>
                      <td>
                        <img src={product.image} alt={product.name} className="product-thumb" />
                      </td>
                      <td>{product.name}</td>
                      <td>{product.category}</td>
                      <td>${product.price?.toFixed(2)}</td>
                      <td>{product.stock}</td>
                      <td>
                        <div className="action-buttons">
                          {editingProduct === product._id ? (
                            <>
                              <input
                                type="text"
                                value={productForm.name}
                                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                                className="edit-input"
                              />
                              <input
                                type="number"
                                step="0.01"
                                value={productForm.price}
                                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                                className="edit-input"
                              />
                              <input
                                type="number"
                                value={productForm.stock}
                                onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                                className="edit-input"
                              />
                              <button
                                className="btn-save"
                                onClick={() => handleUpdateProduct(product._id)}
                              >
                                Save
                              </button>
                              <button
                                className="btn-cancel"
                                onClick={() => setEditingProduct(null)}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="btn-edit"
                                onClick={() => handleEditProduct(product)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn-delete"
                                onClick={() => handleDeleteProduct(product._id)}
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

