import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ChevronLeft, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import CartItem from '@/components/CartItem';
import CartSummary from '@/components/CartSummary';
import { ButtonCustom } from '@/components/ui/button-custom';
import { getCart } from '@/api/cartApi'; 


// Mock data for initial cart items - these will be replaced with localStorage items
const initialCartItems = [
  {
    id: '1',
    name: 'Ethiopian Yirgacheffe',
    price: 16.99,
    image: 'https://images.unsplash.com/photo-1559525839-8b57ebc0c0d3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8Y29mZmVlJTIwYmFnfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
    quantity: 1,
    grind: 'Whole Bean'
  },
  {
    id: '2',
    name: 'Colombian Supremo',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1610889556528-9a770e32642f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGNvZmZlZSUyMGJhZ3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
    quantity: 2,
    grind: 'Espresso'
  },
  {
    id: '3',
    name: 'Sumatra Dark Roast',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Y29mZmVlJTIwYmFnfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
    quantity: 1,
    grind: 'French Press'
  },
  {
    id: '4',
    name: 'Guatemalan Antigua',
    price: 17.99,
    image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fGNvZmZlZSUyMGJhZ3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
    quantity: 1,
    grind: 'Pour Over'
  },
  {
    id: '5',
    name: 'Costa Rican Tarrazu',
    price: 15.49,
    image: 'https://images.unsplash.com/photo-1595981234058-a9659694a15f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTV8fGNvZmZlZSUyMGJhZ3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
    quantity: 2,
    grind: 'Drip'
  },
  {
    id: '6',
    name: 'Kenya AA',
    price: 18.99,
    image: 'https://images.unsplash.com/photo-1580933073521-dc49ac0d4e6a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fGNvZmZlZSUyMGJhZ3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
    quantity: 1,
    grind: 'Whole Bean'
  },
  {
    id: '7',
    name: 'Brazilian Santos',
    price: 13.99,
    image: 'https://images.unsplash.com/photo-1603396100018-5b2cc4c85de0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjJ8fGNvZmZlZSUyMGJhZ3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
    quantity: 3,
    grind: 'Espresso'
  },
  {
    id: '8',
    name: 'Tanzanian Peaberry',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1559525839-f61f18810673?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mjh8fGNvZmZlZSUyMGJhZ3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
    quantity: 1,
    grind: 'French Press'
  },
  {
    id: '9',
    name: 'Mexican Chiapas',
    price: 14.49,
    image: 'https://images.unsplash.com/photo-1598512752271-33f913a5af13?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mjl8fGNvZmZlZSUyMGJhZ3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
    quantity: 2,
    grind: 'Pour Over'
  },
  {
    id: '10',
    name: 'Jamaican Blue Mountain',
    price: 32.99,
    image: 'https://images.unsplash.com/photo-1614121236009-17211d4773b1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzF8fGNvZmZlZSUyMGJhZ3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
    quantity: 1,
    grind: 'Whole Bean'
  },
  {
    id: '11',
    name: 'Hawaiian Kona',
    price: 28.99,
    image: 'https://images.unsplash.com/photo-1581996323777-9a97f3bd0064?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzN8fGNvZmZlZSUyMGJhZ3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
    quantity: 1,
    grind: 'Drip'
  },
  {
    id: '12',
    name: 'Vietnamese Robusta',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1609771100835-f41a0e2213a0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzV8fGNvZmZlZSUyMGJhZ3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
    quantity: 2,
    grind: 'Espresso'
  },
  {
    id: '13',
    name: 'Peru Organic',
    price: 16.49,
    image: 'https://images.unsplash.com/photo-1620820186187-fc32e79adb74?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mzd8fGNvZmZlZSUyMGJhZ3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
    quantity: 1,
    grind: 'Pour Over'
  }
];

const Cart = () => {
  /*
  // Get cart items from localStorage or use mock data if none exist
  const getCartItems = () => {
    const storedItems = localStorage.getItem('cartItems');
    return storedItems ? JSON.parse(storedItems) : initialCartItems;
  };*/

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true);

      if (token && token !== '') {
        try {
          const backendCart = await getCart(token);
          setCartItems(backendCart); // assuming backendCart is an array of items
          console.log("Cart items is set!", backendCart);
        } catch (error) {
          console.error('Error fetching cart:', error);
          toast.error('Failed to load cart');
        }
      } else {
        // No token = not logged in = empty cart
        setCartItems([]);
      }
      setIsLoading(false);
    };

    loadCart();
  }, [token]);

  /*
  // Save cart items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    // Dispatch storage event to notify other tabs/components
    window.dispatchEvent(new Event('storage'));
  }, [cartItems]);*/

  const handleRemoveItem = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const handleQuantityChange = (id: string, newQuantity: number) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
    toast.success('Cart cleared');
  };

  const handleCheckout = () => {
    toast.success('Proceeding to checkout...');
    // In a real app, navigate to checkout page
  };

  // Calculate cart totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax rate
  const shipping = subtotal > 35 ? 0 : 5.99;
  const total = subtotal + tax + shipping;

  // Empty cart UI
  const EmptyCart = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-10"
    >
      <div className="mx-auto w-24 h-24 rounded-full bg-coffee-green-light/30 flex items-center justify-center mb-6">
        <ShoppingCart size={36} className="text-coffee-green/70" />
      </div>
      <h2 className="text-2xl font-medium text-coffee-green mb-2">Your cart is empty</h2>
      <p className="text-coffee-brown mb-6 max-w-md mx-auto">Looks like you haven't added any coffee to your cart yet. Browse our selection and discover your perfect cup.</p>
      <Link to="/shop">
        <ButtonCustom>
          Browse Coffee
        </ButtonCustom>
      </Link>
    </motion.div>
  );

  // Loading skeleton
  const CartSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="p-4 rounded-lg bg-white border border-coffee-green/10 animate-pulse">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gray-200 rounded-md"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="w-8 h-4 bg-gray-200 rounded"></div>
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
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
              <h1 className="text-2xl md:text-3xl font-semibold text-coffee-green">Your Cart</h1>
            </div>
            
            {cartItems.length > 0 && !isLoading && (
              <ButtonCustom 
                variant="ghost" 
                size="sm"
                onClick={handleClearCart}
              >
                Clear All
              </ButtonCustom>
            )}
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              {isLoading ? (
                <CartSkeleton />
              ) : cartItems.length === 0 ? (
                <EmptyCart />
              ) : (
                <AnimatePresence>
                  {cartItems.map(({ product, count }) => (
              <CartItem
                key={product.id} // unique key now
                id={product.id.toString()} // assuming your CartItem expects string id
                name={product.name}
                price={Number(product.price) || 0}
                image={product.image || '/default.jpg'} // fallback if needed
                quantity={count}
                grind={product.grind} // optional
                onRemove={handleRemoveItem}
                onQuantityChange={handleQuantityChange}
              />
            ))}
                </AnimatePresence>
              )}
              
              {!isLoading && cartItems.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center mt-4 p-4 rounded-lg bg-coffee-green-light/30 text-coffee-green"
                >
                  <AlertCircle size={20} className="mr-2 flex-shrink-0" />
                  <p className="text-sm">
                    Free shipping on orders over $35!
                  </p>
                </motion.div>
              )}
            </div>
            
            {!isLoading && cartItems.length > 0 && (
              <div className="md:col-span-1">
                <CartSummary 
                  subtotal={subtotal}
                  tax={tax}
                  shipping={shipping}
                  total={total}
                  onCheckout={handleCheckout}
                />
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Cart;
