import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { orderService, authService } from '../utils/orderService';

// Ikon SVG (dipertahankan dari implementasi awal)
const HomeIcon = ({ active = false }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke={active ? '#92400E' : '#9CA3AF'} strokeWidth="1.5" fill="none" />
    <path d="M9 17H15" stroke={active ? '#92400E' : '#9CA3AF'} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M12 9V13" stroke={active ? '#92400E' : '#9CA3AF'} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M9 13H15" stroke={active ? '#92400E' : '#9CA3AF'} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const CoffeeIcon = ({ active = false }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke={active ? '#92400E' : '#9CA3AF'} strokeWidth="1.5" fill="none" />
    <path d="M8 12H16" stroke={active ? '#92400E' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" />
    <path d="M10 8V12H14V8" stroke={active ? '#92400E' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" />
    <path d="M8 16H16" stroke={active ? '#92400E' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const CartIcon = ({ count = 0, active = false }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke={active ? '#92400E' : '#9CA3AF'} strokeWidth="1.5" fill="none" />
    <circle cx="9" cy="9" r="2" stroke={active ? '#92400E' : '#9CA3AF'} strokeWidth="1.5" fill="none" />
    <circle cx="15" cy="9" r="2" stroke={active ? '#92400E' : '#9CA3AF'} strokeWidth="1.5" fill="none" />
    <path d="M6 18L9 9" stroke={active ? '#92400E' : '#9CA3AF'} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M18 18L15 9" stroke={active ? '#92400E' : '#9CA3AF'} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M6 18H18" stroke={active ? '#92400E' : '#9CA3AF'} strokeWidth="1.5" strokeLinecap="round" />
    {count > 0 && (
      <circle cx="18" cy="6" r="4" fill="#EF4444" stroke="white" strokeWidth="1">
        <text x="18" y="8" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">
          {count > 9 ? '9+' : count}
        </text>
      </circle>
    )}
  </svg>
);

const ProfileIcon = ({ active = false, size = '24' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke={active ? '#92400E' : '#9CA3AF'} strokeWidth="1.5" fill="none" />
    <circle cx="12" cy="9" r="3" stroke={active ? '#92400E' : '#9CA3AF'} strokeWidth="1.5" fill="none" />
    <path d="M6 20C6 16 9 13 12 13C15 13 18 16 18 20" stroke={active ? '#92400E' : '#9CA3AF'} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="7" stroke="#F59E0B" strokeWidth="1" fill="none" />
    <path d="M8 3L9.5 6L13 6.5L10.5 9L11 13L8 11L5 13L5.5 9L3 6.5L6.5 6L8 3Z" fill="#F59E0B" stroke="#F59E0B" strokeWidth="0.5" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="9" stroke="#9CA3AF" strokeWidth="1.5" fill="none" />
    <path d="M7 6H13V14H7V6Z" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M8 6V5" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M12 6V5" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const LocationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="9" stroke="#9CA3AF" strokeWidth="1.5" fill="none" />
    <circle cx="10" cy="8" r="3" stroke="#9CA3AF" strokeWidth="1.5" fill="none" />
    <path d="M6 16C7 13 9 11 10 11C11 11 13 13 14 16" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1" fill="none" />
    <path d="M6 5L10 8L6 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const NotificationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M10 6V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M10 12V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const SecurityIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M6 10L9 13L14 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const PaymentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <rect x="6" y="7" width="8" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <path d="M6 10H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const HelpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <circle cx="10" cy="7" r="1" fill="currentColor" />
    <path d="M10 9V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1" fill="none" />
    <path d="M9 5L11 7L7 11H5V9L9 5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 6L11 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const SaveIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1" fill="none" />
    <path d="M6 9L8 11L11 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const CancelIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1" fill="none" />
    <path d="M6 6L10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M10 6L6 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const CameraIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="9" stroke="white" strokeWidth="1.5" fill="none" />
    <circle cx="10" cy="10" r="7" fill="#92400E" />
    <path d="M13 8C13.5523 8 14 8.44772 14 9V11C14 11.5523 13.5523 12 13 12H7C6.44772 12 6 11.5523 6 11V9C6 8.44772 6.44772 8 7 8H8L9 7H11L12 8H13Z" stroke="white" strokeWidth="0.8" fill="none" />
    <circle cx="10" cy="10" r="2" stroke="white" strokeWidth="0.8" fill="none" />
  </svg>
);

const UserCircleIcon = ({ size = '80' }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="40" cy="40" r="38" stroke="#92400E" strokeWidth="3" fill="#FEF3C7" />
    <circle cx="40" cy="25" r="10" stroke="#92400E" strokeWidth="2" fill="none" />
    <path d="M20 60C25 45 35 35 40 35C45 35 55 45 60 60" stroke="#92400E" strokeWidth="2.5" strokeLinecap="round" fill="none" />
  </svg>
);

const ProfilePage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [orderHistory, setOrderHistory] = useState([]);

  const favorites = [
    {
      id: 1,
      name: 'Caramel Macchiato',
      type: 'Coffee',
      timesOrdered: 12,
      image: 'https://dinnerthendessert.com/wp-content/uploads/2023/10/Caramel-Macchiato-7-500x500.jpg',
    },
    {
      id: 2,
      name: 'Matcha Latte',
      type: 'Tea',
      timesOrdered: 8,
      image: 'https://mocktail.net/wp-content/uploads/2021/05/Iced-Matcha-Latte_1.jpg',
    },
    {
      id: 3,
      name: 'Chocolate Croissant',
      type: 'Pastry',
      timesOrdered: 5,
      image: 'https://www.lalevain.com/wp-content/uploads/2021/11/Xsant.jpg',
    },
    {
      id: 4,
      name: 'Iced Americano',
      type: 'Coffee',
      timesOrdered: 4,
      image: 'https://diethood.com/wp-content/uploads/2023/08/iced-americano-3.jpg',
    },
  ];

  const getOrderHistory = async () => {
    try {
      const result = await orderService.getUserOrders();
      if (result.success && Array.isArray(result.data)) {
        const adapted = result.data.map((order) => ({
          id: order.id,
          orderNumber: `ORD-${order.id}`,
          items: [],
          itemsDetailed: [],
          total: Number(order.total_amount) || 0,
          orderSummary: {
            subtotal: Number(order.total_amount) || 0,
            tax: 0,
            deliveryFee: 0,
            platformFee: 0,
            tips: 0,
            promoDiscount: 0,
            total: Number(order.total_amount) || 0,
          },
          date: order.created_at,
          status: order.status || 'Completed',
          statusColor:
            order.status === 'cancelled'
              ? 'bg-red-100 text-red-800'
              : order.status === 'pending'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-green-100 text-green-800',
        }));

        localStorage.setItem('coffee_shop_order_history', JSON.stringify(adapted));
        return adapted;
      }
    } catch (error) {
      console.error('Error getting order history from backend:', error);
    }

    try {
      const orders = localStorage.getItem('coffee_shop_order_history');
      return orders ? JSON.parse(orders) : [];
    } catch (error) {
      console.error('Error getting order history from localStorage:', error);
      return [];
    }
  };

  const clearOrderHistory = () => {
    localStorage.removeItem('coffee_shop_order_history');
    setOrderHistory([]);
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const profileResult = await authService.getProfile();
        if (profileResult.success && profileResult.data) {
          const backendUser = profileResult.data;
          setUser((prev) => ({
            ...prev,
            name: backendUser.username || backendUser.name || prev.name,
            email: backendUser.email || prev.email,
          }));
        } else {
          const localUserRaw = localStorage.getItem('user');
          if (localUserRaw) {
            try {
              const localUser = JSON.parse(localUserRaw);
              setUser((prev) => ({
                ...prev,
                name: localUser.username || localUser.name || prev.name,
                email: localUser.email || prev.email,
              }));
            } catch (e) {
              console.error('Error parsing local user:', e);
            }
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }

      const orders = await getOrderHistory();
      setOrderHistory(orders);
    };

    loadInitialData();

    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam && ['profile', 'orders', 'favorites'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location]);

  const handleEditClick = () => {
    setIsEditing(true);

    const nameParts = (user.name || '').trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    let streetAddress = '';
    let city = '';
    let state = '';
    let zipCode = '';

    if (user.address) {
      const addressParts = user.address.split('\n');
      const [street, cityStateZip] = addressParts;
      streetAddress = street || '';

      if (cityStateZip) {
        const [cityName, stateZip] = cityStateZip.split(', ');
        city = cityName || '';
        if (stateZip) {
          const [st, zip] = stateZip.split(' ');
          state = st || '';
          zipCode = zip || '';
        }
      }
    }

    setFormData({
      ...formData,
      firstName,
      lastName,
      email: user.email || '',
      phone: user.phone || '',
      streetAddress,
      city,
      state,
      zipCode,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const payload = {
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      phone: formData.phone,
      address: `${formData.streetAddress}\n${formData.city}, ${formData.state} ${formData.zipCode}`,
    };

    try {
      const result = await authService.updateProfile(payload);

      if (!result.success) {
        alert(result.message || 'Failed to update profile');
        return;
      }

      let finalUser = { ...user, ...payload };
      try {
        const storedUserRaw = localStorage.getItem('user');
        if (storedUserRaw) {
          const storedUser = JSON.parse(storedUserRaw);
          finalUser = {
            ...finalUser,
            name: storedUser.username || storedUser.name || finalUser.name,
            email: storedUser.email || finalUser.email,
          };
        }
      } catch (err) {
        console.error('Error syncing user from localStorage after update:', err);
      }

      setUser(finalUser);
      setIsEditing(false);
      setShowSuccessMessage(true);
      setShowPasswordForm(false);

      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Terjadi kesalahan saat menyimpan profil');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setShowPasswordForm(false);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }

    console.log('Password change requested');
    setFormData({
      ...formData,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const refreshOrderHistory = async () => {
    const orders = await getOrderHistory();
    setOrderHistory(orders);
  };

  const handleConfirmOrderReceived = async (orderId) => {
    if (!orderId) return;
    try {
      const resultConfirm = await Swal.fire({
        title: 'Konfirmasi pesanan',
        text: 'Apakah pesanan ini sudah sampai?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Ya, sudah sampai',
        cancelButtonText: 'Belum',
        confirmButtonColor: '#16A34A',
        cancelButtonColor: '#6B7280',
      });

      if (!resultConfirm.isConfirmed) {
        return;
      }

      const result = await orderService.confirmOrder(orderId);
      if (!result.success) {
        await Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: result.message || 'Gagal mengkonfirmasi pesanan',
        });
        return;
      }

      await refreshOrderHistory();

      await Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Status pesanan berhasil diperbarui.',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('Error confirming order received:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Terjadi kesalahan saat mengkonfirmasi pesanan',
      });
    }
  };

  const AccountSettings = () => (
    <div className="mt-6 mb-6 mx-4">
      <div className="bg-white rounded-2xl p-5 shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Account Settings</h3>
        <div className="space-y-3">
          <button className="w-full text-left p-3 rounded-xl hover:bg-gray-50 transition-colors duration-300 flex justify-between items-center group">
            <div className="flex items-center gap-3">
              <NotificationIcon />
              <span>Notifications</span>
            </div>
            <ArrowRightIcon />
          </button>
          <button className="w-full text-left p-3 rounded-xl hover:bg-gray-50 transition-colors duration-300 flex justify-between items-center group">
            <div className="flex items-center gap-3">
              <SecurityIcon />
              <span>Privacy & Security</span>
            </div>
            <ArrowRightIcon />
          </button>
          <button className="w-full text-left p-3 rounded-xl hover:bg-gray-50 transition-colors duration-300 flex justify-between items-center group">
            <div className="flex items-center gap-3">
              <PaymentIcon />
              <span>Payment Methods</span>
            </div>
            <ArrowRightIcon />
          </button>
          <button className="w-full text-left p-3 rounded-xl hover:bg-gray-50 transition-colors duration-300 flex justify-between items-center group">
            <div className="flex items-center gap-3">
              <HelpIcon />
              <span>Help & Support</span>
            </div>
            <ArrowRightIcon />
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={async () => {
              const result = await Swal.fire({
                title: 'Sign Out',
                text: 'Apakah Anda yakin ingin keluar?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ya, keluar',
                cancelButtonText: 'Batal',
                confirmButtonColor: '#DC2626',
                cancelButtonColor: '#6B7280',
              });

              if (!result.isConfirmed) return;

              authService.logout();
              navigate('/login');
            }}
            className="w-full text-amber-600 p-3 rounded-xl hover:bg-amber-50 transition-colors duration-300 font-medium flex items-center justify-between mb-2"
          >
            <span>Sign Out</span>
          </button>

          <button
            onClick={() => setShowDeleteAccountModal(true)}
            className="w-full text-red-600 p-3 rounded-xl hover:bg-red-50 transition-colors duration-300 font-medium flex items-center justify-between"
          >
            <span>Delete Account</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pb-24 w-full">
      <div className="mx-4 pt-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === 'profile' ? 'text-amber-700 border-b-2 border-amber-700' : 'text-gray-500'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === 'orders' ? 'text-amber-700 border-b-2 border-amber-700' : 'text-gray-500'
            }`}
          >
            Orders {orderHistory.length > 0 && `(${orderHistory.length})`}
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === 'favorites' ? 'text-amber-700 border-b-2 border-amber-700' : 'text-gray-500'
            }`}
          >
            Favorites
          </button>
        </div>
      </div>

      {showSuccessMessage && (
        <div className="mt-3 mx-4 p-3 bg-green-100 text-green-800 rounded-xl flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10" cy="10" r="9" stroke="#10B981" strokeWidth="1.5" fill="none" />
            <path d="M6 10L9 13L14 8" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="font-medium">Profile updated successfully!</span>
        </div>
      )}

      <div className="mt-4 mx-4">
        {activeTab === 'profile' && (
          <>
            {!isEditing ? (
              <div className="bg-white rounded-2xl p-5 shadow-lg mb-5">
                <div className="flex flex-col items-center mb-6">
                  <div className="w-32 h-32 flex items-center justify-center">
                    <UserCircleIcon size="80" />
                  </div>
                  <div className="text-center mt-4">
                    <h2 className="text-2xl font-bold text-gray-900">{user.name || 'Your Name'}</h2>
                    <p className="text-gray-600 mt-1">{user.email || 'your.email@example.com'}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <PhoneIcon />
                    <div>
                      <p className="text-sm text-gray-500 text-left">Phone</p>
                      <p className="font-medium">{user.phone || '-'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <LocationIcon />
                    <div>
                      <p className="text-sm text-gray-500 text-left">Address</p>
                      <p className="font-medium whitespace-pre-line text-left">{user.address || '-'}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleEditClick}
                  className="mt-6 w-full border-2 border-amber-700 text-amber-700 py-3 rounded-xl font-medium hover:bg-amber-50 transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  <EditIcon />
                  Edit Profile
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-5 shadow-lg mb-5">
                <h2 className="text-xl font-bold text-gray-900 mb-5">Edit Profile</h2>
                <form onSubmit={handleSave}>
                  <div className="mb-5">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="mb-5">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Address Information</h3>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                      <input
                        type="text"
                        name="streetAddress"
                        value={formData.streetAddress}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ZIP/Postal Code</label>
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="flex-1 bg-amber-700 text-white py-3 rounded-xl font-medium hover:bg-amber-800 transition-colors duration-300 flex items-center justify-center gap-2"
                    >
                      <SaveIcon />
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-300 flex items-center justify-center gap-2"
                    >
                      <CancelIcon />
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Order History</h2>
              {orderHistory.length > 0 && (
                <button
                  onClick={refreshOrderHistory}
                  className="text-sm text-amber-600 hover:text-amber-800"
                  title="Refresh orders"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    <path d="M8 4V8L10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M10.5 5.5L13 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              )}
            </div>

            {orderHistory.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
                <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="9" stroke="#92400E" strokeWidth="1.5" fill="none" />
                    <path d="M8 16H16" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M10 10V12" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M14 10V12" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M7.5 16L8.5 10H15.5L16.5 16H7.5Z" stroke="#92400E" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Orders Yet</h3>
                <p className="text-gray-600 mb-6">You haven't placed any orders yet. Start exploring our menu!</p>
                <Link
                  to="/menu"
                  className="inline-block bg-amber-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-amber-800 transition-colors"
                >
                  Browse Menu
                </Link>
              </div>
            ) : (
              <>
                {(Array.isArray(orderHistory) ? orderHistory : [orderHistory]).map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-gray-900">Order #{order.orderNumber}</h3>
                        <p className="text-gray-500 text-sm mt-1">{order.date}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.statusColor || 'bg-green-100 text-green-800'
                        }`}
                      >
                        {order.status || 'Completed'}
                      </span>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-2">Items:</p>
                      <div className="flex flex-wrap gap-2">
                        {(Array.isArray(order.items) ? order.items : []).slice(0, 3).map((item, index) => (
                          <span
                            key={index}
                            className="bg-amber-50 text-amber-800 text-sm px-3 py-1 rounded-full"
                          >
                            {item}
                          </span>
                        ))}
                        {order.items?.length > 3 && (
                          <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">
                            +{order.items.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      <div>
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="text-xl font-bold text-amber-800">
                          Rp {(order.total || 0).toLocaleString('id-ID')}
                        </p>
                      </div>

                      {order.status !== 'completed' && order.status !== 'Completed' && (
                        <button
                          onClick={() => handleConfirmOrderReceived(order.id)}
                          className="ml-4 px-4 py-2 text-xs font-medium rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors"
                        >
                          Konfirmasi sudah sampai
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                <div className="text-center mt-4">
                  <button
                    onClick={clearOrderHistory}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Clear All Orders
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Favorites</h2>
            {favorites.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{item.name}</h3>
                      <p className="text-gray-500 text-sm">{item.type}</p>
                    </div>
                  </div>
                  <span className="bg-red-50 text-red-600 text-sm px-3 py-1 rounded-full flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="#DC2626" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6 2L7.5 4.5L10 5L8 7L8.5 10L6 8.5L3.5 10L4 7L2 5L4.5 4.5L6 2Z"
                        stroke="#DC2626"
                        strokeWidth="0.5"
                      />
                    </svg>
                    {item.timesOrdered} times
                  </span>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <button className="flex-1 border border-amber-200 text-amber-700 py-2 rounded-xl font-medium hover:bg-amber-50 mr-2">
                    Order Again
                  </button>
                  <button className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-xl font-medium hover:bg-gray-50">
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="bg-gradient-to-r from-amber-100 to-amber-50 rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-amber-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <StarIcon />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Discover New Favorites</h3>
              <p className="text-gray-600 mb-4">Try our seasonal specials and limited edition drinks!</p>
              <Link
                to="/menu"
                className="inline-block bg-amber-700 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-amber-800 transition-colors"
              >
                Explore Menu
              </Link>
            </div>
          </div>
        )}
      </div>

      {activeTab === 'profile' && !isEditing && <AccountSettings />}

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl py-3">
        <div className="flex justify-center">
          <div className="flex justify-between w-full max-w-md px-6">
            <Link
              to="/home"
              className="flex flex-col items-center text-gray-500 hover:text-amber-700 transition-colors flex-1 group"
            >
              <div className="group-hover:scale-110 transition-transform duration-200">
                <HomeIcon />
              </div>
              <span className="text-xs font-medium mt-1">Home</span>
            </Link>

            <Link
              to="/menu"
              className="flex flex-col items-center text-gray-500 hover:text-amber-700 transition-colors flex-1 group"
            >
              <div className="group-hover:scale-110 transition-transform duration-200">
                <CoffeeIcon />
              </div>
              <span className="text-xs font-medium mt-1">Menu</span>
            </Link>

            <Link
              to="/cart"
              className="flex flex-col items-center text-gray-500 hover:text-amber-700 transition-colors flex-1 group relative"
            >
              <div className="group-hover:scale-110 transition-transform duration-200">
                <CartIcon count={4} />
              </div>
              <span className="text-xs font-medium mt-1">Cart</span>
            </Link>

            <Link
              to="/profile"
              className="flex flex-col items-center text-amber-700 flex-1 group relative"
            >
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="4" cy="4" r="4" fill="#92400E" />
                </svg>
              </div>
              <div className="group-hover:scale-110 transition-transform duration-200">
                <ProfileIcon active={true} />
              </div>
              <span className="text-xs font-bold mt-1">Me</span>
            </Link>
          </div>
        </div>
      </nav>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;