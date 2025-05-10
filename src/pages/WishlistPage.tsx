import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getLocalWishlist, removeFromLocalWishlist } from '@/utils/wishlistUtils';
import { getAllProducts } from '@/api/productApi';
import ProductCard from '@/components/ProductCard';
import { motion } from 'framer-motion';
import { ButtonCustom } from '@/components/ui/button-custom';
import { Heart, ChevronLeft } from 'lucide-react';

const WishlistPage: React.FC = () => {
  const [wishlist, setWishlist] = useState([]);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchWishlistData = async () => {
      const savedWishlist = getLocalWishlist();
      try {
        const allProducts = await getAllProducts();
        const enrichedWishlist = savedWishlist.map(wishItem => {
          const fullData = allProducts.find(
            p => p.id === wishItem.productId || p.productId === wishItem.productId
          );
          return fullData ? { ...wishItem, ...fullData } : wishItem;
        });
        setWishlist(enrichedWishlist);
      } catch (error) {
        console.error('Failed to fetch full product list:', error);
        setWishlist(savedWishlist);
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

  const EmptyWishlist = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-10"
    >
      <div className="mx-auto w-24 h-24 rounded-full bg-coffee-green-light/30 flex items-center justify-center mb-6">
        <Heart size={36} className="text-coffee-green/70" />
      </div>
      <h2 className="text-2xl font-medium text-coffee-green mb-2">Your wishlist is empty</h2>
      <p className="text-coffee-brown mb-6 max-w-md mx-auto">
        You haven’t added any items to your wishlist yet. Browse our selection and mark your favorites.
      </p>
      <Link to="/products">
        <ButtonCustom>
          Browse Coffee
        </ButtonCustom>
      </Link>
    </motion.div>
  );

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link to="/" className="mr-2">
              <ButtonCustom variant="ghost" size="sm" className="gap-1">
                <ChevronLeft size={16} />
                <span>Back</span>
              </ButtonCustom>
            </Link>
            <h1 className="text-2xl md:text-3xl font-semibold text-coffee-green">Your Wishlist</h1>
          </div>

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
          <EmptyWishlist />
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
      </motion.div>
    </div>
  );
};

export default WishlistPage;