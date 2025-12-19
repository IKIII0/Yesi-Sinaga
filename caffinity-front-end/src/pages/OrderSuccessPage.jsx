import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { orderService } from '../utils/orderService';

const OrderSuccessPage = () => {
  const location = useLocation();
  const [orderData, setOrderData] = useState(null);
  
  // Helper function to format IDR
  const formatRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Ambil data pesanan dari backend jika ada orderId, jika tidak fallback ke localStorage
  useEffect(() => {
    const loadOrder = async () => {
      console.log('Location state:', location.state); // Debug log

      const backendOrderId = location.state?.orderId;

      if (backendOrderId) {
        try {
          const result = await orderService.getOrderById(backendOrderId);
          if (result.success && result.data?.order && Array.isArray(result.data.items)) {
            const { order, items } = result.data;

            const subtotal = items.reduce(
              (sum, item) => sum + Number(item.product_price || 0) * Number(item.quantity || 0),
              0
            );
            const tax = subtotal * 0.11;
            const deliveryFee = subtotal > 0 ? 10000 : 0;
            const platformFee = 3000;
            const tips = 0;
            const promoDiscount = 0;
            const total = subtotal + tax + deliveryFee + platformFee + tips - promoDiscount;

            const backendOrderData = {
              orderNumber: `ORD-${order.id}`,
              cartItems: items.map((it) => ({
                id: it.product_id,
                name: it.product_name,
                price: Number(it.product_price),
                quantity: it.quantity,
                image: null,
              })),
              orderSummary: {
                subtotal,
                tax,
                deliveryFee,
                platformFee,
                tips,
                promoDiscount,
                total,
              },
              estimatedDelivery: '25-40 minutes',
              deliveryDate: new Date(order.created_at).toLocaleDateString('id-ID', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }),
            };

            processOrderData(backendOrderData);
            return;
          }
        } catch (error) {
          console.error('Error loading order from backend:', error);
          // Jika gagal, lanjutkan ke fallback localStorage
        }
      }

      // Fallback ke mekanisme lama (state/localStorage/cartItems)
      const stateOrderData = location.state?.orderData;
      const storedOrderData = localStorage.getItem('currentOrder');
      const lastCartItems = localStorage.getItem('cartItems');

      if (stateOrderData && stateOrderData.cartItems && stateOrderData.cartItems.length > 0) {
        console.log('Using stateOrderData:', stateOrderData); // Debug log
        processOrderData(stateOrderData);
      } else if (storedOrderData) {
        try {
          const parsedData = JSON.parse(storedOrderData);
          console.log('Using storedOrderData:', parsedData); // Debug log
          if (parsedData.cartItems && parsedData.cartItems.length > 0) {
            processOrderData(parsedData);
          } else {
            console.log('Stored order has empty cartItems');
            checkLastCartItems(lastCartItems);
          }
        } catch (error) {
          console.error('Error parsing stored order data:', error);
          checkLastCartItems(lastCartItems);
        }
      } else {
        checkLastCartItems(lastCartItems);
      }
    };

    loadOrder();
  }, [location]);

  // Fungsi untuk check cartItems terakhir
  const checkLastCartItems = (lastCartItems) => {
    if (lastCartItems) {
      try {
        const cartItems = JSON.parse(lastCartItems);
        console.log('Last cart items:', cartItems); // Debug log
        if (cartItems && cartItems.length > 0) {
          // Buat order data dari cart items terakhir
          const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          const tax = subtotal * 0.1;
          const deliveryFee = 10000;
          const platformFee = 3000;
          const total = subtotal + tax + deliveryFee + platformFee;
          
          const orderDataFromCart = {
            orderNumber: `ORD-${Date.now().toString().slice(-8)}`,
            cartItems: cartItems,
            orderSummary: {
              subtotal: subtotal,
              tax: tax,
              deliveryFee: deliveryFee,
              platformFee: platformFee,
              tips: 0,
              promoDiscount: 0,
              total: total
            },
            estimatedDelivery: "25-40 minutes",
            deliveryDate: new Date().toLocaleDateString('id-ID', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          };
          
          processOrderData(orderDataFromCart);
          return;
        }
      } catch (error) {
        console.error('Error parsing last cart items:', error);
      }
    }
    
    // Jika semua gagal, load data default
    loadDefaultOrderData();
  };

  // Fungsi untuk memproses data pesanan
  const processOrderData = (orderData) => {
    console.log('Processing order data:', orderData); // Debug log
    
    const finalOrderData = {
      ...orderData,
      orderNumber: orderData.orderNumber || `ORD-${Date.now().toString().slice(-8)}`,
      estimatedDelivery: orderData.estimatedDelivery || "25-40 minutes",
      deliveryDate: orderData.deliveryDate || new Date().toLocaleDateString('id-ID', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    
    setOrderData(finalOrderData);
    
    // Simpan ke order history
    saveOrderToHistory(finalOrderData);
    
    // Hapus data sementara
    localStorage.removeItem('currentOrder');
    localStorage.removeItem('cartItems'); // Kosongkan cart setelah order sukses
  };

  // Fungsi untuk load data default
  const loadDefaultOrderData = () => {
    console.log('Loading default order data'); // Debug log
    
    const params = new URLSearchParams(location.search);
    const orderNumber = params.get('orderNumber') || `ORD-${Date.now().toString().slice(-8)}`;
    
    const defaultOrderData = {
      orderNumber: orderNumber,
      cartItems: [
        {
          id: 1,
          name: "Caramel Macchiato",
          price: 35000,
          quantity: 2,
          image: "https://dinnerthendessert.com/wp-content/uploads/2023/10/Caramel-Macchiato-7-500x500.jpg"
        },
        {
          id: 2,
          name: "Chocolate Croissant",
          price: 22000,
          quantity: 1,
          image: "https://sallysbakingaddiction.com/wp-content/uploads/2018/03/chocolate-croissants-2.jpg"
        }
      ],
      orderSummary: {
        subtotal: 92000,
        tax: 9200,
        deliveryFee: 10000,
        platformFee: 3000,
        tips: 0,
        promoDiscount: 0,
        total: 115200
      },
      estimatedDelivery: "25-40 minutes",
      deliveryDate: new Date().toLocaleDateString('id-ID', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    
    setOrderData(defaultOrderData);
    saveOrderToHistory(defaultOrderData);
  };

  // Fungsi untuk menyimpan pesanan ke history
  const saveOrderToHistory = (orderData) => {
    try {
      const orderHistory = JSON.parse(localStorage.getItem('coffee_shop_order_history')) || [];
      
      const newOrder = {
        id: Date.now(),
        orderNumber: orderData.orderNumber,
        items: orderData.cartItems?.map(item => item.name) || ["Order completed"],
        itemsDetailed: orderData.cartItems || [],
        total: orderData.orderSummary?.total || 0,
        orderSummary: orderData.orderSummary,
        date: orderData.deliveryDate,
        status: 'Completed',
        statusColor: 'bg-green-100 text-green-800'
      };
      
      orderHistory.unshift(newOrder);
      localStorage.setItem('coffee_shop_order_history', JSON.stringify(orderHistory));
      
      console.log('Order saved to history:', newOrder);
    } catch (error) {
      console.error('Error saving order to history:', error);
    }
  };

  // Jika belum ada data, tampilkan loading
  if (!orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pb-24 flex flex-col items-center justify-center px-6">
      {/* Success Animation/Icon */}
      <div className="mb-8">
        <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 relative">
          <svg 
            className="w-24 h-24 text-green-600" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="12" fill="#10B981" fillOpacity="0.2"/>
            <circle cx="12" cy="12" r="9" stroke="#10B981" strokeWidth="2" fill="none"/>
            <path 
              d="M7 12L10.5 15.5L17 9" 
              stroke="#10B981" 
              strokeWidth="2" 
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: 24,
                strokeDashoffset: 24,
                animation: 'draw 0.5s ease-in-out forwards 0.3s'
              }}
            />
          </svg>
          
          <style>{`
            @keyframes draw {
              to { stroke-dashoffset: 0; }
            }
          `}</style>
        </div>
      </div>

      {/* Success Message */}
      <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">Order Received</h1>
      
      {/* Order Details */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100 w-full max-w-md mb-8">
        <div className="text-center mb-6">
          <div className="text-gray-600 mb-2">Order Number</div>
          <div className="text-xl font-bold text-amber-800">{orderData.orderNumber}</div>
        </div>
        
        {/* Order Timeline */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="8" cy="8" r="6" stroke="#10B981" strokeWidth="1.5" fill="none"/>
                  <path d="M5 8L7 10L11 6" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <div className="font-medium text-gray-900">Order Placed</div>
                <div className="text-sm text-gray-500">Just now</div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="8" cy="8" r="6" stroke="#92400E" strokeWidth="1.5" fill="none"/>
                  <path d="M5 8L7 10L11 6" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <div className="font-medium text-gray-900 text-left">Preparing Order</div>
                <div className="text-sm text-gray-500">Estimated: 5-10 minutes</div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="8" cy="8" r="6" stroke="#9CA3AF" strokeWidth="1.5" fill="none"/>
                  <path d="M6 6H10" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M6 10H10" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <div className="font-medium text-gray-900 text-left">Out for Delivery</div>
                <div className="text-sm text-gray-500">Estimated: 20-30 minutes</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Estimated Delivery */}
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
          <div className="text-center">
            <div className="text-gray-600 text-sm mb-1">Estimated Delivery Time</div>
            <div className="text-2xl font-bold text-amber-800">{orderData.estimatedDelivery}</div>
            <div className="text-gray-500 text-sm mt-1">{orderData.deliveryDate}</div>
          </div>
        </div>
      </div>

      {/* Recent Order Summary */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-amber-100 w-full max-w-md mb-8">
        <h3 className="font-bold text-gray-900 mb-4">Your Order Summary</h3>
        
        <div className="space-y-4">
          {/* Items */}
          <div className="space-y-3">
            <p className="text-sm text-gray-500 mb-2">Items Ordered:</p>
            {orderData.cartItems && orderData.cartItems.length > 0 ? (
              orderData.cartItems.map((item, index) => (
                <div key={item.id || index} className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{item.name}</div>
                      <div className="text-gray-500 text-sm">
                        Qty: {item.quantity} × {formatRupiah(item.price)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-amber-800">
                      {formatRupiah(item.price * item.quantity)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-center py-4">No items available</div>
            )}
          </div>
          
          {/* Order Summary Details */}
          {orderData.orderSummary && (
            <div className="pt-3 border-t border-gray-200">
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatRupiah(orderData.orderSummary.subtotal || 0)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>{formatRupiah(orderData.orderSummary.tax || 0)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>{formatRupiah(orderData.orderSummary.deliveryFee || 0)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Platform Fee</span>
                  <span>{formatRupiah(orderData.orderSummary.platformFee || 0)}</span>
                </div>
                {orderData.orderSummary.tips > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Tip</span>
                    <span>{formatRupiah(orderData.orderSummary.tips)}</span>
                  </div>
                )}
                {orderData.orderSummary.promoDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Promo Discount</span>
                    <span>-{formatRupiah(orderData.orderSummary.promoDiscount)}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Total */}
          <div className="flex justify-between items-center pt-3 border-t border-gray-200">
            <div className="font-bold text-gray-900">Total</div>
            <div className="text-2xl font-bold text-amber-800">
              {formatRupiah(
                orderData.orderSummary?.total || 
                orderData.total || 
                0
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Thank You Message */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-amber-100 w-full max-w-md mb-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-amber-900 mb-3">THANK YOU FOR USING</h2>
          <div className="text-2xl font-bold text-amber-700 mb-6">THIS APP</div>
          
          {/* Feedback Request */}
          <div className="mb-6">
            <div className="flex items-center justify-center gap-4 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className="w-10 h-10 text-2xl hover:scale-110 transition-transform duration-200"
                >
                  ⭐
                </button>
              ))}
            </div>
            <p className="text-gray-600 text-sm">Rate your experience</p>
          </div>
          
          <div className="flex gap-3">
            <Link 
              to="/home"
              state={{ showSuccess: true }}
              className="flex-1 bg-gradient-to-r from-amber-700 to-amber-900 text-white py-3 rounded-xl font-bold text-center hover:shadow-lg transition-all duration-300"
            >
              OKay!
            </Link>
            <Link 
              to="/menu"
              className="flex-1 border-2 border-amber-700 text-amber-700 py-3 rounded-xl font-bold text-center hover:bg-amber-50 transition-colors duration-300"
            >
              Order More
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 w-full max-w-md">
        <Link 
          to="/home"
          state={{ showSuccess: true }}
          className="block w-full bg-gradient-to-r from-amber-700 to-amber-900 text-white py-4 rounded-2xl font-bold text-center hover:shadow-2xl active:scale-[0.98] transition-all duration-300 mb-4"
        >
          Back to Home
        </Link>
        
        <Link 
          to="/profile?tab=orders"
          className="block w-full border-2 border-amber-700 text-amber-700 py-3 rounded-2xl font-bold text-center hover:bg-amber-50 transition-colors duration-300"
        >
          View Order History
        </Link>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl py-3">
        <div className="flex justify-center">
          <div className="flex justify-between w-full max-w-md px-6">
            <Link 
              to="/home" 
              className="flex flex-col items-center text-gray-500 hover:text-amber-700 transition-colors flex-1 group"
            >
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
            
            <Link 
              to="/menu" 
              className="flex flex-col items-center text-amber-700 flex-1 group"
            >
              <div className="group-hover:scale-110 transition-transform duration-200">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="9" stroke="#92400E" strokeWidth="1.5" fill="none" />
                  <path d="M8 12H16" stroke="#92400E" strokeWidth="2" strokeLinecap="round" />
                  <path d="M10 8V12H14V8" stroke="#92400E" strokeWidth="2" strokeLinecap="round" />
                  <path d="M8 16H16" stroke="#92400E" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-xs font-bold mt-1">Menu</span>
            </Link>
            
            <Link 
              to="/cart" 
              className="flex flex-col items-center text-gray-500 hover:text-amber-700 transition-colors flex-1 group"
            >
              <div className="group-hover:scale-110 transition-transform duration-200">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="9" stroke="#9CA3AF" strokeWidth="1.5" fill="none" />
                  <path d="M8 16H16" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M10 10V12" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M14 10V12" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M7.5 16L8.5 10H15.5L16.5 16H7.5Z" 
                        stroke="#9CA3AF" 
                        strokeWidth="1.5" 
                        fill="none" 
                        strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-xs font-medium mt-1">Cart</span>
            </Link>
            
            <Link 
              to="/profile" 
              className="flex flex-col items-center text-gray-500 hover:text-amber-700 transition-colors flex-1 group"
            >
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

export default OrderSuccessPage;