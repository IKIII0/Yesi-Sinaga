import React, { useState, useEffect } from 'react'; // JANGAN LUPA IMPORT useEffect
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { cartApiService } from '../utils/orderService';

// Fungsi format Rupiah
const formatRupiah = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Ikon SVG (tetap sama)
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
    
    {count > 0 && (
      <>
        <circle 
          cx="18" 
          cy="6" 
          r="6" 
          fill="#EF4444" 
          stroke="white" 
          strokeWidth="1.5"
        />
        <text 
          x="18" 
          y="8.5" 
          textAnchor="middle" 
          fill="white" 
          fontSize="7" 
          fontWeight="bold"
          fontFamily="Arial, sans-serif"
        >
          {count > 9 ? "9+" : count}
        </text>
      </>
    )}
  </svg>
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

const CartPage = () => {
  const navigate = useNavigate();
  
  // Initialize cart items from localStorage (fallback)
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cartItems');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  });
  
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoCode, setPromoCode] = useState('');
  const [showPromoModal, setShowPromoModal] = useState(false);

  // Load cart from backend if user is logged in
  useEffect(() => {
    const loadBackendCart = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      const result = await cartApiService.getCart();
      if (result.success && result.data?.items) {
        setCartItems(result.data.items);
      }
    };

    loadBackendCart();
  }, []);

  // Sync cartItems to localStorage for offline/fallback usage
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Available promos (dalam Rupiah)
  const availablePromos = [
    {
      id: 1,
      code: "STEALDEAL",
      name: "STEALDEAL",
      description: "Save Rp 110.000 on this order!",
      details: "Use code STEALDEAL & GET 60% OFF on orders above Rp 175.000. Maximum discount: Rp 110.000",
      discountType: "percentage",
      discountValue: 60,
      minOrder: 175000,
      maxDiscount: 110000
    },
    {
      id: 2,
      code: "CAFFINITY10",
      name: "CAFFINITY10",
      description: "Get 10% off your order",
      details: "Get 10% discount on all orders. No minimum purchase required.",
      discountType: "percentage",
      discountValue: 10,
      minOrder: 0,
      maxDiscount: 50000
    },
    {
      id: 3,
      code: "FREESHIP",
      name: "FREESHIP",
      description: "Free delivery on your order",
      details: "Free delivery for orders above Rp 50.000",
      discountType: "delivery",
      discountValue: 100,
      minOrder: 50000,
      maxDiscount: 20000
    }
  ];

  // Fungsi untuk update quantity - HANYA SATU DEKLARASI
  const updateQuantity = async (productId, newQuantity) => {
    const targetItem = cartItems.find(
      (item) => (item.product_id || item.id) === productId
    );

    if (!targetItem) return;

    if (newQuantity === 0) {
      await removeItem(productId);
      return;
    }

    try {
      if (targetItem.id) {
        const result = await cartApiService.updateCartItem(targetItem.id, {
          quantity: newQuantity,
        });
        if (result.success && result.data) {
          setCartItems((prev) =>
            prev.map((item) =>
              item.id === targetItem.id
                ? { ...item, quantity: result.data.quantity }
                : item
            )
          );
          return;
        }
      }
    } catch (error) {
      console.error('Failed to update cart item in backend, falling back to local update');
    }

    setCartItems((prev) =>
      prev.map((item) =>
        (item.product_id || item.id) === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Remove item from cart
  const removeItem = async (productId) => {
    const targetItem = cartItems.find(
      (item) => (item.product_id || item.id) === productId
    );

    try {
      if (targetItem?.id) {
        await cartApiService.removeFromCart(targetItem.id);
      }
    } catch (error) {
      console.error('Failed to remove item from backend cart, continuing with local removal');
    }

    setCartItems((prev) =>
      prev.filter((item) => (item.product_id || item.id) !== productId)
    );
  };

  // Clear all items
  const clearAllItems = async () => {
    try {
      const result = await Swal.fire({
        title: 'Clear cart',
        text: 'Are you sure you want to clear all items from your cart?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, clear',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#DC2626',
        cancelButtonColor: '#6B7280',
      });

      if (!result.isConfirmed) return;

      try {
        await cartApiService.clearCart();
      } catch (error) {
        console.error('Failed to clear backend cart, clearing local cart only');
      }

      setCartItems([]);

      await Swal.fire({
        icon: 'success',
        title: 'Cleared',
        text: 'Your cart has been cleared.',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('Error during clearAllItems confirmation:', error);
    }
  };

  // Apply promo code
  const applyPromoCode = (code) => {
    const promo = availablePromos.find(p => p.code === code);
    
    if (!promo) {
      alert("Kode promo tidak valid!");
      return;
    }

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (subtotal < promo.minOrder) {
      alert(`Minimum pembelian ${formatRupiah(promo.minOrder)} untuk promo ini.`);
      return;
    }

    setAppliedPromo(promo);
    setShowPromoModal(false);
  };

  // Remove promo
  const removePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.11; 
  const deliveryFee = subtotal > 0 ? 10000 : 0;
  
  // Calculate promo discount
  let promoDiscount = 0;
  let deliveryDiscount = 0;
  
  if (appliedPromo) {
    if (appliedPromo.discountType === "percentage") {
      const discount = (subtotal * appliedPromo.discountValue) / 100;
      promoDiscount = Math.min(discount, appliedPromo.maxDiscount || discount);
    } else if (appliedPromo.discountType === "fixed") {
      promoDiscount = appliedPromo.discountValue;
    } else if (appliedPromo.discountType === "delivery") {
      deliveryDiscount = deliveryFee; // Free delivery
    }
  }
  
  const total = Math.max(0, subtotal + tax + deliveryFee - promoDiscount - deliveryDiscount);
  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Promo Modal Component
  const PromoModal = () => {
    if (!showPromoModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-sm max-h-[70vh] overflow-hidden mb-16">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">DISCOUNT</h2>
              <button 
                onClick={() => setShowPromoModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <path d="M8 8L16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M8 16L16 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <div className="mt-2">
              <div className="text-2xl md:text-3xl font-bold text-amber-900">
                Order Total {formatRupiah(subtotal)}
              </div>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[60vh] p-4">
            <div className="mb-6">
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Enter Promo Code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-amber-200 focus:outline-none focus:border-amber-500"
                />
                <button 
                  onClick={() => applyPromoCode(promoCode)}
                  className="bg-amber-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-amber-800 transition-colors whitespace-nowrap"
                >
                  APPLY
                </button>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-6 bg-amber-500 rounded-full"></div>
                <h3 className="font-bold text-gray-900">Promo for You</h3>
              </div>
              
              {availablePromos.map((promo) => (
                <div key={promo.id} className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl p-4 mb-3 border-2 border-amber-300">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-red-600 font-bold text-lg">
                          {promo.discountType === "percentage" ? `${promo.discountValue}% OFF` : 
                           promo.discountType === "delivery" ? "FREE SHIPPING" : 
                           `${formatRupiah(promo.discountValue)} OFF`}
                        </span>
                        <span className="bg-white text-amber-700 px-2 py-1 rounded text-xs font-bold">
                          {promo.name}
                        </span>
                      </div>
                      <h4 className="font-bold text-gray-900">{promo.description}</h4>
                    </div>
                    {promo.id === 1 && (
                      <span className="bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
                        BEST
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3">{promo.details}</p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      Min. purchase: {formatRupiah(promo.minOrder)}
                    </span>
                    <button
                      onClick={() => {
                        setPromoCode(promo.code);
                        applyPromoCode(promo.code);
                      }}
                      className="bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-800 transition-colors"
                    >
                      APPLY
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pb-24">
        {/* Header */}
        <header className="px-6 pt-10 pb-6">
          <div className="text-left">
            <h1 className="text-3xl font-bold text-amber-900">Your Cart</h1>
            <p className="text-gray-600 mt-2">Your favorite drinks and foods</p>
          </div>
        </header>

        {/* Empty Cart */}
        <div className="px-6 mt-8">
          <div className="bg-white rounded-3xl p-8 shadow-lg text-center">
            <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="24" cy="24" r="22" stroke="#92400E" strokeWidth="1.5" fill="none" />
                <circle cx="18" cy="18" r="4" stroke="#92400E" strokeWidth="1.5" fill="none" />
                <circle cx="30" cy="18" r="4" stroke="#92400E" strokeWidth="1.5" fill="none" />
                <path d="M12 36L18 18" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M36 36L30 18" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M12 36H36" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              It looks like you haven't added any drinks or food to your cart.
            </p>
            <Link 
              to="/menu" 
              className="inline-block bg-amber-700 text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-amber-800 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              See Menu
            </Link>
          </div>
        </div>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl py-3">
          <div className="flex justify-center">
            <div className="flex justify-between w-full max-w-md px-6">
              <Link to="/" className="flex flex-col items-center text-gray-500 hover:text-amber-700 transition-colors flex-1 group">
                <div className="group-hover:scale-110 transition-transform duration-200">
                  <HomeIcon />
                </div>
                <span className="text-xs font-medium mt-1">Home</span>
              </Link>
              
              <Link to="/menu" className="flex flex-col items-center text-gray-500 hover:text-amber-700 transition-colors flex-1 group">
                <div className="group-hover:scale-110 transition-transform duration-200">
                  <CoffeeIcon />
                </div>
                <span className="text-xs font-medium mt-1">Menu</span>
              </Link>
              
              <Link to="/cart" className="flex flex-col items-center text-amber-700 flex-1 group">
                <div className="group-hover:scale-110 transition-transform duration-200">
                  <CartIcon active={true} count={0} />
                </div>
                <span className="text-xs font-bold mt-1">Cart</span>
              </Link>
              
              <Link to="/profile" className="flex flex-col items-center text-gray-500 hover:text-amber-700 transition-colors flex-1 group">
                <div className="group-hover:scale-110 transition-transform duration-200">
                  <ProfileIcon />
                </div>
                <span className="text-xs font-medium mt-1">Me</span>
              </Link>
            </div>
          </div>
        </nav>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pb-24">
      {/* Promo Modal */}
      <PromoModal />

      {/* Header - JUDUL RATA KIRI dengan warna yang sama */}
      <header className="px-6 pt-10 pb-6 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <div className="text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-amber-900">Cart</h1>
            <p className="text-gray-600 mt-2">{cartItems.length} item • {formatRupiah(total)} total</p>
          </div>
          <button 
            onClick={clearAllItems}
            className="text-red-600 text-sm font-medium hover:text-red-700 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
          >
            Delete All
          </button>
        </div>
      </header>

      {/* Cart Items */}
      <section className="px-6 mt-4">
        <div className="space-y-4">
          {cartItems.map(item => (
            <div key={item.id} className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-amber-100">
              <div className="flex gap-4">
                {/* Product Image */}
                <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-1 right-1 bg-amber-700 text-white text-xs px-2 py-0.5 rounded-full">
                    {item.category || 'Product'}
                  </span>
                </div>

                {/* Product Details */}
                <div className="flex-1 text-left">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900">{item.name}</h3>
                      <p className="text-gray-600 text-sm mt-1">{item.description || ''}</p>
                      <p className="text-amber-800 font-bold text-lg mt-2">{formatRupiah(item.price)}</p>
                    </div>
                    <button 
                      onClick={() => removeItem(item.product_id || item.id)}
                      className="text-gray-400 hover:text-red-500 p-2 transition-colors"
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
                        <line x1="6" y1="6" x2="14" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <line x1="6" y1="14" x2="14" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => updateQuantity(item.product_id || item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center hover:bg-amber-200 transition-colors"
                      >
                        <span className="text-lg font-bold">-</span>
                      </button>
                      <span className="font-bold text-gray-900 min-w-[40px] text-center">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.product_id || item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center hover:bg-amber-200 transition-colors"
                      >
                        <span className="text-lg font-bold">+</span>
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Subtotal</p>
                      <p className="text-xl font-bold text-amber-800">
                        {formatRupiah(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Order Summary */}
      <section className="px-6 mt-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-amber-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{formatRupiah(subtotal)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium">{formatRupiah(tax)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Cost</span>
              <span className="font-medium">{formatRupiah(deliveryFee)}</span>
            </div>
            
            {/* Promo Discount */}
            {appliedPromo && (
              <>
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <div className="flex items-center gap-2">
                      <span>Discount ({appliedPromo.code})</span>
                      <button 
                        onClick={removePromo}
                        className="text-red-500 hover:text-red-700 text-xs"
                      >
                        Delete
                      </button>
                    </div>
                    <span className="font-medium">-{formatRupiah(promoDiscount)}</span>
                  </div>
                )}
                
                {deliveryDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <div className="flex items-center gap-2">
                      <span>Free  ({appliedPromo.code})</span>
                      <button 
                        onClick={removePromo}
                        className="text-red-500 hover:text-red-700 text-xs"
                      >
                        Delete
                      </button>
                    </div>
                    <span className="font-medium">-{formatRupiah(deliveryDiscount)}</span>
                  </div>
                )}
              </>
            )}
            
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <p className="text-gray-500 text-sm">Including all taxes and fees</p>
                </div>
                <span className="text-2xl font-bold text-amber-800">{formatRupiah(total)}</span>
              </div>
            </div>
          </div>

          {/* Promo Code Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Promo Code</h3>
              <button 
                onClick={() => setShowPromoModal(true)}
                className="text-amber-700 font-medium hover:text-amber-800 flex items-center gap-1"
              >
                See All
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="6" cy="6" r="5" stroke="#92400E" strokeWidth="1" fill="none"/>
                  <path d="M5 4L7 6L5 8" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Promo Code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                className="flex-1 px-4 py-3 rounded-xl border-2 border-amber-200 focus:outline-none focus:border-amber-500"
              />
              <button 
                onClick={() => {
                  if (promoCode) {
                    applyPromoCode(promoCode);
                  } else {
                    setShowPromoModal(true);
                  }
                }}
                className="bg-amber-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-amber-800 transition-colors whitespace-nowrap"
              >
                {promoCode ? "APPLY" : "Details Promo"}
              </button>
            </div>
            
            {/* Applied Promo Display */}
            {appliedPromo && (
              <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-green-700">{appliedPromo.code}</span>
                      <span className="text-sm text-green-600">Terpasang</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{appliedPromo.description}</p>
                  </div>
                  <button 
                    onClick={removePromo}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Checkout Button */}
          <button
            onClick={() => {
              const orderData = {
                items: cartItems.map(item => ({
                  product_id: item.product_id || item.id,
                  quantity: item.quantity,
                  price: item.price,
                  name: item.name,
                  image_url: item.image
                })),
                subtotal,
                tax,
                deliveryFee,
                promoDiscount,
                deliveryDiscount,
                total,
                appliedPromo
              };
              
              navigate('/checkout', { state: orderData });
            }}
            className="mt-8 w-full bg-gradient-to-r from-amber-700 to-amber-900 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-2xl active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3"
          >
            <span>Continue Payment</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="9" stroke="white" strokeWidth="1.5" fill="none" />
              <path d="M8 6L12 10L8 14" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          <p className="text-center text-gray-500 text-sm mt-4">
            Free shipping for orders above {formatRupiah(150000)}
          </p>
        </div>
      </section>

      {/* Continue Shopping */}
      <section className="px-6 mt-6 mb-8">
        <Link 
          to="/menu" 
          className="block w-full border-2 border-amber-700 text-amber-700 py-3.5 rounded-2xl font-bold text-center hover:bg-amber-50 transition-colors duration-300"
        >
          + Continue Shopping
        </Link>
      </section>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl py-3">
        <div className="flex justify-center">
          <div className="flex justify-between w-full max-w-md px-6">
            <Link 
              to="/" 
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
              className="flex flex-col items-center text-amber-700 flex-1 group"
            >
              <div className="group-hover:scale-110 transition-transform duration-200">
                <CartIcon active={true} count={totalCartItems} />
              </div>
              <span className="text-xs font-bold mt-1">Cart</span>
            </Link>
            
            <Link 
              to="/profile" 
              className="flex flex-col items-center text-gray-500 hover:text-amber-700 transition-colors flex-1 group"
            >
              <div className="group-hover:scale-110 transition-transform duration-200">
                <ProfileIcon />
              </div>
              <span className="text-xs font-medium mt-1">Me</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default CartPage;