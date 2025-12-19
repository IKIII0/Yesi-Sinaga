// utils/orderService.js
import api from './api';

// Simpan cart sementara di localStorage (opsional)
const CART_KEY = 'coffee_shop_cart_temp';

// Cart Service (local storage fallback)
export const cartService = {
  // Get cart from localStorage (temporary)
  getCart: () => {
    try {
      const cart = localStorage.getItem(CART_KEY);
      return cart ? JSON.parse(cart) : [];
    } catch (error) {
      console.error('Error getting cart from localStorage:', error);
      return [];
    }
  },

  // Save cart to localStorage (temporary)
  saveCart: (cartItems) => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
      return true;
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
      return false;
    }
  },

  // Clear cart from localStorage
  clearCart: () => {
    localStorage.removeItem(CART_KEY);
  }
};

// Order Service (API calls)
export const orderService = {
  // Create new order
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error creating order:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create order',
        error: error.response?.data
      };
    }
  },

  // Confirm order as completed
  confirmOrder: async (orderId) => {
    try {
      const response = await api.put(`/orders/${orderId}/confirm`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Error confirming order:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to confirm order',
      };
    }
  },

  // Get all orders for current user
  getUserOrders: async () => {
    try {
      const response = await api.get('/orders');
      return {
        success: true,
        data: response.data.data,
        count: response.data.count
      };
    } catch (error) {
      console.error('Error getting orders:', error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Failed to fetch orders'
      };
    }
  },

  // Get single order by ID
  getOrderById: async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Error getting order:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch order'
      };
    }
  },

  // Cancel order
  cancelOrder: async (orderId) => {
    try {
      const response = await api.put(`/orders/${orderId}/cancel`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error cancelling order:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to cancel order'
      };
    }
  },

  // Generate order number (client-side fallback)
  generateOrderNumber: () => {
    const date = new Date();
    const dateStr = date.getFullYear().toString().slice(-2) + 
                   (date.getMonth() + 1).toString().padStart(2, '0') + 
                   date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ORD-${dateStr}${random}`;
  }
};

// Product Service
export const productService = {
  // Get all products
  getProducts: async (params = {}) => {
    try {
      const response = await api.get('/products', { params });
      return {
        success: true,
        data: response.data.data,
        count: response.data.count
      };
    } catch (error) {
      console.error('Error getting products:', error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Failed to fetch products'
      };
    }
  },

  // Get product by ID
  getProductById: async (productId) => {
    try {
      const response = await api.get(`/products/${productId}`);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Error getting product:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch product'
      };
    }
  },

  // Get featured products
  getFeaturedProducts: async () => {
    try {
      const response = await api.get('/products/featured');
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Error getting featured products:', error);
      return {
        success: false,
        data: [],
        message: 'Failed to fetch featured products'
      };
    }
  },

  // Get flash sale products
  getFlashSaleProducts: async () => {
    try {
      const response = await api.get('/products/flash-sale');
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Error getting flash sale products:', error);
      return {
        success: false,
        data: [],
        message: 'Failed to fetch flash sale products'
      };
    }
  }
};

// Auth Service
export const authService = {
  // Register new user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      // Save token and user data
      if (response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error registering:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      // Save token and user data
      if (response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error logging in:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Error getting profile:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch profile'
      };
    }
  },

  // Update profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/auth/profile', profileData);
      // Update user in localStorage
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({
        ...currentUser,
        ...response.data.data.user
      }));
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error updating profile:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update profile'
      };
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Get current user
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      return null;
    }
  }
};

// User Service
export const userService = {
  // Get user favorites
  getFavorites: async () => {
    try {
      const response = await api.get('/users/favorites');
      return {
        success: true,
        data: response.data.data,
        count: response.data.count
      };
    } catch (error) {
      console.error('Error getting favorites:', error);
      return {
        success: false,
        data: [],
        message: 'Failed to fetch favorites'
      };
    }
  },

  // Add to favorites
  addToFavorites: async (productId) => {
    try {
      const response = await api.post(`/users/favorites/${productId}`);
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error adding to favorites:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add to favorites'
      };
    }
  },

  // Remove from favorites
  removeFromFavorites: async (productId) => {
    try {
      const response = await api.delete(`/users/favorites/${productId}`);
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error removing from favorites:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to remove from favorites'
      };
    }
  },

  // Update password
  updatePassword: async (passwordData) => {
    try {
      const response = await api.put('/users/password', passwordData);
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error updating password:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update password'
      };
    }
  }
};

// Cart API Service (jika menggunakan cart di backend)
export const cartApiService = {
  // Get cart from backend
  getCart: async () => {
    try {
      const userRaw = localStorage.getItem('user');
      const user = userRaw ? JSON.parse(userRaw) : null;
      if (!user?.id) {
        return {
          success: false,
          data: { items: [], itemCount: 0, totalPrice: 0 },
        };
      }

      const response = await api.get(`/cart/user/${user.id}`);
      const cartRows = response.data.cart || [];

      const items = cartRows.map((row) => ({
        id: row.id,
        product_id: row.product_id,
        name: row.product_name,
        price: Number(row.product_price),
        image: row.product_image,
        quantity: row.quantity,
      }));

      const totalPrice = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      return {
        success: true,
        data: {
          items,
          itemCount: items.length,
          totalPrice,
        },
      };
    } catch (error) {
      console.error('Error getting cart:', error);
      return {
        success: false,
        data: { items: [], itemCount: 0, totalPrice: 0 }
      };
    }
  },

  // Add to cart in backend
  addToCart: async (itemData) => {
    try {
      const userRaw = localStorage.getItem('user');
      const user = userRaw ? JSON.parse(userRaw) : null;
      if (!user?.id) {
        return {
          success: false,
          message: 'User not logged in',
        };
      }

      const payload = {
        user_id: user.id,
        product_id: itemData.product_id,
        product_name: itemData.name,
        product_price: itemData.price,
        product_image: itemData.image,
        quantity: itemData.quantity ?? 1,
      };

      const response = await api.post('/cart', payload);
      return {
        success: true,
        data: response.data.cartItem,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Error adding to cart:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add to cart'
      };
    }
  },

  // Update cart item in backend
  updateCartItem: async (itemId, updates) => {
    try {
      const response = await api.put(`/cart/${itemId}`, {
        quantity: updates.quantity,
      });
      return {
        success: true,
        data: response.data.cartItem,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Error updating cart item:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update cart item'
      };
    }
  },

  // Remove from cart in backend
  removeFromCart: async (itemId) => {
    try {
      const response = await api.delete(`/cart/${itemId}`);
      return {
        success: true,
        data: response.data.cartItem,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Error removing from cart:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to remove from cart'
      };
    }
  },

  // Clear cart in backend
  clearCart: async () => {
    try {
      const userRaw = localStorage.getItem('user');
      const user = userRaw ? JSON.parse(userRaw) : null;
      if (!user?.id) {
        return {
          success: false,
          message: 'User not logged in',
        };
      }

      const response = await api.delete(`/cart/clear/${user.id}`);
      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Error clearing cart:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to clear cart'
      };
    }
  }
};

// Fallback jika backend belum ready (development mode)
export const isBackendAvailable = async () => {
  try {
    await api.get('/health');
    return true;
  } catch (error) {
    console.warn('Backend not available, using localStorage fallback');
    return false;
  }
};