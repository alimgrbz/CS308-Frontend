import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Star, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { addToCart } from '../api/cartApi'; // adjust path if needed
import { addToLocalCart } from '../utils/cartUtils'; // adjust path
import OutOfStockDialog from './OutOfStockDialog';
import { getStockById } from '../api/productApi';
import { getCart } from '../api/cartApi';
import { getRatingsByProduct } from '../api/rateApi';

import '../styles/ProductCard.css';

// Function to convert popularity to star rating
const getStarRatingFromPopularity = (popularity: number): number => {
  // Convert popularity (0-100) to a 1-5 star rating
  return Math.max(1, Math.min(5, Math.round(popularity / 20)));
};

interface Product {
  productId: number;
  name: string;
  description: string;
  price: number;
  picture: string;
  rating: number;
  numReviews: number;
  stock: boolean;
  categoryId: number;
  categoryType: string;
  popularity?: number;
  badges?: string[];
  longDescription?: string;
  ingredients?: string[];
  roastLevel?: string;
  origin?: string;
  distributor?: string;
  discount?: number;
  status?: string;
  warrantyStatus?: string;
  costRatio?: number;
  serialNumber?: string;
  model?: string;
}

interface ProductCardProps {
  product: Product;
  isTopThree: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isTopThree }) => {
  const { toast } = useToast();
  const [isOutOfStockDialogOpen, setIsOutOfStockDialogOpen] = useState(false);
  const [actualStock, setActualStock] = useState<number | null>(null);
  const [insufficientStockMessage, setInsufficientStockMessage] = useState('');
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const {
    productId,
    name,
    description,
    price,
    picture,
    stock,
    categoryId,
    categoryType,
    badges,
    popularity = 0,
    rating,
    discount = 0
  } = product;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch stock
        const stockAmount = await getStockById(productId);
        setActualStock(stockAmount);

        // Fetch ratings
        const ratingsResponse = await getRatingsByProduct(productId);
        const ratingValues = Array.isArray(ratingsResponse.ratings)
          ? ratingsResponse.ratings.map((r) => Number(r.rate))
          : [];

        if (ratingValues.length > 0) {
          const avg = ratingValues.reduce((sum, val) => sum + val, 0) / ratingValues.length;
          setAverageRating(avg);
        } else {
          setAverageRating(null);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, [productId]);

  const starRating = getStarRatingFromPopularity(popularity);
  const hasDiscount = discount > 0;
  const discountedPrice = hasDiscount ? price * (1 - discount / 100) : price;


  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const token = localStorage.getItem('token');
    let currentCartQuantity = 0;

    if (token) {
      try {
        const cartResponse = await getCart(token);
        const cartItem = cartResponse.find(item => item.product.id === productId);
        currentCartQuantity = cartItem ? cartItem.count : 0;
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    } else {
      const localCart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
      const localCartItem = localCart.find(item => item.productId === productId);
      currentCartQuantity = localCartItem ? localCartItem.quantity : 0;
    }
    
    if (actualStock !== null && (actualStock === 0 || currentCartQuantity + 1 > actualStock)) {
      setInsufficientStockMessage(`Sorry, ${name} is currently out of stock.`);
      setIsOutOfStockDialogOpen(true);
      return;
    }

    try {
      if (token) {
        await addToCart(token, [{ productId, quantity: 1 }]);
      } else {
        addToLocalCart({ productId, name, price, picture });
      }
      window.dispatchEvent(new Event('cart-updated'));
      toast({
        title: "Added to cart",
        description: `${name} has been added to your cart.`,
        duration: 3000,
      });

      const newStock = await getStockById(productId);
      setActualStock(newStock);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Could not add to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className={`product-card ${(actualStock !== null && actualStock === 0) ? 'out-of-stock' : ''}`}>
        <div className="product-content">
          <Link to={`/product/${productId}`}>
            <div className="relative overflow-hidden">
              <img 
                src={picture} 
                alt={name}
                className="w-full h-64 object-cover"
                loading="lazy"
              />
              {actualStock !== null && actualStock === 0 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="bg-driftmood-dark text-white px-4 py-2 rounded-md font-medium">
                    Out of Stock
                  </span>
                </div>
              )}
              {actualStock !== null && actualStock <= 10 && actualStock > 0 && (
                <div className="absolute top-12 right-3">
                  <Badge 
                    variant="outline" 
                    className="bg-yellow-100 border-yellow-300 text-yellow-800 px-2 py-1 text-[10px] font-bold rounded-full"
                  >
                    Only {actualStock} left!
                  </Badge>
                </div>
              )}
              {isTopThree && (
                <div className="absolute top-3 -left-8 transform -rotate-45 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-[10px] font-extrabold px-8 py-1 shadow-xl overflow-hidden flex justify-center items-center">
                  <span className="relative z-10">Best Seller</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer-slow"></div>
                </div>
              )}
              {hasDiscount && (
              <div className="absolute bottom-3 left-3 z-10">
              <Badge
                variant="outline"
                className="bg-red-600 border-red-700 text-white px-2 py-1 text-[10px] font-bold rounded-full shadow"
              >
              {discount}% OFF
              </Badge>
            </div>
            )}

              <div className="absolute top-3 right-3">
                <Badge 
                  variant="outline" 
                  className="bg-driftmood-lightlime border-driftmood-lime text-driftmood-dark px-2 py-1 text-[10px] font-bold rounded-full"
                >
                  {categoryType || "Unknown Category"}
                </Badge>
              </div>
            </div>
            
            <div className="product-info">
              <h3 className="product-name">{name}</h3>
              <p className="product-description">{description}</p>
              
              <div className="flex items-center mb-2">
                <div className="flex mr-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={18}
                    className={cn(
                      averageRating !== null && star <= Math.round(averageRating) ? "rating-star-filled" : "rating-star"
                    )}
                    fill={averageRating !== null && star <= Math.round(averageRating) ? "currentColor" : "none"}
                  />
                ))}
                </div>
               
              </div>
              
              <div className="product-price">
                ${typeof price === 'number' ? price.toFixed(2) : '0.00'}
              </div>
            </div>
          </Link>
        </div>
        
        <button 
          className="auth-button flex items-center justify-center mt-auto w-full bg-[#2d6a4f] hover:bg-[#1b4332] text-white px-4 py-3 rounded-md transition-colors duration-200" 
          disabled={actualStock !== null && actualStock === 0}
          onClick={handleAddToCart}
        >
          <ShoppingCart size={18} className="mr-2" />
          {actualStock !== null && actualStock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
      
      <OutOfStockDialog 
        isOpen={isOutOfStockDialogOpen}
        onOpenChange={setIsOutOfStockDialogOpen}
        productName={insufficientStockMessage}
      />
    </>
  );
};

export default ProductCard;