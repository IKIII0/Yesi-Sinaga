import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Ikon SVG sesuai dengan style yang sudah ada
const HomeIcon = ({ active = false }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke={active ? "#92400E" : "#9CA3AF"} strokeWidth="1.5" fill="none" />
    <path d="M9 17H15" stroke={active ? "#92400E" : "#9CA3AF"} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M12 9V13" stroke={active ? "#92400E" : "#9CA3AF"} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M9 13H15" stroke={active ? "#92400E" : "#9CA3AF"} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const CoffeeIcon = ({ active = false }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke={active ? "#92400E" : "#9CA3AF"} strokeWidth="1.5" fill="none" />
    <path d="M8 12H16" stroke={active ? "#92400E" : "#9CA3AF"} strokeWidth="2" strokeLinecap="round" />
    <path d="M10 8V12H14V8" stroke={active ? "#92400E" : "#9CA3AF"} strokeWidth="2" strokeLinecap="round" />
    <path d="M8 16H16" stroke={active ? "#92400E" : "#9CA3AF"} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const CartIcon = ({ count = 0, active = false }) => (
  <div className="relative">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke={active ? "#92400E" : "#9CA3AF"} strokeWidth="1.5" fill="none" />
      <path d="M8 16H16" stroke={active ? "#92400E" : "#9CA3AF"} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 10V12" stroke={active ? "#92400E" : "#9CA3AF"} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14 10V12" stroke={active ? "#92400E" : "#9CA3AF"} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7.5 16L8.5 10H15.5L16.5 16H7.5Z" 
            stroke={active ? "#92400E" : "#9CA3AF"} 
            strokeWidth="1.5" 
            fill="none" 
            strokeLinejoin="round" />
    </svg>
    
    {/* Badge dengan jumlah item */}
    {count > 0 && (
      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold border-2 border-white shadow-md">
        {count > 9 ? '9+' : count}
      </div>
    )}
  </div>
);

const ProfileIcon = ({ active = false }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke={active ? "#92400E" : "#9CA3AF"} strokeWidth="1.5" fill="none" />
    <circle cx="12" cy="9" r="3" stroke={active ? "#92400E" : "#9CA3AF"} strokeWidth="1.5" fill="none" />
    <path d="M6 20C6 16 9 13 12 13C15 13 18 16 18 20" 
          stroke={active ? "#92400E" : "#9CA3AF"} 
          strokeWidth="1.5" 
          strokeLinecap="round" />
  </svg>
);


const CartIconHeader = ({ count = 0, active = false }) => (
  <div className="relative">
    <svg width="24" height="24"viewBox="0 0 24 24" fill="none"
      stroke={active ? "#92400E" : "#92400E"} strokeWidth="1.8"strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 4h2l2.4 12.4a2 2 0 0 0 2 1.6h7.2a2 2 0 0 0 2-1.6L21 8H6" />
      <circle cx="9" cy="20" r="1" /> <circle cx="18" cy="20" r="1" /></svg>

    {count > 0 && (
      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold border-2 border-white">
        {count > 9 ? "9+" : count} </div>)}
  </div>
);

const ProfileIconHeader = ({ active = false }) => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
    stroke={active ? "#92400E" : "#92400E"} strokeWidth="1.7" strokeLinecap="round"strokeLinejoin="round">
    {/* Head */}
    <circle cx="12" cy="8" r="3.5" />
    {/* Body */}
    <path d="M5 20c0-3.5 3.5-5.5 7-5.5s7 2 7 5.5" />
  </svg>
);

// Voucher Icon untuk Header
const VoucherIconHeader = ({ hasBadge = false, badgeCount = 0 }) => (
  <div className="relative">
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
      stroke="#92400E" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {/* Voucher/Ticket shape */}
      <path d="M4 8V6C4 4.9 4.9 4 6 4H18C19.1 4 20 4.9 20 6V8" strokeWidth="1.7"/>
      <path d="M4 16V18C4 19.1 4.9 20 6 20H18C19.1 20 20 19.1 20 18V16" strokeWidth="1.7"/>
      <line x1="4" y1="12" x2="20" y2="12" strokeWidth="1.7"/>
      <circle cx="8" cy="12" r="1" fill="#92400E"/>
      <circle cx="16" cy="12" r="1" fill="#92400E"/>
      <path d="M12 8V16" strokeWidth="1.7"/>
    </svg>
    
    {hasBadge && badgeCount > 0 && (
      <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold border-2 border-white">
        {badgeCount > 9 ? "9+" : badgeCount}
      </div>
    )}
  </div>
);

// Search Icon
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="9" r="7" stroke="#9CA3AF" strokeWidth="1.5" fill="none" />
    <path d="M14 14L17 17" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// Flash Sale Icon
const FlashSaleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="#92400E" strokeWidth="1.5" fill="none" />
    <path d="M13 7L9 13H13L11 17" stroke="#92400E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Coffee Category Icon
const CoffeeCategoryIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="18" stroke="#92400E" strokeWidth="2" fill="none" />
    <path d="M12 16H28" stroke="#92400E" strokeWidth="2" strokeLinecap="round" />
    <path d="M14 12V16H26V12" stroke="#92400E" strokeWidth="2" strokeLinecap="round" />
    <path d="M12 24H28" stroke="#92400E" strokeWidth="2" strokeLinecap="round" />
    <ellipse cx="20" cy="20" rx="8" ry="6" stroke="#92400E" strokeWidth="2" fill="none" />
  </svg>
);

// Tea Category Icon
const TeaCategoryIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org2000/svg">
    <circle cx="20" cy="20" r="18" stroke="#92400E" strokeWidth="2" fill="none" />
    <rect x="14" y="12" width="12" height="16" rx="2" stroke="#92400E" strokeWidth="2" fill="none" />
    <path d="M12 28H28" stroke="#92400E" strokeWidth="2" strokeLinecap="round" />
    <line x1="20" y1="12" x2="20" y2="28" stroke="#92400E" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Pastries Category Icon
const PastriesCategoryIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="18" stroke="#92400E" strokeWidth="2" fill="none" />
    <path d="M14 16C14 13.5 16 12 18 12H22C24 12 26 13.5 26 16V24C26 26.5 24 28 22 28H18C16 28 14 26.5 14 24V16Z" 
          stroke="#92400E" strokeWidth="2" fill="none" />
    <path d="M14 20H26" stroke="#92400E" strokeWidth="2" strokeLinecap="round" />
    <circle cx="20" cy="16" r="1" fill="#92400E" />
    <circle cx="20" cy="24" r="1" fill="#92400E" />
  </svg>
);

