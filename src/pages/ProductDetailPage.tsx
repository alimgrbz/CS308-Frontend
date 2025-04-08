import React from 'react';
import { useParams } from 'react-router-dom';
import { PRODUCTS } from './ProductIndex';
import { Star, ShoppingCart, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import '../ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const product = PRODUCTS.find((p) => p.id === parseInt(id || '', 10));
  const [activeTab, setActiveTab] = React.useState('description');
  const [quantity, setQuantity] = React.useState(1);
  const { toast } = useToast();

  if (!product) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold">Product not found</h2>
      </div>
    );
  }

  const reviews = [
    {
      id: 1,
      userName: "Jane Cooper",
      rating: 5,
      date: "2 months ago",
      comment: "This coffee has the perfect balance of flavors!",
      isVerified: true,
    },
    {
      id: 2,
      userName: "Alex Johnson",
      rating: 4,
      date: "3 weeks ago",
      comment: "Very good quality beans. Aroma is incredible!",
      isVerified: true,
    }
  ];

  return (
    <div className="min-h-screen bg-driftmood-cream p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Image */}
          <div className="md:w-1/2">
            <img src={product.image} alt={product.name} className="w-full rounded-lg object-cover" />
          </div>

          {/* Info */}
          <div className="md:w-1/2 space-y-4">
            <h1 className="text-2xl font-serif font-semibold">{product.name}</h1>
            <p className="text-driftmood-brown">{product.description}</p>

            <div className="flex items-center space-x-2">
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
              <span className="text-sm text-driftmood-brown">
                {product.rating.toFixed(1)} ({product.numReviews})
              </span>
            </div>

            <div className="text-xl font-bold">${product.price.toFixed(2)}</div>

            <div className="flex gap-2 flex-wrap">
              <span className="chip bg-driftmood-lime text-driftmood-dark">{product.category}</span>
              {product.origin && (
                <span className="chip bg-driftmood-cream text-driftmood-brown">Origin: {product.origin}</span>
              )}
              {product.roastLevel && (
                <span className="chip bg-driftmood-cream text-driftmood-brown">Roast: {product.roastLevel}</span>
              )}
              {product.inStock ? (
                <span className="chip bg-green-100 text-green-800">In Stock</span>
              ) : (
                <span className="chip bg-red-100 text-red-800">Out of Stock</span>
              )}
            </div>

            {/* Quantity selector + add to cart */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-4">
              <div className="flex items-center border border-driftmood-lightlime rounded-md overflow-hidden w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="quantity-btn"
                >
                  -
                </button>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="quantity-input"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="quantity-btn"
                >
                  +
                </button>
              </div>

              <button
                className={cn(
                  "btn-primary flex-1 flex items-center justify-center",
                  !product.inStock && "opacity-50 cursor-not-allowed"
                )}
                disabled={!product.inStock}
                onClick={() => {
                  toast({
                    title: "Added to cart",
                    description: `${product.name} (x${quantity}) has been added to your cart.`,
                    duration: 3000,
                  });
                }}
              >
                <ShoppingCart size={18} className="mr-2" />
                {product.inStock ? "Add to Cart" : "Sold Out"}
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-10">
          <div className="border-b border-driftmood-lightlime mb-4 flex space-x-6">
            {["description", "details", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "py-2 text-sm font-medium relative",
                  activeTab === tab ? "text-driftmood-dark" : "text-driftmood-brown hover:text-driftmood-dark"
                )}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-driftmood-dark" />
                )}
              </button>
            ))}
          </div>

          {activeTab === "description" && (
            <p className="text-driftmood-brown">{product.longDescription}</p>
          )}

          {activeTab === "details" && (
            <div className="space-y-4 text-driftmood-brown">
              <div>
                <h4 className="font-medium">Ingredients</h4>
                <ul className="list-disc ml-6 text-sm">
                  {product.ingredients?.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium">Origin</h4>
                <p className="text-sm">{product.origin}</p>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-4 text-driftmood-brown">
              {reviews.map((r) => (
                <div key={r.id} className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{r.userName}</span>
                    <span className="text-xs">{r.date}</span>
                  </div>
                  <div className="text-sm">{r.comment}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;