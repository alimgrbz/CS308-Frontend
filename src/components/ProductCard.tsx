import React from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import '../styles/ProductCard.css';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  numReviews: number;
  inStock: boolean;
  category: string;
  popularity?: number;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toast } = useToast();
  const { id, name, price, description, inStock, image, category, rating, numReviews } = product;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!inStock) {
      toast({
        title: "Product unavailable",
        description: "This item is currently out of stock.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Added to cart",
      description: `${name} has been added to your cart.`,
      duration: 3000,
    });
  };

  return (
    <div className={`product-card ${!inStock ? 'out-of-stock' : ''}`}>
      <div className="product-content">
        <Link to={`/product/${id}`}>
          <div className="relative overflow-hidden">
            <img 
              src={image} 
              alt={name}
              className="w-full h-64 object-cover"
              loading="lazy"
            />
            {!inStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="bg-driftmood-dark text-white px-4 py-2 rounded-md font-medium">
                  Out of Stock
                </span>
              </div>
            )}
            <div className="absolute top-3 right-3">
              <span className="chip bg-driftmood-lime text-driftmood-dark">
                {category}
              </span>
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
                      star <= Math.round(rating) ? "rating-star-filled" : "rating-star"
                    )}
                    fill={star <= Math.round(rating) ? "currentColor" : "none"}
                  />
                ))}
              </div>
              <span className="text-xs text-driftmood-brown">
                ({numReviews})
              </span>
            </div>
            
            <div className="product-price">${price.toFixed(2)}</div>
          </div>
        </Link>
      </div>
      
      <button 
        className="add-to-cart-btn flex items-center justify-center mt-auto" 
        disabled={!inStock}
        onClick={handleAddToCart}
      >
        <ShoppingCart size={18} className="mr-2" />
        {inStock ? 'Add to Cart' : 'Out of Stock'}
      </button>
    </div>
  );
};

export default ProductCard;