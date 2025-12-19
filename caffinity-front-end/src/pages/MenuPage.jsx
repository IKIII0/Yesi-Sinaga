import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { cartApiService } from "../utils/orderService";

// Fungsi format Rupiah
const formatRupiah = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Ikon SVG
const HomeIcon = ({ active = false }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="12"
      cy="12"
      r="9"
      stroke={active ? "#92400E" : "#9CA3AF"}
      strokeWidth="1.5"
      fill="none"
    />
    <path
      d="M9 17H15"
      stroke={active ? "#92400E" : "#9CA3AF"}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M12 9V13"
      stroke={active ? "#92400E" : "#9CA3AF"}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M9 13H15"
      stroke={active ? "#92400E" : "#9CA3AF"}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const CoffeeIcon = ({ active = false }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="12"
      cy="12"
      r="9"
      stroke={active ? "#92400E" : "#9CA3AF"}
      strokeWidth="1.5"
      fill="none"
    />
    <path
      d="M8 12H16"
      stroke={active ? "#92400E" : "#9CA3AF"}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M10 8V12H14V8"
      stroke={active ? "#92400E" : "#9CA3AF"}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M8 16H16"
      stroke={active ? "#92400E" : "#9CA3AF"}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const CartIcon = ({ count = 0, active = false }) => (
  <div className="relative">
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke={active ? "#92400E" : "#9CA3AF"}
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M8 16H16"
        stroke={active ? "#92400E" : "#9CA3AF"}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M10 10V12"
        stroke={active ? "#92400E" : "#9CA3AF"}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M14 10V12"
        stroke={active ? "#92400E" : "#9CA3AF"}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M7.5 16L8.5 10H15.5L16.5 16H7.5Z"
        stroke={active ? "#92400E" : "#9CA3AF"}
        strokeWidth="1.5"
        fill="none"
        strokeLinejoin="round"
      />
    </svg>

    {count > 0 && (
      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold border-2 border-white shadow-md">
        {count > 9 ? "9+" : count}
      </div>
    )}
  </div>
);

const ProfileIcon = ({ active = false }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="12"
      cy="12"
      r="9"
      stroke={active ? "#92400E" : "#9CA3AF"}
      strokeWidth="1.5"
      fill="none"
    />
    <circle
      cx="12"
      cy="9"
      r="3"
      stroke={active ? "#92400E" : "#9CA3AF"}
      strokeWidth="1.5"
      fill="none"
    />
    <path
      d="M6 20C6 16 9 13 12 13C15 13 18 16 18 20"
      stroke={active ? "#92400E" : "#9CA3AF"}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const SearchIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="9"
      cy="9"
      r="7"
      stroke="#9CA3AF"
      strokeWidth="1.5"
      fill="none"
    />
    <path
      d="M14 14L17 17"
      stroke="#9CA3AF"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const CloseIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="10"
      cy="10"
      r="9"
      stroke="#9CA3AF"
      strokeWidth="2"
      fill="none"
    />
    <line
      x1="6"
      y1="6"
      x2="14"
      y2="14"
      stroke="#9CA3AF"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="6"
      y1="14"
      x2="14"
      y2="6"
      stroke="#9CA3AF"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const StarIcon = ({ filled = true }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="8"
      cy="8"
      r="7"
      stroke={filled ? "#F59E0B" : "#E5E7EB"}
      strokeWidth="1"
      fill="none"
    />
    <path
      d="M8 3L9.5 6L13 6.5L10.5 9L11 13L8 11L5 13L5.5 9L3 6.5L6.5 6L8 3Z"
      fill={filled ? "#F59E0B" : "none"}
      stroke={filled ? "#F59E0B" : "#E5E7EB"}
      strokeWidth="0.5"
    />
  </svg>
);

const ChevronIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="8" cy="8" r="7" stroke="#92400E" strokeWidth="1" fill="none" />
    <path
      d="M6 6L8 8L10 10"
      stroke="#92400E"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M6 10L8 8L10 6"
      stroke="#92400E"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const MenuPage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const categories = [
    { id: "all", name: "All" },
    { id: "coffee", name: "Coffee" },
    { id: "tea", name: "Tea" },
    { id: "pastries", name: "Pastries" },
    { id: "special", name: "Special" },
  ];

  const menuItems = [
    {
      id: 1,
      name: "Caramel Macchiato",
      category: "coffee",
      price: 35000,
      rating: 4.8,
      description: "Rich espresso with vanilla syrup and caramel drizzle",
      detailedDescription:
        "Our signature drink made with double shot of espresso, vanilla-flavored syrup, milk and caramel drizzle. Perfect balance of sweetness and coffee flavor.",
      image:
        "https://dinnerthendessert.com/wp-content/uploads/2023/10/Caramel-Macchiato-7-500x500.jpg",
      ingredients: [
        "Espresso",
        "Vanilla Syrup",
        "Steamed Milk",
        "Caramel Drizzle",
        "Ice",
      ],
      calories: 250,
      size: "Medium (16oz)",
    },
    {
      id: 2,
      name: "Matcha Latte",
      category: "tea",
      price: 32000,
      rating: 4.9,
      description: "Premium matcha with steamed milk",
      detailedDescription:
        "Made with ceremonial grade matcha powder, steamed milk, and a touch of honey. Rich in antioxidants and packed with flavor.",
      image:
        "https://mocktail.net/wp-content/uploads/2021/05/Iced-Matcha-Latte_1.jpg",
      ingredients: ["Ceremonial Matcha", "Steamed Milk", "Honey", "Vanilla"],
      calories: 180,
      size: "Medium (16oz)",
    },
    {
      id: 3,
      name: "Butter Croissant",
      category: "pastries",
      price: 22000,
      rating: 4.7,
      description: "Flaky, buttery French croissant",
      detailedDescription:
        "Authentic French croissant made with pure butter, layered to perfection. Baked fresh daily.",
      image: "https://www.lalevain.com/wp-content/uploads/2021/11/Xsant.jpg",
      ingredients: ["Flour", "Butter", "Yeast", "Sugar", "Salt"],
      calories: 310,
      size: "Regular",
    },
    {
      id: 4,
      name: "Iced Americano",
      category: "coffee",
      price: 28000,
      rating: 4.5,
      description: "Chilled espresso with water",
      detailedDescription:
        "Strong and refreshing espresso shots topped with cold water and ice. Perfect for hot days.",
      image:
        "https://diethood.com/wp-content/uploads/2023/08/iced-americano-3.jpg",
      ingredients: ["Espresso", "Water", "Ice"],
      calories: 15,
      size: "Large (20oz)",
    },
    {
      id: 5,
      name: "Cheesecake",
      category: "pastries",
      price: 35000,
      rating: 4.8,
      description:
        "A light, crisp pastry filled with smooth, creamy cheesecake.",
      detailedDescription:
        "New York style cheesecake with graham cracker crust, topped with strawberry compote.",
      image:
        "https://natashaskitchen.com/wp-content/uploads/2025/09/Pumpkin-Cheesecake-11.jpg",
      ingredients: [
        "Cream Cheese",
        "Graham Cracker",
        "Sugar",
        "Eggs",
        "Strawberry",
      ],
      calories: 420,
      size: "1 Slice",
    },
    {
      id: 6,
      name: "Cappuccino",
      category: "coffee",
      price: 30000,
      rating: 4.7,
      description: "Classic Italian coffee with steamed milk and rich foam",
      detailedDescription:
        "Equal parts espresso, steamed milk, and milk foam. A classic favorite.",
      image:
        "https://img.freepik.com/free-photo/high-view-glass-cappucino-with-coffee-beans_23-2148251687.jpg?semt=ais_hybrid&w=500&h=500&fit=crop",
      ingredients: ["Espresso", "Steamed Milk", "Milk Foam"],
      calories: 120,
      size: "Medium (12oz)",
    },
    {
      id: 7,
      name: "Thai Tea",
      category: "tea",
      price: 29000,
      rating: 4.8,
      description: "Sweet and creamy Thai tea with condensed milk",
      detailedDescription:
        "Authentic Thai tea blend with condensed milk and evaporated milk. Sweet and aromatic.",
      image: "https://japo.co.id/wp-content/uploads/2022/10/thai-teaa.jpg",
      ingredients: [
        "Thai Tea Leaves",
        "Condensed Milk",
        "Evaporated Milk",
        "Sugar",
      ],
      calories: 280,
      size: "Medium (16oz)",
    },
    {
      id: 8,
      name: "Blueberry Muffins",
      category: "pastries",
      price: 25000,
      rating: 4.6,
      description: "Moist muffins bursting with fresh blueberries",
      detailedDescription:
        "Freshly baked muffins loaded with juicy blueberries and topped with crunchy sugar.",
      image:
        "https://www.sprinklesomesugar.com/wp-content/uploads/2016/07/IMG_8404-2.jpg",
      ingredients: ["Flour", "Blueberries", "Butter", "Sugar", "Eggs"],
      calories: 320,
      size: "Regular",
    },
    {
      id: 9,
      name: "Gingerbread House",
      category: "special",
      price: 65000,
      rating: 4.9,
      description: "Festive gingerbread house decorated with icing and candy",
      detailedDescription:
        "Hand-decorated gingerbread house perfect for the holiday season. Includes various candies and icing.",
      image: "https://partypinching.com/wp-content/uploads/2018/12/s8.jpg",
      ingredients: ["Gingerbread", "Royal Icing", "Assorted Candies", "Sugar"],
      calories: 850,
      size: "Small House",
    },
    {
      id: 10,
      name: "Iced Pumpkin Latte",
      category: "special",
      price: 38000,
      rating: 4.7,
      description: "Refreshing pumpkin spice latte served over ice",
      detailedDescription:
        "Seasonal favorite with pumpkin spice syrup, espresso, milk, and whipped cream.",
      image:
        "https://coffeecopycat.com/wp-content/uploads/2023/10/IcedPumpkinSpiceLatte-1200-x-1200.jpg",
      ingredients: [
        "Espresso",
        "Pumpkin Spice Syrup",
        "Milk",
        "Whipped Cream",
        "Ice",
      ],
      calories: 290,
      size: "Medium (16oz)",
    },
  ];

  // Initialize cart items from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
  }, []);

  // Update localStorage whenever cartItems change
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Hitung total item di cart
  const totalCartItems = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  // Fungsi pencarian
  const searchItems = (query) => {
    const lowerQuery = query.toLowerCase().trim();
    if (!lowerQuery) return menuItems;

    return menuItems.filter(
      (item) =>
        item.name.toLowerCase().includes(lowerQuery) ||
        item.description.toLowerCase().includes(lowerQuery) ||
        item.category.toLowerCase().includes(lowerQuery) ||
        item.detailedDescription.toLowerCase().includes(lowerQuery) ||
        item.ingredients.some((ingredient) =>
          ingredient.toLowerCase().includes(lowerQuery)
        )
    );
  };

  // Filter berdasarkan kategori DAN pencarian
  const getFilteredItems = () => {
    let items = searchQuery ? searchItems(searchQuery) : menuItems;

    if (activeCategory !== "all") {
      items = items.filter((item) => item.category === activeCategory);
    }

    return items;
  };

  const filteredItems = getFilteredItems();

  // Fungsi untuk menambahkan item ke cart
  const addToCart = async (product, qty = 1) => {
    const existingItemIndex = cartItems.findIndex(
      (item) => item.id === product.id
    );

    if (existingItemIndex >= 0) {
      // Update quantity jika sudah ada
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingItemIndex].quantity += qty;
      setCartItems(updatedCartItems);
    } else {
      // Tambah item baru
      setCartItems([
        ...cartItems,
        {
          id: product.id,
          product_id: `prod_${product.id}`,
          name: product.name,
          description: product.description,
          price: product.price,
          quantity: qty,
          image: product.image,
          category:
            product.category.charAt(0).toUpperCase() +
            product.category.slice(1),
        },
      ]);
    }

    // Kirim juga ke backend cart (jika user login)
    try {
      await cartApiService.addToCart({
        product_id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: qty,
      });
    } catch (error) {
      console.error("Failed to add item to backend cart:", error);
    }
  };

  const openProductDetail = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeProductDetail = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  };

  useEffect(() => {
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // FUNGSI UNTUK MENAMBAH KE CART DARI DETAIL MODAL
  const addToCartFromDetail = () => {
    if (!selectedProduct) return;

    addToCart(selectedProduct, quantity);

    // Tampilkan toast sukses dengan format Rupiah
    setSuccessMessage(
      `${quantity} ${
        selectedProduct.name
      } ditambahkan ke keranjang! - ${formatRupiah(
        selectedProduct.price * quantity
      )}`
    );
    setShowSuccessToast(true);

    setTimeout(() => {
      setShowSuccessToast(false);
    }, 3000);

    closeProductDetail();
  };

  // FUNGSI QUICK ADD
  const quickAddToCart = (product) => {
    addToCart(product, 1);

    // Tampilkan toast sukses dengan format Rupiah
    setSuccessMessage(
      `${product.name} ditambahkan ke keranjang! - ${formatRupiah(
        product.price
      )}`
    );
    setShowSuccessToast(true);

    setTimeout(() => {
      setShowSuccessToast(false);
    }, 3000);
  };

  const ProductDetailModal = () => {
    if (!selectedProduct || !isModalOpen) return null;

    return (
      <div className="fixed inset-0 z-50">
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={closeProductDetail}
        />

        <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
          <div
            className="bg-white rounded-3xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col shadow-2xl pointer-events-auto relative z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-64 overflow-hidden">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={closeProductDetail}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-3 hover:bg-white transition-colors shadow-lg"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="10"
                    cy="10"
                    r="9"
                    stroke="#9CA3AF"
                    strokeWidth="2"
                    fill="none"
                  />
                  <line
                    x1="6"
                    y1="6"
                    x2="14"
                    y2="14"
                    stroke="#9CA3AF"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="6"
                    y1="14"
                    x2="14"
                    y2="6"
                    stroke="#9CA3AF"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                <StarIcon filled={true} />
                <span className="font-bold text-base">
                  {selectedProduct.rating}
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedProduct.name}
                    </h2>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-4 py-2 bg-amber-100 text-amber-800 font-medium rounded-full text-sm">
                        {selectedProduct.category.charAt(0).toUpperCase() +
                          selectedProduct.category.slice(1)}
                      </span>
                    </div>
                  </div>
                  <span className="text-3xl font-bold text-amber-800">
                    {formatRupiah(selectedProduct.price)}
                  </span>
                </div>

                <p className="text-gray-700 text-base leading-relaxed mb-6">
                  {selectedProduct.detailedDescription}
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Nutrition Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">Calories</p>
                    <p className="text-xl font-bold text-gray-900">
                      {selectedProduct.calories} kcal
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">Size</p>
                    <p className="text-xl font-bold text-gray-900">
                      {selectedProduct.size}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Ingredients
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {selectedProduct.ingredients.map((ingredient, index) => (
                    <div
                      key={index}
                      className="bg-amber-50 rounded-xl p-3 text-center border border-amber-100"
                    >
                      <span className="text-sm font-medium text-amber-800">
                        {ingredient}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
                  Quantity
                </h3>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={decreaseQuantity}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                        quantity <= 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-amber-100 text-amber-700 hover:bg-amber-200 active:scale-95"
                      }`}
                      disabled={quantity <= 1}
                    >
                      <span className="text-2xl font-bold">-</span>
                    </button>

                    <div className="text-center">
                      <span className="text-4xl font-bold text-gray-900 min-w-[50px] inline-block">
                        {quantity}
                      </span>
                    </div>

                    <button
                      onClick={increaseQuantity}
                      className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center hover:bg-amber-200 active:scale-95 transition-all duration-300"
                    >
                      <span className="text-2xl font-bold">+</span>
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-gray-600 mb-1">Total Price</p>
                    <p className="text-3xl font-bold text-amber-800">
                      {formatRupiah(selectedProduct.price * quantity)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white border-t border-gray-100">
              <button
                onClick={addToCartFromDetail}
                className="w-full bg-amber-700 text-white py-4 rounded-2xl font-bold text-lg hover:bg-amber-800 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 shadow-lg"
              >
                <span className="text-xl">+</span>
                <span>
                  Add to Cart - {formatRupiah(selectedProduct.price * quantity)}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SuccessToast = () => {
    if (!showSuccessToast) return null;

    return (
      <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-[60] animate-fadeIn flex items-center gap-3">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="10"
            cy="10"
            r="9"
            stroke="white"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M7 10L10 13L13 7"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <span className="font-medium">{successMessage}</span>
      </div>
    );
  };

  // Fungsi untuk menghandle pencarian saat Enter ditekan
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // Trigger pencarian
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pb-24">
      <ProductDetailModal />
      <SuccessToast />

      <header className="px-6 pt-8 pb-4 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <h1 className="text-2xl md:text-3xl font-bold text-amber-900">
              Menu
            </h1>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {totalCartItems} items
            </span>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="relative w-full max-w-2xl">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <SearchIcon />
            </span>
            <input
              type="text"
              placeholder="Search your favorite coffee..."
              className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-gray-100 border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-300 focus:outline-none text-gray-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                title="Clear search"
              >
                <CloseIcon />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="px-6">
        <section className="mt-4">
          <div className="flex justify-center overflow-x-auto gap-2 pb-3 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-3 rounded-xl whitespace-nowrap transition-all duration-300 flex-shrink-0 ${
                  activeCategory === cat.id
                    ? "bg-amber-700 text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-amber-300 hover:bg-amber-50"
                }`}
              >
                <span className="font-medium">{cat.name}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <div className="flex flex-col items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {searchQuery
                ? `Search Results for "${searchQuery}"`
                : "Featured Drinks"}
            </h2>
            <span
              className={`font-medium ${
                filteredItems.length === 0 ? "text-red-500" : "text-amber-600"
              }`}
            >
              {filteredItems.length}{" "}
              {filteredItems.length === 1 ? "item" : "items"} found
            </span>
          </div>

          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="mb-6">
                <div className="w-24 h-24 mx-auto rounded-full bg-amber-100 flex items-center justify-center">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="#92400E"
                      strokeWidth="1.5"
                      fill="none"
                    />
                    <path
                      d="M8 12H16"
                      stroke="#92400E"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M10 8V12H14V8"
                      stroke="#92400E"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M8 16H16"
                      stroke="#92400E"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No items found
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery
                  ? `No results for "${searchQuery}". Try different keywords.`
                  : "No items available in this category."}
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                }}
                className="bg-amber-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-amber-800 transition-colors active:scale-95"
              >
                View All Items
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 border border-amber-100"
                  >
                    <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
                        <StarIcon filled={true} />
                        <span className="font-bold text-sm">{item.rating}</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-xl text-gray-900 mb-2">
                        {item.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {item.description}
                      </p>

                      <div className="mb-4">
                        <span className="px-4 py-1 bg-amber-100 text-amber-800 text-sm font-medium rounded-full">
                          {item.category.charAt(0).toUpperCase() +
                            item.category.slice(1)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-amber-800">
                          {formatRupiah(item.price)}
                        </span>

                        <div className="flex gap-2">
                          <button
                            onClick={() => openProductDetail(item)}
                            className="text-amber-700 text-sm font-medium hover:text-amber-800 px-3 py-2 rounded-lg hover:bg-amber-50 transition-colors flex items-center gap-2"
                          >
                            <span>Details</span>
                            <ChevronIcon />
                          </button>
                          <button
                            onClick={() => quickAddToCart(item)}
                            className="bg-amber-700 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-amber-800 active:scale-95 transition-all duration-300 flex items-center gap-2"
                          >
                            <span className="text-lg">+</span>
                            <span>Add</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl py-3 z-40">
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
              className="flex flex-col items-center text-amber-700 flex-1 group"
            >
              <div className="group-hover:scale-110 transition-transform duration-200">
                <CoffeeIcon active={true} />
              </div>
              <span className="text-xs font-bold mt-1">Menu</span>
            </Link>

            <Link
              to="/cart"
              className="flex flex-col items-center text-gray-500 hover:text-amber-700 transition-colors flex-1 group relative"
            >
              <div className="group-hover:scale-110 transition-transform duration-200">
                <CartIcon active={false} count={totalCartItems} />
              </div>
              <span className="text-xs font-medium mt-1">Cart</span>
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

const styles = `
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out;
  }
`;

export default function MenuPageWithStyles(props) {
  return (
    <>
      <style>{styles}</style>
      <MenuPage {...props} />
    </>
  );
}
