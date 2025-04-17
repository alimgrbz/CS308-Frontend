
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package } from 'lucide-react';
import { ButtonCustom } from '@/components/ui/button-custom';

const OrderSuccess = () => {
  // Generate a random order ID
  const orderId = `ORD-${Math.floor(10000000 + Math.random() * 90000000)}`;
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    // Get user email if logged in
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsedData = JSON.parse(userData);
      setUserEmail(parsedData.email);
    }
    
    // Dispatch storage event to ensure cart is updated across tabs
    window.dispatchEvent(new Event('storage'));
  }, []);

  return (
    <>
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="inline-flex items-center justify-center p-4 bg-green-100 rounded-full mb-6">
            <CheckCircle size={60} className="text-green-600" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-coffee-green mb-4">
            Order Successfully Placed!
          </h1>
          
          <p className="text-xl text-coffee-brown mb-2">
            Thank you for your purchase
          </p>
          
          <p className="text-coffee-brown mb-8">
            {userEmail ? 
              `We've sent a confirmation and receipt to ${userEmail}.` :
              `We've sent a confirmation and receipt to your email address.`
            }
          </p>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-coffee-green/10 mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Package size={24} className="text-coffee-green" />
              <h2 className="text-xl font-semibold text-coffee-green">Order Details</h2>
            </div>
            
            <p className="text-coffee-brown mb-1">Order ID: <span className="font-medium">{orderId}</span></p>
            <p className="text-coffee-brown">Estimated Delivery: <span className="font-medium">3-5 business days</span></p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/shop">
              <ButtonCustom variant="outline">
                Continue Shopping
              </ButtonCustom>
            </Link>
            
            <Link to="/past-orders">
              <ButtonCustom>
                View Order History
              </ButtonCustom>
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default OrderSuccess;