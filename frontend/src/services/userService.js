import axios from 'axios';

const userService = {
  // Register user
  register: async (name, email, password) => {
    const response = await axios.post('/api/users/register', {
      name,
      email,
      password
    });
    return response.data;
  },

  // Login user
  login: async (email, password) => {
    const response = await axios.post('/api/users/login', { email, password });
    return response.data;
  },

  // Get user profile
  getProfile: async () => {
    const response = await axios.get('/api/users/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await axios.put('/api/users/profile', profileData);
    return response.data;
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    const response = await axios.put('/api/users/change-password', {
      currentPassword,
      newPassword
    });
    return response.data;
  }
};

export default userService;

