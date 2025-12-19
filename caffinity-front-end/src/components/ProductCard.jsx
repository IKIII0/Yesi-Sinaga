// src/components/ProductCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { StarIcon } from './icons';
import { formatPrice } from '../utils/format';

const ProductCard = ({
  product,
  variant = 'default',
  showAddToCart = true,
  onAddToCart = null,
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(product.isLiked || false);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product, quantity);
    } else {
      // Default behavior
      console.log('Added to cart:', product, quantity);
      // Show toast notification
      alert(`Added ${quantity} ${product.name} to cart!`);
    }
  };

  const handleLike = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const getCategoryColor = (category) => {
    const colors = {
      coffee: 'bg-amber-100 text-amber-800',
      tea: 'bg-green-100 text-green-800',
      pastries: 'bg-orange-100 text-orange-800',
      special: 'bg-purple-100 text-purple-800',
      default: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.default;
  };

  const variants = {
    default: {
      container: 'card card-hover',
      image: 'w-full h-48 md:h-56 object-cover rounded-t-2xl',
      content: 'p-4 md:p-5',
      title: 'text-lg md:text-xl font-bold text-gray-900',
      description: 'text-gray-600 text-sm mt-1 line-clamp-2',
      price: 'text-xl md:text-2xl font-bold text-amber-800'
    },
    compact: {
      container: 'card card-hover',
      image: 'w-full h-40 object-cover rounded-t-xl',
      content: 'p-3',
      title: 'font-bold text-gray-900 text-sm',
      description: 'text-gray-600 text-xs mt-1 line-clamp-1',
      price: 'font-bold text-amber-800 text-sm'
    },
    featured: {
      container: 'card card-hover border-2 border-amber-200',
      image: 'w-full h-56 md:h-64 object-cover rounded-t-2xl',
      content: 'p-5 md:p-6',
      title: 'text-xl md:text-2xl font-bold text-gray-900',
      description: 'text-gray-600 mt-2',
      price: 'text-2xl md:text-3xl font-bold text-amber-800'
    },
    horizontal: {
      container: 'card card-hover flex flex-col sm:flex-row',
      image: 'w-full sm:w-32 h-48 sm:h-32 object-cover rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none',
      content: 'p-4 flex-1',
      title: 'text-lg font-bold text-gray-900',
      description: 'text-gray-600 text-sm mt-1 line-clamp-2',
      price: 'text-xl font-bold text-amber-800'
    }
  };

  const styles = variants[variant] || variants.default;

  return (
    <div 
      className={`${styles.container} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="relative overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className={`${styles.image} ${isHovered ? 'scale-110' : 'scale-100'} transition-transform duration-500`}
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {product.discount && (
            <span className="badge-secondary bg-red-500 text-white">
              -{product.discount}%
            </span>
          )}
          {product.isNew && (
            <span className="badge-secondary bg-green-500 text-white">
              NEW
            </span>
          )}
        </div>
        
        {/* Like Button */}
        <button 
          onClick={handleLike}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-md"
          aria-label={isLiked ? "Unlike" : "Like"}
        >
          <span className="text-lg">{isLiked ? '❤️' : '🤍'}</span>
        </button>
        
        {/* Category */}
        <div className={`absolute bottom-3 left-3 ${getCategoryColor(product.category)} text-xs font-medium px-3 py-1 rounded-full`}>
          {product.category}
        </div>
      </div>
      
      {/* Product Content */}
      <div className={styles.content}>
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <StarIcon 
                key={i} 
                filled={i < Math.floor(product.rating)}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1">({product.rating})</span>
        </div>
        
        {/* Title & Description */}
        <h3 className={styles.title}>{product.name}</h3>
        <p className={styles.description}>{product.description}</p>
        
        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {product.tags.map((tag, index) => (
              <span 
                key={index} 
                className="badge-secondary"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Price & Actions */}
        <div className="flex justify-between items-center mt-4">
          <div>
            <p className={styles.price}>{formatPrice(product.price)}</p>
            {product.originalPrice && (
              <p className="price-original">
                {formatPrice(product.originalPrice)}
              </p>
            )}
          </div>
          
          {/* Add to Cart Button */}
          {showAddToCart && (
            <button 
              onClick={handleAddToCart}
              className="btn-primary py-2.5 px-4 text-sm md:text-base"
              aria-label={`Add ${product.name} to cart`}
            >
              <span className="hidden sm:inline">Add to Cart</span>
              <span className="sm:hidden">Add</span>
            </button>
          )}
        </div>
        
        {/* Quantity Selector for featured variant */}
        {variant === 'featured' && showAddToCart && (
          <div className="flex items-center justify-between mt-6">
            <div className="quantity-selector">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="quantity-btn"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="font-bold text-gray-900 min-w-[40px] text-center">
                {quantity}
              </span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="quantity-btn"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <p className="text-lg font-bold text-amber-800">
              {formatPrice(product.price * quantity)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

ProductCard.defaultProps = {
  product: {
    id: 1,
    name: "Caramel Macchiato",
    description: "Rich espresso with vanilla syrup and caramel drizzle",
    price: 4.99,
    rating: 4.8,
    category: "coffee",
    image: "https://images.unsplash.com/photo-1570598912132-0ba1dc952b7d?w=400&h=300&fit=crop",
    tags: ["Popular", "Sweet"],
    isNew: false,
    discount: null,
    isLiked: false,
    originalPrice: null
  }
};

export default ProductCard;