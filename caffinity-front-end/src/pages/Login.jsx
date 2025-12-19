// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    // For register mode
    if (!isLoginMode) {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitSuccess(false);
      return;
    }

    setIsLoading(true);
    setErrors({});
    setIsSubmitSuccess(false);

    if (!isLoginMode) {
      // Register mode: call backend
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: formData.name,
            email: formData.email,
            password: formData.password
          })
        });
        const data = await res.json();
        if (data.success) {
          setIsSubmitSuccess(true);
          setErrors({ submit: 'Registration successful! Please login.' });
          setIsLoginMode(true);
          setFormData({
            email: formData.email,
            password: '',
            confirmPassword: '',
            name: '',
            rememberMe: false
          });
        } else {
          setIsSubmitSuccess(false);
          setErrors({ submit: data.error || 'Registration failed' });
        }
      } catch (error) {
        setIsSubmitSuccess(false);
        setErrors({ submit: 'Network error. Please try again.' });
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Login mode: call backend
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });
      const data = await res.json();
      if (data.success && data.token && data.user) {
        // Save to localStorage
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);

        if (formData.rememberMe) {
          localStorage.setItem('rememberedEmail', formData.email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }

        // Dispatch events for App.jsx to update state
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('auth-change'));

        // Navigate to home
        setTimeout(() => {
          navigate('/home');
        }, 100);
      } else {
        setIsSubmitSuccess(false);
        setErrors({ submit: data.error || 'Invalid email or password' });
      }
    } catch (error) {
      setIsSubmitSuccess(false);
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    alert('Password reset feature coming soon!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-amber-800 to-amber-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-amber-100 mb-2">
            {isLoginMode ? 'Sign in to Caffinity' : 'Create New Account'}
          </h2>
          <p className="text-amber-200 text-lg">
            {isLoginMode ? 'Or create a new account' : 'Join our coffee community'}
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          
          {/* Toggle Login/Register */}
          <div className="flex mb-8 border-b border-gray-200">
            <button
              onClick={() => setIsLoginMode(true)}
              disabled={isLoading}
              className={`flex-1 py-3 font-bold text-lg transition-colors ${
                isLoginMode 
                  ? 'text-amber-700 border-b-2 border-amber-700' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLoginMode(false)}
              disabled={isLoading}
              className={`flex-1 py-3 font-bold text-lg transition-colors ${
                !isLoginMode 
                  ? 'text-amber-700 border-b-2 border-amber-700' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div
              className={
                `mb-6 p-4 border-l-4 rounded-lg ` +
                (isSubmitSuccess
                  ? 'bg-green-50 border-green-500'
                  : 'bg-red-50 border-red-500')
              }
            >
              <div className="flex">
                <svg
                  className={`h-5 w-5 mr-3 ${
                    isSubmitSuccess ? 'text-green-500' : 'text-red-500'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  {isSubmitSuccess ? (
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  ) : (
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  )}
                </svg>
                <p
                  className={`text-sm ${
                    isSubmitSuccess ? 'text-green-700' : 'text-red-700'
                  }`}
                >
                  {errors.submit}
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Name Field (Register only) */}
            {!isLoginMode && (
              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className={`w-full px-4 py-3.5 bg-gray-50 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    errors.name 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                      : 'border-amber-200 focus:border-amber-500 focus:ring-amber-100'
                  }`}
                  disabled={isLoading}
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                )}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className={`w-full px-4 py-3.5 bg-gray-50 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all pr-10 ${
                    errors.email 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                      : 'border-amber-200 focus:border-amber-500 focus:ring-amber-100'
                  }`}
                  disabled={isLoading}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className={`w-full px-4 py-3.5 bg-gray-50 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all pr-12 ${
                    errors.password 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                      : 'border-amber-200 focus:border-amber-500 focus:ring-amber-100'
                  }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-amber-700 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field (Register only) */}
            {!isLoginMode && (
              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  className={`w-full px-4 py-3.5 bg-gray-50 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    errors.confirmPassword 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                      : 'border-amber-200 focus:border-amber-500 focus:ring-amber-100'
                  }`}
                  disabled={isLoading}
                />
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            {/* Remember Me & Forgot Password (Login only) */}
            {isLoginMode && (
              <div className="flex justify-between items-center">
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="sr-only"
                      disabled={isLoading}
                    />
                    <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${
                      formData.rememberMe 
                        ? 'bg-amber-600 border-amber-600' 
                        : 'border-gray-300'
                    }`}>
                      {formData.rememberMe && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="ml-2 text-gray-600 text-sm">Remember me</span>
                </label>
                
                <button 
                  type="button" 
                  onClick={handleForgotPassword}
                  className="text-amber-700 font-medium text-sm hover:text-amber-800 transition-colors"
                  disabled={isLoading}
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-800 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-xl active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isLoginMode ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                <>
                  {isLoginMode ? 'Sign In' : 'Create Account'}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>

            {/* Switch between Login/Register */}
            <div className="text-center pt-4">
              <p className="text-gray-600">
                {isLoginMode ? "Don't have an account? " : "Already have an account? "}
                <button
                  type="button"
                  onClick={() => setIsLoginMode(!isLoginMode)}
                  className="text-amber-700 font-bold hover:text-amber-800 transition-colors ml-1"
                  disabled={isLoading}
                >
                  {isLoginMode ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
          </form>
        </div>

        {/* Terms & Privacy */}
        <div className="mt-6 text-center">
          <p className="text-amber-200 text-xs">
            By continuing, you agree to our{' '}
            <button className="font-bold hover:text-white transition-colors">Terms of Service</button>
            {' '}and{' '}
            <button className="font-bold hover:text-white transition-colors">Privacy Policy</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;