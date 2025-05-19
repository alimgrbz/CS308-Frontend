import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getWishlist, removeProductFromWishlist } from '@/api/wishlistApi';
import { getAllProducts } from '@/api/productApi';
import ProductCard from '@/components/ProductCard';
import { motion } from 'framer-motion';
import { ButtonCustom } from '@/components/ui/button-custom';
import { Heart, ChevronLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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
  [key: string]: any;
}

const WishlistPage: React.FC = () => {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [editMode, setEditMode] = useState(false);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
const fetchWishlist = async () => {
  if (!token) return;

  try {
    const productIds = await getWishlist(token); // This is already the array [1, 2, 3, ...]

    const allProducts = await getAllProducts();
const enriched = productIds
  .map((id) => {
    const product = allProducts.find((p) => p.id === id);
    if (!product) return null;

    return {
      ...product,
      productId: product.id, // ✅ Fixes the undefined bug
    };
  })
  .filter(Boolean);

setWishlist(enriched);
console.log("Wishlist IDs:", productIds);
console.log("Enriched Products:", enriched);
  } catch (err) {
    console.error('Failed to fetch wishlist:', err);
    toast({ title: 'Error', description: 'Could not load wishlist.', variant: 'destructive' });
  }
};

    fetchWishlist();
    window.addEventListener('wishlist-updated', fetchWishlist);
    return () => window.removeEventListener('wishlist-updated', fetchWishlist);
  }, [token]);

  const handleRemove = async (productId: number) => {
    console.log("Removing from wishlist:", productId);
    if (!token) return;

    try {
      await removeProductFromWishlist(token, productId);
      setWishlist(prev => prev.filter(p => p.productId !== productId));
      toast({ title: 'Removed', description: 'Item removed from wishlist.' });
    } catch (err) {
      console.error('Remove failed:', err);
      toast({ title: 'Error', description: 'Could not remove item.', variant: 'destructive' });
    }
  };

  const EmptyState = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10">
      <div className="mx-auto w-24 h-24 rounded-full bg-coffee-green-light/30 flex items-center justify-center mb-6">
        <Heart size={36} className="text-coffee-green/70" />
      </div>
      <h2 className="text-2xl font-medium text-coffee-green mb-2">Your wishlist is empty</h2>
      <p className="text-coffee-brown mb-6 max-w-md mx-auto">
        {token ? 'You haven’t added any items yet.' : 'Please sign in to view your wishlist.'}
      </p>
      <Link to={token ? '/products' : '/signin'}>
        <ButtonCustom>{token ? 'Browse Products' : 'Sign In'}</ButtonCustom>
      </Link>
    </motion.div>
  );

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
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
          <EmptyState />
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