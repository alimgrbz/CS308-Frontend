import React from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Star, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { addToCart } from '../api/cartApi'; // adjust path if needed
import { addToLocalCart } from '../utils/cartUtils'; // adjust path

import '../styles/ProductCard.css';

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
}

const getStarRatingFromPopularity = (popularity: number): number => {
  if (!popularity) return 0;
  if (popularity <= 20) return 1;
  if (popularity <= 40) return 2;
  if (popularity <= 60) return 3;
  if (popularity <= 80) return 4;
  return 5;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toast } = useToast();
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
    popularity = 0
  } = product;

  const starRating = getStarRatingFromPopularity(popularity);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!stock) {
      toast({
        title: "Product unavailable",
        description: "This item is currently out of stock.",
        variant: "destructive",
      });
      return;
    }
    
    const token = localStorage.getItem('token');

    try {
      if (token) {
        await addToCart(token, [{ productId, quantity: 1 }]);
      } else {
        addToLocalCart({ productId, name, price, picture });
      }
  
      toast({
        title: "Added to cart",
        description: `${name} has been added to your cart.`,
        duration: 3000,
      });
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
    <div className={`product-card ${!stock ? 'out-of-stock' : ''}`}>
      <div className="product-content">
        <Link to={`/product/${productId}`}>
          <div className="relative overflow-hidden">
            <img 
              src={picture} 
              alt={name}
              className="w-full h-64 object-cover"
              loading="lazy"
            />
            {!stock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="bg-driftmood-dark text-white px-4 py-2 rounded-md font-medium">
                  Out of Stock
                </span>
              </div>
            )}
            {badges?.includes("Best Seller") && (
              <Badge 
                variant="outline" 
                className="absolute top-3 left-3 z-10 bg-yellow-100 border-yellow-300 text-yellow-800 px-2 py-1 text-[10px] font-bold rounded-full flex items-center gap-1"
              >
                <Award size={12} fill="#FFC107" stroke="#FFC107" strokeWidth={2} />
                Best Seller
              </Badge>
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
                    size={16}
                    className={cn(
                      star <= starRating ? "rating-star-filled" : "rating-star"
                    )}
                    fill={star <= starRating ? "currentColor" : "none"}
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
        className="add-to-cart-btn flex items-center justify-center mt-auto" 
        disabled={!stock}
        onClick={handleAddToCart}
      >
        <ShoppingCart size={18} className="mr-2" />
        {stock ? 'Add to Cart' : 'Out of Stock'}
      </button>
    </div>
  );
};

export default ProductCard;