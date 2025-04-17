import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import CheckoutForm from '@/components/CheckoutForm';
import OrderSummary from '@/components/OrderSummary';

const Checkout = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const [userData, setUserData] = useState<{ fullName?: string; email?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get user data from localStorage (simulating authentication)
  useEffect(() => {
    const getUserData = () => {
      // In a real app, this would come from your auth provider
      const storedUser = localStorage.getItem('userData');
      if (storedUser) {
        setUserData(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };
    
    getUserData();
  }, []);
  
  // Get cart items from localStorage
  const getCartItems = () => {
    const storedItems = localStorage.getItem('cartItems');
    return storedItems ? JSON.parse(storedItems) : [];
  };

  const cartItems = getCartItems();
  
  // Calculate cart totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax rate
  const shipping = subtotal > 35 ? 0 : 5.99;
  const total = subtotal + tax + shipping;
  
  const handlePlaceOrder = async (formData) => {
    console.log("handle place order");
    setIsProcessing(true);
    
    try {
      // This would be replaced with an actual payment processing API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Save order details for the receipt
      const orderDetails = {
        items: cartItems,
        subtotal,
        tax,
        shipping,
        total,
        customerInfo: formData,
        date: new Date().toISOString()
      };
      localStorage.setItem('lastOrder', JSON.stringify(orderDetails));
      
      // Clear the cart
      localStorage.setItem('cartItems', JSON.stringify([]));
      window.dispatchEvent(new Event('storage'));

      // Send receipt email (would be handled by a backend service)
      console.log('Sending receipt email to:', formData.email);
      
      toast.success('Order placed successfully! Check your email for confirmation.');
      navigate('/order-success');
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Redirect if cart is empty
  if (cartItems.length === 0) {
    return (
      <>
        <div className="container mx-auto py-16 px-4 text-center">
          <h2 className="text-2xl font-medium text-coffee-green mb-4">Your cart is empty</h2>
          <p className="mb-4">You need to add items to your cart before checkout.</p>
          <button 
            onClick={() => navigate('/shop')}
            className="bg-coffee-green text-white px-4 py-2 rounded-md"
          >
            Browse Products
          </button>
        </div>
      </>
    );
  }
  
  if (isLoading) {
    return (
      <>
        <div className="container mx-auto py-16 px-4 text-center">
          <p>Loading...</p>
        </div>
      </>
    );
  }
  
  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl md:text-3xl font-semibold text-coffee-green mb-8">Checkout</h1>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <CheckoutForm 
                onSubmit={handlePlaceOrder} 
                isProcessing={isProcessing}
                userData={userData}
              />
            </div>
            
            <div className="md:col-span-1">
              <OrderSummary 
                cartItems={cartItems}
                subtotal={subtotal}
                tax={tax}
                shipping={shipping}
                total={total}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Checkout;