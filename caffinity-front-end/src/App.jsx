// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import Login from './pages/Login'; 
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import ProfilePage from './pages/ProfilePage';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Cek authentication saat component mount
  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem('isAuthenticated') === 'true';
      console.log('🔐 Auth check:', authStatus);
      setIsAuthenticated(authStatus);
      setLoading(false);
    };
    
    checkAuth();
    
    const handleAuthChange = () => {
      console.log('🎯 Auth change event received');
      checkAuth();
    };
    
    window.addEventListener('auth-change', handleAuthChange);
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  // Fungsi logout
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('auth-change'));
    setIsAuthenticated(false);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const openChat = () => setIsChatOpen(true);
  const closeChat = () => setIsChatOpen(false);

  const handleOrderSuccess = () => {
    setCartItems([]);
    setAppliedPromo(null);
  };

  // Layout untuk protected pages
  const ProtectedLayout = ({ children }) => (
    <div className={`min-h-screen bg-gray-50 pb-16 ${isChatOpen ? 'chat-open' : ''}`}>
      {children}
      {!isChatOpen && <BottomNav cartCount={cartCount} isAuthenticated={isAuthenticated} />}
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-900 to-amber-700">
        <div className="text-white text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  console.log('🚀 App rendering, isAuthenticated:', isAuthenticated);

  return (
    <Router>
      <Routes>
        {/* Public route - Login */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected routes - hanya bisa diakses jika authenticated */}
        {isAuthenticated ? (
          <>
            <Route 
              path="/" 
              element={
                <ProtectedLayout>
                  <HomePage openChat={openChat} handleLogout={handleLogout} />
                </ProtectedLayout>
              } 
            />
            <Route 
              path="/home" 
              element={
                <ProtectedLayout>
                  <HomePage openChat={openChat} handleLogout={handleLogout} />
                </ProtectedLayout>
              } 
            />
            
            <Route 
              path="/menu" 
              element={
                <ProtectedLayout>
                  <MenuPage 
                    openChat={openChat} 
                    cartItems={cartItems}
                    setCartItems={setCartItems}
                  />
                </ProtectedLayout>
              } 
            />
            
            <Route 
              path="/cart" 
              element={
                <ProtectedLayout>
                  <CartPage 
                    openChat={openChat}
                    cartItems={cartItems}
                    setCartItems={setCartItems}
                    appliedPromo={appliedPromo}
                    setAppliedPromo={setAppliedPromo}
                  />
                </ProtectedLayout>
              } 
            />
            
            <Route 
              path="/checkout" 
              element={
                <ProtectedLayout>
                  <CheckoutPage 
                    cartItems={cartItems}
                    appliedPromo={appliedPromo}
                    openChat={openChat}
                  />
                </ProtectedLayout>
              } 
            />
            
            <Route 
              path="/order-success" 
              element={
                <ProtectedLayout>
                  <OrderSuccessPage 
                    onOrderComplete={handleOrderSuccess}
                  />
                </ProtectedLayout>
              } 
            />
            
            <Route 
              path="/profile" 
              element={
                <ProtectedLayout>
                  <ProfilePage openChat={openChat} handleLogout={handleLogout} />
                </ProtectedLayout>
              } 
            />
          </>
        ) : (
          // Jika tidak authenticated, redirect semua route ke login
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;