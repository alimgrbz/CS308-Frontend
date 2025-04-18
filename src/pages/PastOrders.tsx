
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ButtonCustom } from '@/components/ui/button-custom';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Package2, CheckCircle2, Truck, ClipboardList, Star, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import OrderReviewModal from '@/components/OrderReviewModal';
import { getOrdersByUser } from '@/api/orderApi';

const PastOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewProduct, setReviewProduct] = useState<OrderProduct | null>(null);

  // Map backend status values to frontend display text
const mapBackendStatus = (backendStatus: string): OrderStatus => {
  switch (backendStatus) {
    case 'processing':
      return 'Getting ready';
    case 'in-transit':
      return 'On the way';
    case 'delivered':
      return 'Delivered';
    case 'cancelled':
      return 'Cancelled'; 
    default:
      return 'Ordered'; // fallback
  }
};

  const handleReviewClick = (order: Order, product: OrderProduct) => {
    setSelectedOrder(order);
    setReviewProduct(product);
    setShowReviewModal(true);
  };

  const handleSubmitReview = (rating: number, comment: string) => {
    toast.success(`Review submitted for ${reviewProduct?.name}!`);
    setShowReviewModal(false);
  };

  // Function to get the current status progress percentage
  const getOrderProgress = (status: OrderStatus) => {
    switch (status) {
      case 'Ordered': return 25;
      case 'Getting ready': return 50;
      case 'On the way': return 75;
      case 'Delivered': return 100;
      default: return 0;
    }
  };
  
  useEffect(() => {
  const token = localStorage.getItem('token');
  if (!token) return;

  const fetchOrders = async () => {
    try {
      const rawOrders = await getOrdersByUser(token);

      // Convert backend response format into the shape your component expects
      const mappedOrders: Order[] = rawOrders.map((order: any) => ({
        id: order.order_id.toString(),
        date: new Date(order.date).toISOString(),
        status: mapBackendStatus(order.order_status),
        isCancelled: order.order_status === 'cancelled',
        total: parseFloat(order.total_price),
        products: order.product_list.map((prod: any) => ({
          id: prod.p_id.toString(),
          name: prod.name,
        image: prod.image,
          price: parseFloat(prod.total_price),
          quantity: prod.quantity,
          reviewed: false, // default until review API is integrated
        }))
      }));

      setOrders(mappedOrders);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  fetchOrders();
}, []);

  

  return (
    <>
     
      <div className="container mx-auto py-16 px-4">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link 
            to="/profile" 
            className="inline-flex items-center text-coffee-brown hover:text-coffee-green mb-4"
          >
            <ChevronLeft size={18} />
            <span>Back to Profile</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-coffee-green">
            Past Orders
          </h1>
          <p className="text-coffee-brown">
            View and manage your previous orders
          </p>
        </motion.div>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-coffee-brown mb-4">You haven't placed any orders yet.</p>
            <Link to="/shop">
              <ButtonCustom>Browse Products</ButtonCustom>
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                id={order.id}
              >
                <Card className="bg-white shadow-sm">
                  <CardHeader className="border-b border-coffee-green/10">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                      <div>
                        <p className="text-sm text-coffee-brown">Order #{order.id}</p>
                        <CardTitle className="text-xl font-serif text-coffee-green">
                          {new Date(order.date).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </CardTitle>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-coffee-brown">Total: <span className="font-medium text-coffee-green">${order.total.toFixed(2)}</span></span>
                        
                        
                        
                        <div className="flex items-center gap-2">
  <span 
    className={`px-3 py-1 rounded-full text-xs font-medium ${
      statusColors[order.status]
    }`}
  >
    {order.status}
  </span>
</div>



                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    {/* Status Progress Bar */}
                    <div className="mb-8">
                      <h3 className="text-lg font-medium mb-4 text-coffee-green">Order Status</h3>
                      <div className="relative">
                        <Progress value={getOrderProgress(order.status)} className="h-2" />
                        <div className="flex justify-between mt-2">
                          <div className={`flex flex-col items-center ${order.status === 'Ordered' || order.status === 'Getting ready' || order.status === 'On the way' || order.status === 'Delivered' ? 'text-coffee-green' : 'text-coffee-brown'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${order.status === 'Ordered' || order.status === 'Getting ready' || order.status === 'On the way' || order.status === 'Delivered' ? 'bg-coffee-green text-white' : 'bg-gray-200'}`}>
                              <ClipboardList size={16} />
                            </div>
                            <span className="text-xs mt-1">Ordered</span>
                          </div>
                          <div className={`flex flex-col items-center ${order.status === 'Getting ready' || order.status === 'On the way' || order.status === 'Delivered' ? 'text-coffee-green' : 'text-coffee-brown'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${order.status === 'Getting ready' || order.status === 'On the way' || order.status === 'Delivered' ? 'bg-coffee-green text-white' : 'bg-gray-200'}`}>
                              <Package2 size={16} />
                            </div>
                            <span className="text-xs mt-1">Getting Ready</span>
                          </div>
                          <div className={`flex flex-col items-center ${order.status === 'On the way' || order.status === 'Delivered' ? 'text-coffee-green' : 'text-coffee-brown'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${order.status === 'On the way' || order.status === 'Delivered' ? 'bg-coffee-green text-white' : 'bg-gray-200'}`}>
                              <Truck size={16} />
                            </div>
                            <span className="text-xs mt-1">On the Way</span>
                          </div>
                          <div className={`flex flex-col items-center ${order.status === 'Delivered' ? 'text-coffee-green' : 'text-coffee-brown'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${order.status === 'Delivered' ? 'bg-coffee-green text-white' : 'bg-gray-200'}`}>
                              <CheckCircle2 size={16} />
                            </div>
                            <span className="text-xs mt-1">Delivered</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Items Table */}
                    <div>
                      <h3 className="text-lg font-medium mb-4 text-coffee-green">Order Items</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead className="text-right">Review</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {order.products.map((product) => (
                            <TableRow key={product.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <div className="relative w-12 h-12 rounded-md overflow-hidden bg-coffee-green-light/30 flex-shrink-0">
                                    <img
                                      src={product.image}
                                      alt={product.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <div className="font-medium text-coffee-green">{product.name}</div>
                                    {product.grind && <div className="text-sm text-coffee-brown">Grind: {product.grind}</div>}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{product.quantity}</TableCell>
                              <TableCell>${product.price.toFixed(2)}</TableCell>
                              <TableCell className="text-right">
                                {order.status === 'Delivered' ? (
                                  product.reviewed ? (
                                    <div className="inline-flex items-center text-coffee-green">
                                      <Star size={16} className="fill-coffee-green mr-1" />
                                      <span>{product.rating}/5</span>
                                    </div>
                                  ) : (
                                    <ButtonCustom
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleReviewClick(order, product)}
                                    >
                                      Add Review
                                    </ButtonCustom>
                                  )
                                ) : (
                                  <span className="text-coffee-brown text-sm">
                                    Available after delivery
                                  </span>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && reviewProduct && (
        <OrderReviewModal
          product={reviewProduct}
          onClose={() => setShowReviewModal(false)}
          onSubmit={handleSubmitReview}
        />
      )}
    </>
  );
};

// Types for the orders
type OrderStatus = 'Ordered' | 'Getting ready' | 'On the way' | 'Delivered' | 'Cancelled';

interface OrderProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  grind?: string;
  reviewed?: boolean;
  rating?: number;
}

interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  total: number;
  products: OrderProduct[];
}

// Status colors for badges
const statusColors = {
  'Ordered': 'bg-amber-100 text-amber-800',
  'Getting ready': 'bg-blue-100 text-blue-800',
  'On the way': 'bg-purple-100 text-purple-800',
  'Delivered': 'bg-green-100 text-green-800',
  'Cancelled': 'bg-gray-300 text-gray-700'
};

export default PastOrders;