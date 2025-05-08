import React, { useEffect, useState } from 'react';
import { getLocalWishlist, removeFromLocalWishlist } from '@/utils/wishlistUtils';
import ProductCard from '@/components/ProductCard';

const WishlistPage: React.FC = () => {
  const [wishlist, setWishlist] = useState([]);

  // Load wishlist initially and when it’s updated
  useEffect(() => {
    const loadWishlist = () => {
      const savedWishlist = getLocalWishlist();
      setWishlist(savedWishlist);
    };

    loadWishlist();
    window.addEventListener('wishlist-updated', loadWishlist);

    return () => {
      window.removeEventListener('wishlist-updated', loadWishlist);
    };
  }, []);

  const handleRemove = (productId: number) => {
    removeFromLocalWishlist(productId);
    const updated = getLocalWishlist();
    setWishlist(updated);
  };

  return (
    <div className="min-h-screen bg-driftmood-cream py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-2xl font-semibold mb-6 text-driftmood-dark">Your Wishlist</h2>
        {wishlist.length === 0 ? (
          <p className="text-driftmood-brown">Your wishlist is empty.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <div key={product.productId} className="relative">
                <ProductCard product={product} isTopThree={false} />
                <button
                  onClick={() => handleRemove(product.productId)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs hover:bg-red-600 transition"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;