// Voucher Modal Component
const VoucherModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('available');
  
  const availableVouchers = [
    { 
      id: 1, 
      code: 'CAFFINITY25', 
      discount: '25% OFF', 
      description: '25% discount on all drinks', 
      validUntil: '2024-12-31', 
      minPurchase: 50000 
    },
    { 
      id: 2, 
      code: 'WELCOME10', 
      discount: '10% OFF', 
      description: '10% off first order', 
      validUntil: '2024-12-15', 
      minPurchase: 25000 
    },
    { 
      id: 3, 
      code: 'FREESHIP', 
      discount: 'FREE Shipping', 
      description: 'Free delivery on orders above Rp 150.000', 
      validUntil: '2024-12-20', 
      minPurchase: 150000 
    },
  ];
  
  const usedVouchers = [
    { 
      id: 4, 
      code: 'SUMMER20', 
      discount: '20% OFF', 
      description: 'Used on 15 Nov 2024', 
      validUntil: '2024-11-30', 
      status: 'used' 
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      <div className="absolute inset-0 flex flex-col bg-white">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-700 font-bold text-xl">🎫</span>
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Vouchers</h2>
              <p className="text-sm text-gray-600">Available discounts and coupons</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <line x1="8" y1="8" x2="16" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="8" y1="16" x2="16" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('available')}
            className={`flex-1 py-4 text-center font-medium ${
              activeTab === 'available' 
                ? 'text-green-700 border-b-2 border-green-700' 
                : 'text-gray-500'
            }`}
          >
            Available ({availableVouchers.length})
          </button>
          <button
            onClick={() => setActiveTab('used')}
            className={`flex-1 py-4 text-center font-medium ${
              activeTab === 'used' 
                ? 'text-gray-700 border-b-2 border-gray-700' 
                : 'text-gray-500'
            }`}
          >
            Used ({usedVouchers.length})
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'available' ? (
            <div className="space-y-4">
              {availableVouchers.map(voucher => (
                <div key={voucher.id} className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl font-bold text-green-700">{voucher.discount}</span>
                        <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">
                          {voucher.code}
                        </span>
                      </div>
                      <p className="text-gray-800 font-medium">{voucher.description}</p>
                      <p className="text-sm text-gray-600 mt-2">
                        Min. purchase: Rp {voucher.minPurchase.toLocaleString('id-ID')}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Valid until: {voucher.validUntil}
                      </p>
                    </div>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(voucher.code);
                        alert(`Voucher code "${voucher.code}" copied to clipboard!`);
                      }}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 active:scale-95 transition-all"
                    >
                      Copy Code
                    </button>
                  </div>
                </div>
              ))}
              
              <div className="mt-6">
                <h3 className="font-bold text-gray-900 mb-3">Add Voucher Code</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter voucher code"
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-green-500"
                  />
                  <button className="bg-amber-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-amber-800 transition-colors active:scale-95">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {usedVouchers.map(voucher => (
                <div key={voucher.id} className="bg-gray-100 border border-gray-300 rounded-2xl p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl font-bold text-gray-500 line-through">{voucher.discount}</span>
                        <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-1 rounded-full">
                          {voucher.code}
                        </span>
                      </div>
                      <p className="text-gray-600">{voucher.description}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        {voucher.validUntil}
                      </p>
                    </div>
                    <span className="bg-gray-300 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                      Used
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 p-4 bg-white">
          <p className="text-xs text-gray-500 text-center">
            Vouchers are automatically applied at checkout
          </p>
        </div>
      </div>
    </div>
  );
};

const HomePage = () => {
  const [showChat, setShowChat] = useState(false);
  const [showVoucher, setShowVoucher] = useState(false);
  const [cartItems] = useState([]);
  const navigate = useNavigate();

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const categories = [
    { id: 'coffee', name: 'Coffee', icon: <CoffeeCategoryIcon /> },
    { id: 'tea', name: 'Tea', icon: <TeaCategoryIcon /> },
    { id: 'pastries', name: 'Pastries', icon: <PastriesCategoryIcon /> },
    { id: 'special', name: 'Special', icon: <CoffeeCategoryIcon /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pb-24">
      
      
      {/* Voucher Modal */}
      <VoucherModal isOpen={showVoucher} onClose={() => setShowVoucher(false)} />

          {/* Header */}
    <header className="px-6 pt-10 pb-6">
      <div className="flex justify-between items-center mb-8">
        <div className="text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-amber-900">Hello</h1>
          <p className="text-gray-600 mt-2">What would you like to order today?</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Voucher Icon */}
          <button 
            onClick={() => setShowVoucher(true)}
            className="p-2 hover:bg-amber-50 rounded-full transition-colors relative active:scale-95"
            title="Vouchers"
          >
            <VoucherIconHeader hasBadge={true} badgeCount={3} />
          </button>
          
          <button 
            onClick={() => navigate('/cart')}
            className="p-2 hover:bg-amber-50 rounded-full transition-colors relative active:scale-95"
            title="Cart"
          >
            <CartIconHeader count={totalCartItems} />
          </button>
          
          <button 
            onClick={() => navigate('/profile')}
            className="p-2 hover:bg-amber-50 rounded-full transition-colors active:scale-95"
            title="Profile"
          >
            <ProfileIconHeader />
          </button>
        </div>
      </div>
    </header>

      <main className="px-6">
        {/* Promo Banner */}
        <section className="mt-6">
          <div className="bg-gradient-to-r from-amber-700 to-amber-900 rounded-3xl p-6 text-white shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">Buy 1 Get 1 Free!</h2>
                <p className="text-amber-100">All caramel drinks • Valid until 11:59 PM</p>
              </div>
              <div className="bg-white/20 px-3 py-1 rounded-full">
                <span className="text-sm font-bold">HOT</span>
              </div>
            </div>
            <button 
              className="w-full bg-white text-amber-800 py-3.5 rounded-xl font-bold text-lg hover:bg-amber-50 active:scale-[0.98] transition-all duration-300"
              onClick={() => navigate('/menu?category=special')}
            >
              CLAIM NOW
            </button>
          </div>
        </section>

        {/* Categories - tanpa Quick Actions */}
        <section className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Categories</h2>
            <button 
              onClick={() => navigate('/menu')}
              className="text-amber-700 font-medium hover:text-amber-800 text-sm active:scale-95"
            >
              View All
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => navigate(`/menu?category=${category.id}`)}
                className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-all duration-300 border border-amber-100 hover:border-amber-300 active:scale-95"
              >
                <div className="mb-4">
                  {category.icon}
                </div>
                <span className="text-lg font-bold text-gray-900">{category.name}</span>
                <span className="text-sm text-gray-500 mt-1">Explore menu</span>
              </button>
            ))}
          </div>
        </section>

        {/* Featured Items Section DIHAPUS dari sini */}
        
      </main>

      {/* Bottom Navigation */}
      {!showChat && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl py-3 z-30">
          <div className="flex justify-center">
            <div className="flex justify-between w-full max-w-md px-6">
              <Link 
                to="/home" 
                className="flex flex-col items-center text-amber-700 flex-1 group active:scale-95"
              >
                <div className="group-hover:scale-110 transition-transform duration-200">
                  <HomeIcon active={true} />
                </div>
                <span className="text-xs font-bold mt-1">Home</span>
              </Link>
              
              <Link 
                to="/menu" 
                className="flex flex-col items-center text-gray-500 hover:text-amber-700 transition-colors flex-1 group active:scale-95"
              >
                <div className="group-hover:scale-110 transition-transform duration-200">
                  <CoffeeIcon />
                </div>
                <span className="text-xs font-medium mt-1">Menu</span>
              </Link>
              
              <Link 
                to="/cart" 
                className="flex flex-col items-center text-gray-500 hover:text-amber-700 transition-colors flex-1 group relative active:scale-95"
              >
                <div className="group-hover:scale-110 transition-transform duration-200">
                  <CartIcon active={false} count={totalCartItems} />
                </div>
                <span className="text-xs font-medium mt-1">Cart</span>
              </Link>
              
              <Link 
                to="/profile" 
                className="flex flex-col items-center text-gray-500 hover:text-amber-700 transition-colors flex-1 group active:scale-95"
              >
                <div className="group-hover:scale-110 transition-transform duration-200">
                  <ProfileIcon />
                </div>
                <span className="text-xs font-medium mt-1">Me</span>
              </Link>
            </div>
          </div>
        </nav>
      )}
    </div>
  );
};

export default HomePage;