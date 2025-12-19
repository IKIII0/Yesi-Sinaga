import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { orderService } from '../utils/orderService';

// Fungsi format Rupiah
const formatRupiah = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Komponen CheckoutPage
const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [deliveryTip, setDeliveryTip] = useState(null);
  const [platformFee] = useState(3000); // Rp 3.000
  const [cartItems, setCartItems] = useState([]);
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');

  // Initialize cart items from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        setCartItems([]);
      }
    }
  }, []);

  // Ambil data dari location state (dari CartPage jika ada)
  const stateData = location.state || {};
  
  // Prioritaskan data dari state CartPage, lalu dari localStorage
  const stateCartItems = stateData.cartItems || [];
  const stateAppliedPromo = stateData.appliedPromo || null;
  
  // Gunakan cart items dari state CartPage jika ada, jika tidak dari localStorage
  const currentCartItems = stateCartItems.length > 0 ? stateCartItems : cartItems;
  
  // Hitung subtotal dari cart items
  const subtotal = currentCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const tax = subtotal * 0.11; 
  const deliveryFee = subtotal > 0 ? 10000 : 0;
  
  // Hitung promo discount
  let promoDiscount = 0;
  if (stateAppliedPromo) {
    if (stateAppliedPromo.discountType === "percentage") {
      const discount = (subtotal * stateAppliedPromo.discountValue) / 100;
      promoDiscount = Math.min(discount, stateAppliedPromo.maxDiscount || discount);
    } else if (stateAppliedPromo.discountType === "fixed") {
      promoDiscount = stateAppliedPromo.discountValue;
    } else if (stateAppliedPromo.discountType === "delivery") {
      promoDiscount = deliveryFee; // Free delivery discount
    }
  }
  
  // Hitung total akhir dengan tips
  const tipsAmount = deliveryTip || 0;
  const finalTotal = Math.max(0, subtotal + tax + deliveryFee + platformFee + tipsAmount - promoDiscount);

  // Fungsi untuk handle place order (panggil backend)
  const handlePlaceOrder = async () => {
    try {
      const payload = {
        shipping_address: shippingAddress || null,
        payment_method: paymentMethod || null,
      };

      const result = await orderService.createOrder(payload);

      if (!result.success || !result.data?.order?.id) {
        alert(result.message || 'Failed to create order');
        return null;
      }

      const orderId = result.data.order.id;

      // Kosongkan cart di localStorage (cart di DB sudah dikosongkan oleh backend)
      localStorage.setItem('cartItems', JSON.stringify([]));

      return { orderId };
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Terjadi kesalahan saat membuat order');
      return null;
    }
  };

  // Empty cart handling
  if (currentCartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pb-24">
        <header className="px-6 pt-10 pb-6 bg-white/80 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="text-gray-500">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="9" stroke="#9CA3AF" strokeWidth="1.5" fill="none"/>
                <path d="M15 18L9 12L15 6" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-amber-900">Checkout</h1>
              <p className="text-gray-600 mt-1">Keranjang Anda kosong</p>
            </div>
          </div>
        </header>
        
        <main className="px-6 mt-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
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
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Tidak ada item untuk checkout</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Tambahkan beberapa minuman atau makanan ke keranjang terlebih dahulu.
            </p>
            <Link 
              to="/menu" 
              className="inline-block bg-amber-700 text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-amber-800 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Lihat Menu
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Tips options dalam Rupiah
  const tipOptions = [5000, 10000, 15000];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pb-24">
      {/* Header */}
      <header className="px-6 pt-10 pb-6 bg-white/80 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-gray-500">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="9" stroke="#9CA3AF" strokeWidth="1.5" fill="none"/>
              <path d="M15 18L9 12L15 6" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <div className="text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-amber-900">Checkout</h1>
            <p className="text-gray-600 mt-1">Review your order before payment</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 mt-6">
        {/* Order Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-amber-100 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
          
          {/* Cart Items */}
          <div className="space-y-4 mb-6">
            {currentCartItems.map((item) => (
              <div key={item.id || item.product_id} className="flex justify-between items-center pb-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-gray-500 text-sm">Qty: {item.quantity} × {formatRupiah(item.price)}</p>
                    {item.description && (
                      <p className="text-gray-500 text-xs mt-1">{item.description}</p>
                    )}
                  </div>
                </div>
                <span className="font-bold text-amber-800">
                  {formatRupiah(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Bill Details */}
          <div className="space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Total Item</span>
              <span>{formatRupiah(subtotal)}</span>
            </div>
            
            <div className="flex justify-between text-gray-600">
              <span>Tax (11%)</span>
              <span>{formatRupiah(tax)}</span>
            </div>
            
            {promoDiscount > 0 && (
              <div className="flex justify-between text-green-600">
                <div className="flex items-center gap-2">
                  <span>Discount {stateAppliedPromo?.code ? `(${stateAppliedPromo.code})` : ''}</span>
                </div>
                <span>-{formatRupiah(promoDiscount)}</span>
              </div>
            )}
            
            <div className="flex justify-between text-gray-600">
              <span>Delivery Cost</span>
              <span>{formatRupiah(deliveryFee)}</span>
            </div>
            
            {/* Delivery Tip Section */}
            <div className="pt-3 border-t border-gray-200">
              <h3 className="font-medium text-gray-900 mb-3">Give tips for drivers</h3>
              <p className="text-gray-500 text-sm mb-4">
                Appreciate your driver by leaving a tip. 100% of the tip goes to the driver.
              </p>
              <div className="flex gap-3 mb-3">
                {tipOptions.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setDeliveryTip(amount)}
                    className={`flex-1 py-3 rounded-xl text-center font-medium transition-all ${
                      deliveryTip === amount
                        ? 'bg-amber-700 text-white'
                        : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                    }`}
                  >
                    {formatRupiah(amount)}
                  </button>
                ))}
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setDeliveryTip(null)}
                  className={`flex-1 py-3 rounded-xl text-center font-medium transition-all ${
                    deliveryTip === null
                      ? 'bg-gray-100 text-gray-700 border-2 border-gray-300'
                      : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  None
                </button>
                <button
                  onClick={() => {
                    const customAmount = parseFloat(prompt("Masukkan jumlah tips (Rupiah):"));
                    if (!isNaN(customAmount) && customAmount > 0) {
                      setDeliveryTip(customAmount);
                    }
                  }}
                  className="flex-1 py-3 rounded-xl text-center font-medium bg-white text-amber-700 border border-amber-300 hover:bg-amber-50"
                >
                  Custom
                </button>
              </div>
            </div>
            
            <div className="flex justify-between text-gray-600 pt-3 border-t border-gray-200">
              <span>Platform Cost</span>
              <span>{formatRupiah(platformFee)}</span>
            </div>
            
            {/* Total */}
            <div className="pt-4 border-t border-gray-200 mt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-amber-800">{formatRupiah(finalTotal)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery & Payment */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-amber-100 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Delivery & Payment</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Address
            </label>
            <textarea
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
              placeholder="Masukkan alamat pengantaran (opsional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm bg-white"
            >
              <option value="cash">Cash on Delivery</option>
              <option value="transfer">Bank Transfer</option>
            </select>
          </div>
        </div>

        {/* Offers & Benefits */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-amber-100 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Promotions & Benefits</h2>
          
          <div className="space-y-3">
            {/* Steal Deal Banner */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="bg-red-600 text-white px-3 py-1 rounded-lg font-bold">
                    STEALDEAL
                  </span>
                  <span className="font-bold text-red-700">Apply</span>
                </div>
                <span className="text-lg font-bold text-red-700">Save Rp. 100,000</span>
              </div>
              <p className="text-gray-600 text-sm">
                Save an additional Rp. 100,000 on this order
              </p>
            </div>
            
            <button 
              className="w-full text-amber-700 font-medium hover:text-amber-800 flex items-center justify-center gap-2 py-3"
              onClick={() => navigate('/cart')}
            >
              See other promotions
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="6" cy="6" r="5" stroke="#92400E" strokeWidth="1" fill="none"/>
                <path d="M5 4L7 6L5 8" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Note Section */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 mb-6">
          <h3 className="font-bold text-gray-900 mb-2">Note</h3>
          <p className="text-gray-700 text-sm mb-3">
            Review order and address details to avoid cancellation.
          </p>
          <p className="text-gray-600 text-xs">
            Note: If you cancel within 60 seconds of ordering, a 100% refund will be issued. No refunds will be issued for cancellations made after 60 seconds.
          </p>
        </div>

        {/* Place Order Button */}
        <div className="sticky bottom-20 bg-white/80 backdrop-blur-sm py-4 border-t border-gray-200 -mx-6 px-6">
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="text-gray-600 text-sm">Total</p>
              <p className="text-2xl font-bold text-amber-800">{formatRupiah(finalTotal)}</p>
            </div>
            <button
              onClick={async () => {
                const result = await handlePlaceOrder();
                if (!result?.orderId) return;

                navigate('/order-success', {
                  state: {
                    orderId: result.orderId,
                    fromCheckout: true,
                  },
                });
              }}
              className="bg-gradient-to-r from-amber-700 to-amber-900 text-white py-3 px-8 rounded-2xl font-bold hover:shadow-2xl active:scale-[0.98] transition-all duration-300 inline-block"
            >
              Checkout
            </button>
          </div>
          <p className="text-center text-gray-500 text-xs">
            By placing this order, you agree to our Terms & Conditions
          </p>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl py-3">
        <div className="flex justify-center">
          <div className="flex justify-between w-full max-w-md px-6">
            <Link to="/" className="flex flex-col items-center text-gray-500 hover:text-amber-700 transition-colors flex-1 group">
              <div className="group-hover:scale-110 transition-transform duration-200">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="9" stroke="#9CA3AF" strokeWidth="1.5" fill="none" />
                  <path d="M9 17H15" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M12 9V13" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M9 13H15" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-xs font-medium mt-1">Home</span>
            </Link>
            
            <Link to="/menu" className="flex flex-col items-center text-gray-500 hover:text-amber-700 transition-colors flex-1 group">
              <div className="group-hover:scale-110 transition-transform duration-200">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="9" stroke="#9CA3AF" strokeWidth="1.5" fill="none" />
                  <path d="M8 12H16" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
                  <path d="M10 8V12H14V8" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
                  <path d="M8 16H16" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-xs font-medium mt-1">Menu</span>
            </Link>
            
            <Link to="/cart" className="flex flex-col items-center text-amber-700 flex-1 group">
              <div className="group-hover:scale-110 transition-transform duration-200 relative">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="9" stroke="#92400E" strokeWidth="1.5" fill="none" />
                  <path d="M8 16H16" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M10 10V12" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M14 10V12" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M7.5 16L8.5 10H15.5L16.5 16H7.5Z" 
                        stroke="#92400E" 
                        strokeWidth="1.5" 
                        fill="none" 
                        strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-xs font-bold mt-1">Cart</span>
            </Link>
            
            <Link to="/profile" className="flex flex-col items-center text-gray-500 hover:text-amber-700 transition-colors flex-1 group">
              <div className="group-hover:scale-110 transition-transform duration-200">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="9" stroke="#9CA3AF" strokeWidth="1.5" fill="none" />
                  <circle cx="12" cy="9" r="3" stroke="#9CA3AF" strokeWidth="1.5" fill="none" />
                  <path d="M6 20C6 16 9 13 12 13C15 13 18 16 18 20" 
                        stroke="#9CA3AF" 
                        strokeWidth="1.5" 
                        strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-xs font-medium mt-1">Me</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default CheckoutPage;