import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, Download } from 'lucide-react';
import { ButtonCustom } from '@/components/ui/button-custom';
import jsPDF from 'jspdf';

const OrderSuccess = () => {
  // Generate a random order ID
  const orderId = `ORD-${Math.floor(10000000 + Math.random() * 90000000)}`;
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    // Get user email and order details if logged in
    const userData = localStorage.getItem('userData');
    const orderData = localStorage.getItem('lastOrder');
    
    if (userData) {
      const parsedData = JSON.parse(userData);
      setUserEmail(parsedData.email);
    }
    
    if (orderData) {
      setOrderDetails(JSON.parse(orderData));
    }
    
    // Dispatch storage event to ensure cart is updated across tabs
    window.dispatchEvent(new Event('storage'));
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Add logo or header
    doc.setFontSize(20);
    doc.setTextColor(47, 109, 90); // coffee-green color
    doc.text('DriftMood Coffee', pageWidth / 2, 20, { align: 'center' });
    
    // Add order details
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Order Confirmation', pageWidth / 2, 40, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Order ID: ${orderId}`, 20, 60);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 70);
    if (userEmail) {
      doc.text(`Customer Email: ${userEmail}`, 20, 80);
    }
    
    // Add order summary if available
    if (orderDetails) {
      doc.text('Order Summary:', 20, 100);
      let yPos = 110;
      
      if (orderDetails.items) {
        orderDetails.items.forEach((item: any) => {
          doc.text(`${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`, 30, yPos);
          yPos += 10;
        });
      }
      
      // Add totals
      doc.text(`Subtotal: $${orderDetails.subtotal?.toFixed(2) || '0.00'}`, 20, yPos + 20);
      doc.text(`Tax: $${orderDetails.tax?.toFixed(2) || '0.00'}`, 20, yPos + 30);
      doc.text(`Shipping: $${orderDetails.shipping?.toFixed(2) || '0.00'}`, 20, yPos + 40);
      doc.text(`Total: $${orderDetails.total?.toFixed(2) || '0.00'}`, 20, yPos + 50);
    }
    
    // Add footer
    doc.setFontSize(10);
    doc.text('Thank you for shopping with DriftMood Coffee!', pageWidth / 2, 260, { align: 'center' });
    doc.text('For any questions, please contact support@driftmood.com', pageWidth / 2, 270, { align: 'center' });
    
    // Save the PDF
    doc.save(`DriftMood-Order-${orderId}.pdf`);
  };

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
            <ButtonCustom asChild>
              <Link to="/products">Continue Shopping</Link>
            </ButtonCustom>
            
            <ButtonCustom
              variant="outline"
              onClick={generatePDF}
              className="flex items-center gap-2"
            >
              <Download size={18} />
              Download Receipt
            </ButtonCustom>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default OrderSuccess;