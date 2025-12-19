// src/components/BottomNav.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, CoffeeIcon, CartIcon, ProfileIcon } from './Icons';

// Tambahkan ChatIcon ke dalam icons.js atau langsung di sini:
const ChatIcon = ({ active = false, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke={active ? "#92400E" : "#9CA3AF"} strokeWidth="1.5" fill="none" />
    <path d="M8 10H16" stroke={active ? "#92400E" : "#9CA3AF"} strokeWidth="2" strokeLinecap="round" />
    <path d="M8 14H12" stroke={active ? "#92400E" : "#9CA3AF"} strokeWidth="2" strokeLinecap="round" />
    <path d="M8 18H14" stroke={active ? "#92400E" : "#9CA3AF"} strokeWidth="2" strokeLinecap="round" />
    <circle cx="18" cy="6" r="1.5" fill={active ? "#92400E" : "#9CA3AF"} />
  </svg>
);

const BottomNav = ({ cartCount = 0, openChat }) => {
  const location = useLocation();
  
  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: (active) => <HomeIcon active={active} size={24} />,
      path: '/home',
      activePaths: ['/', '/home']
    },
    {
      id: 'menu',
      label: 'Menu',
      icon: (active) => <CoffeeIcon active={active} size={24} />,
      path: '/menu',
      activePaths: ['/menu']
    },
    {
      id: 'cart',
      label: 'Cart',
      icon: (active) => <CartIcon active={active} size={24} count={cartCount} />,
      path: '/cart',
      activePaths: ['/cart']
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: (active) => <ProfileIcon active={active} size={24} />,
      path: '/profile',
      activePaths: ['/profile']
    }
  ];

  const isActive = (item) => {
    return item.activePaths.includes(location.pathname);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-hard py-1 px-3 md:px-6 z-50 safe-bottom">
      <div className="flex justify-between max-w-4xl mx-auto">
        {navItems.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.id}
              to={item.path}
              className="flex flex-col items-center p-2 relative flex-1 group"
            >
              {/* Icon */}
              <div className={`transition-normal ${active ? 'text-amber-800 scale-110' : 'text-gray-400 group-hover:text-amber-600'}`}>
                {item.icon(active)}
              </div>
              
              {/* Label */}
              <span className={`text-xs mt-1 transition-normal ${active ? 'text-amber-800 font-bold' : 'text-gray-500 group-hover:text-amber-700'}`}>
                {item.label}
              </span>
              
              {/* Active indicator */}
              {active && (
                <div className="absolute -top-1 w-1.5 h-1.5 bg-amber-700 rounded-full animate-pulse"></div>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;