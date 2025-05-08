import React, { useEffect, useState } from 'react';
import { getLocalWishlist, removeFromLocalWishlist } from '@/utils/wishlistUtils';
import { getAllProducts } from '@/api/productApi';
import ProductCard from '@/components/ProductCard';

const WishlistPage: React.FC = () => {
  const [wishlist, setWishlist] = useState([]);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchWishlistData = async () => {
      const savedWishlist = getLocalWishlist();

      try {
        const allProducts = await getAllProducts();

        // Merge full data into wishlist items
        const enrichedWishlist = savedWishlist.map(wishItem => {
          const fullData = allProducts.find(p =>
            p.id === wishItem.productId || p.productId === wishItem.productId
          );
          return fullData ? { ...wishItem, ...fullData } : wishItem;
        });

        setWishlist(enrichedWishlist);
      } catch (error) {
        console.error('Failed to fetch full product data:', error);
        setWishlist(savedWishlist); // Fallback if API fails
      }
    };

    fetchWishlistData();

    window.addEventListener('wishlist-updated', fetchWishlistData);
    return () => window.removeEventListener('wishlist-updated', fetchWishlistData);
  }, []);

  const handleRemove = (productId: number) => {
    removeFromLocalWishlist(productId);
    setWishlist(prev => prev.filter(item => item.productId !== productId));
  };

  return (
    <div className="min-h-screen bg-driftmood-cream py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-driftmood-dark">Your Wishlist</h2>
          {wishlist.length > 0 && (
            <button
              onClick={() => setEditMode(!editMode)}
              className="bg-lime-200 text-driftmood-dark px-4 py-2 rounded hover:bg-lime-300 transition"
            >
              {editMode ? 'Done' : 'Edit'}
            </button>
          )}
        </div>

        {wishlist.length === 0 ? (
          <p className="text-driftmood-brown">Your wishlist is empty.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <div key={product.productId} className="relative">
                <ProductCard product={product} isTopThree={false} />
                {editMode && (
                  <button
                    onClick={() => handleRemove(product.productId)}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 transition"
                    title="Remove"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;