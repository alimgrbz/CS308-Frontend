import React, { useEffect, useState } from 'react';
import { getLocalWishlist, removeFromLocalWishlist } from '@/utils/wishlistUtils';
import ProductCard from '@/components/ProductCard';
import { getAllCategories } from '@/api/categoryApi';

const WishlistPage: React.FC = () => {
  const [wishlist, setWishlist] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchWishlistAndCategories = async () => {
      const savedWishlist = getLocalWishlist();
      const categoryList = await getAllCategories();
      setWishlist(savedWishlist);
      setCategories(categoryList);
    };

    fetchWishlistAndCategories();

    window.addEventListener('wishlist-updated', fetchWishlistAndCategories);
    return () => {
      window.removeEventListener('wishlist-updated', fetchWishlistAndCategories);
    };
  }, []);

  const getCategoryName = (categoryId: number): string => {
    const category = categories.find(cat => cat.categoryId === categoryId);
    return category ? category.categoryType : "Unknown";
  };

  const handleRemove = (productId: number) => {
    removeFromLocalWishlist(productId);
    const updated = getLocalWishlist();
    setWishlist(updated);
  };

  return (
    <div className="min-h-screen bg-driftmood-cream py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-driftmood-dark">Your Wishlist</h2>
          <button
            onClick={() => setEditMode(!editMode)}
            className="bg-driftmood-lime text-driftmood-dark px-4 py-2 rounded hover:bg-lime-300 transition"
          >
            {editMode ? 'Done' : 'Edit'}
          </button>
        </div>

        {wishlist.length === 0 ? (
          <p className="text-driftmood-brown">Your wishlist is empty.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <div key={product.productId} className="relative group">
                <ProductCard
                  product={{
                    ...product,
                    categoryType: getCategoryName(product.categoryId),
                  }}
                  isTopThree={false}
                />
                {editMode && (
                  <button
                    onClick={() => handleRemove(product.productId)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition opacity-90"
                    title="Remove from wishlist"
                  >
                    &times;
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
