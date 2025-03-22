import React from 'react';
import { X, Star, ShoppingCart, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReviewForm from './ReviewForm';
import ReviewsList from './ReviewList';

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
  popularity: number;
  longDescription: string;
  ingredients: string[];
  origin: string;
}

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onClose }) => {
  const [activeTab, setActiveTab] = React.useState('description');
  
  // Mock reviews data
  const reviews = [
    {
      id: 1,
      userName: "Jane Cooper",
      rating: 5,
      date: "2 months ago",
      comment: "This coffee has the perfect balance of flavors! I love the smooth finish and subtle notes of chocolate.",
      isVerified: true,
    },
    {
      id: 2,
      userName: "Alex Johnson",
      rating: 4,
      date: "3 weeks ago",
      comment: "Very good quality beans. The aroma is incredible, although I found it slightly more acidic than expected.",
      isVerified: true,
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div 
        className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-xl animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-driftmood-lightlime">
          <h2 className="font-serif text-xl font-medium">{product.name}</h2>
          <button 
            onClick={onClose}
            className="text-driftmood-brown hover:text-driftmood-dark rounded-full p-1"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="overflow-y-auto flex-1">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 p-6">
              <div className="rounded-lg overflow-hidden mb-6">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-auto object-cover"
                />
              </div>
              
              <div className="flex items-center mb-4">
                <div className="flex mr-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={18}
                      className={cn(
                        star <= Math.round(product.rating) ? "rating-star-filled" : "rating-star"
                      )}
                      fill={star <= Math.round(product.rating) ? "currentColor" : "none"}
                    />
                  ))}
                </div>
                <span className="text-sm text-driftmood-brown">
                  {product.rating.toFixed(1)} ({product.numReviews} reviews)
                </span>
              </div>
              
              <div className="flex items-center justify-between mb-6">
                <span className="font-serif text-2xl font-medium">${product.price.toFixed(2)}</span>
                
                <div className="flex items-center">
                  <span className="chip bg-driftmood-lime text-driftmood-dark mr-2">
                    {product.category}
                  </span>
                  {product.inStock ? (
                    <span className="chip bg-green-100 text-green-800">In Stock</span>
                  ) : (
                    <span className="chip bg-red-100 text-red-800">Out of Stock</span>
                  )}
                </div>
              </div>
              
              <button 
                className={cn(
                  "btn-primary w-full flex items-center justify-center mb-4",
                  !product.inStock && "opacity-50 cursor-not-allowed"
                )}
                disabled={!product.inStock}
              >
                <ShoppingCart size={18} className="mr-2" />
                {product.inStock ? "Add to Cart" : "Sold Out"}
              </button>
              
              <div className="flex items-center justify-center text-sm text-driftmood-brown">
                <BarChart3 size={16} className="mr-2" />
                <span>Popularity: {product.popularity}/10</span>
              </div>
            </div>
            
            <div className="md:w-1/2 border-t md:border-t-0 md:border-l border-driftmood-lightlime p-6">
              <div className="border-b border-driftmood-lightlime mb-6">
                <div className="flex space-x-4 mb-6">
                  <button
                    className={cn(
                      "px-4 py-2 font-medium text-sm transition-colors relative",
                      activeTab === 'description' 
                        ? "text-driftmood-dark" 
                        : "text-driftmood-brown hover:text-driftmood-dark"
                    )}
                    onClick={() => setActiveTab('description')}
                  >
                    Description
                    {activeTab === 'description' && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-driftmood-dark" />
                    )}
                  </button>
                  <button
                    className={cn(
                      "px-4 py-2 font-medium text-sm transition-colors relative",
                      activeTab === 'details' 
                        ? "text-driftmood-dark" 
                        : "text-driftmood-brown hover:text-driftmood-dark"
                    )}
                    onClick={() => setActiveTab('details')}
                  >
                    Details
                    {activeTab === 'details' && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-driftmood-dark" />
                    )}
                  </button>
                  <button
                    className={cn(
                      "px-4 py-2 font-medium text-sm transition-colors relative",
                      activeTab === 'reviews' 
                        ? "text-driftmood-dark" 
                        : "text-driftmood-brown hover:text-driftmood-dark"
                    )}
                    onClick={() => setActiveTab('reviews')}
                  >
                    Reviews ({product.numReviews})
                    {activeTab === 'reviews' && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-driftmood-dark" />
                    )}
                  </button>
                </div>
              </div>
              
              <div className="mb-6">
                {activeTab === 'description' && (
                  <div className="prose prose-sm max-w-none">
                    <p className="mb-4">{product.longDescription}</p>
                  </div>
                )}
                
                {activeTab === 'details' && (
                  <div>
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Ingredients</h4>
                      <ul className="list-disc list-inside text-sm text-driftmood-brown space-y-1">
                        {product.ingredients.map((ingredient, index) => (
                          <li key={index}>{ingredient}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Origin</h4>
                      <p className="text-sm text-driftmood-brown">{product.origin}</p>
                    </div>
                  </div>
                )}
                
                {activeTab === 'reviews' && (
                  <div>
                    <ReviewsList reviews={reviews} />
                    
                    <div className="mt-8 pt-6 border-t border-driftmood-lightlime">
                      <ReviewForm productId={product.id} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;