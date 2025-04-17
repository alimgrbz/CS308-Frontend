import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface OrderSummaryProps {
  cartItems: any[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

const OrderSummary = ({ cartItems, subtotal, tax, shipping, total }: OrderSummaryProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-serif text-coffee-green">Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-8">
            <p className="text-coffee-brown text-lg">No items in cart</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default OrderSummary; 