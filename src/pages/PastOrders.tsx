import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ButtonCustom } from '@/components/ui/button-custom';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Package2, CheckCircle2, Truck, ClipboardList, Star, ChevronLeft, Download, RotateCcw, X } from 'lucide-react';
import { toast } from 'sonner';
import OrderReviewModal from '@/components/OrderReviewModal';
import { getOrdersByUser, getOrderInvoice } from '@/api/orderApi';
import { addComment } from "@/api/commentApi"; 
import { addRate, getRatesByUser } from "@/api/rateApi";

// RefundRequestModal inside same file
const RefundRequestModal = ({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void; }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-semibold mb-4 text-coffee-green">Request Refund</h2>
        <p className="text-coffee-brown mb-6">Are you sure you want to request a refund for this order?</p>
        <div className="flex justify-end gap-4">
          <ButtonCustom variant="outline" onClick={onClose}>
            Cancel
          </ButtonCustom>
          <ButtonCustom onClick={onConfirm}>
            Confirm Refund
          </ButtonCustom>
        </div>
      </div>
    </div>
  );
};

const PastOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewProduct, setReviewProduct] = useState<OrderProduct | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isProcessingRefund, setIsProcessingRefund] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundOrderId, setRefundOrderId] = useState<string | null>(null);

  const mapBackendStatus = (backendStatus: string): OrderStatus => {
    switch (backendStatus) {
      case 'processing': return 'Getting ready';
      case 'in-transit': return 'On the way';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return 'Ordered';
    }
  };

  const handleReviewClick = (order: Order, product: OrderProduct) => {
    setSelectedOrder(order);
    setReviewProduct(product);
    setShowReviewModal(true);
  };

  const handleSubmitReview = async (rating: number, comment: string) => {
    if (!reviewProduct) return;
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("You must be logged in to submit a review.");
      return;
    }
    try {
      if (comment.trim() !== "") {
        await addComment(token, Number(reviewProduct.id), comment);
        toast.success(`Review submitted for ${reviewProduct.name}!`);
      }
      await addRate(token, Number(reviewProduct.id), rating);

      setOrders(prev => prev.map(order => {
        if (order.id !== selectedOrder?.id) return order;
        return {
          ...order,
          products: order.products.map(p =>
            p.id === reviewProduct.id ? { ...p, reviewed: true, rating } : p
          ),
        };
      }));
      setShowReviewModal(false);
    } catch (err) {
      toast.error("Failed to submit review.");
    }
  };

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

    const fetchOrdersAndRatings = async () => {
      try {
        const rawOrders = await getOrdersByUser(token);
        const userRatings = await getRatesByUser(token);

        const ratingMap: Record<string, number> = {};
        userRatings.forEach((r: { product_id: number; rate: number }) => {
          ratingMap[r.product_id.toString()] = r.rate;
        });

        const mappedOrders: Order[] = rawOrders.map((order: any) => ({
          id: order.order_id.toString(),
          date: new Date(order.date).toISOString(),
          status: mapBackendStatus(order.order_status),
          isCancelled: order.order_status === 'cancelled',
          total: parseFloat(order.total_price),
          products: order.product_list.map((prod: any) => {
            const pid = prod.p_id;
            return {
              id: pid.toString(),
              name: prod.name,
              image: prod.image,
              price: parseFloat(prod.total_price),
              quantity: prod.quantity,
              grind: prod.grind,
              reviewed: pid in ratingMap,
              rating: ratingMap[pid] ?? undefined,
            };
          })
        }));

        setOrders(mappedOrders);
      } catch (err) {
        console.error("Error fetching orders or ratings:", err);
      }
    };

    fetchOrdersAndRatings();
  }, []);

  const handleDownloadInvoice = async (orderId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("You must be logged in to download invoices.");
      return;
    }

    setIsDownloading(true);
    try {
      const invoiceBase64 = await getOrderInvoice(token, orderId);
      if (!invoiceBase64) {
        toast.error("No invoice data received from server.");
        return;
      }
      const link = document.createElement('a');
      link.href = `data:application/pdf;base64,${invoiceBase64}`;
      link.download = `DriftMood-Order-${orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Invoice downloaded successfully!");
    } catch (error) {
      console.error("Download invoice error:", error);
      toast.error("Failed to download invoice. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleRefundRequest = async (orderId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("You must be logged in to request a refund.");
      return;
    }

    setIsProcessingRefund(true);
    try {
      // TODO: Implement real API call if needed
      toast.success("Refund request submitted successfully!");
    } catch (error) {
      console.error("Refund request error:", error);
      toast.error("Failed to submit refund request. Please try again.");
    } finally {
      setIsProcessingRefund(false);
    }
  };

  return (
    <>
      <div className="container mx-auto py-16 px-4">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link to="/profile" className="inline-flex items-center text-coffee-brown hover:text-coffee-green mb-4">
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
              >
                <Card className="bg-white shadow-sm">
                  <CardHeader className="border-b border-coffee-green/10">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                      <div>
                        <p className="text-sm text-coffee-brown">Order #{order.id}</p>
                        <CardTitle className="text-xl font-serif text-coffee-green">
                          {new Date(order.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </CardTitle>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-coffee-brown">Total: <span className="font-medium text-coffee-green">${order.total.toFixed(2)}</span></span>
                        <ButtonCustom
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                          onClick={() => handleDownloadInvoice(order.id)}
                          disabled={isDownloading}
                        >
                          <Download size={16} />
                          {isDownloading ? 'Downloading...' : 'Invoice'}
                        </ButtonCustom>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="mb-8">
                      <h3 className="text-lg font-medium mb-4 text-coffee-green">Order Status</h3>
                      <Progress value={getOrderProgress(order.status)} className="h-2" />
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4 text-coffee-green">Order Items</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead className="text-right">Review</TableHead>
                            <TableHead className="text-right">Refund</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {order.products.map((product) => (
                            <TableRow key={product.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-md" />
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
                                    <ButtonCustom size="sm" variant="outline" onClick={() => handleReviewClick(order, product)}>
                                      Add Review
                                    </ButtonCustom>
                                  )
                                ) : (
                                  <span className="text-coffee-brown text-sm">Available after delivery</span>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                {order.status === 'Delivered' ? (
                                  <ButtonCustom
                                    size="sm"
                                    variant="outline"
                                    className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                                    onClick={() => {
                                      setRefundOrderId(order.id);
                                      setShowRefundModal(true);
                                    }}
                                  >
                                    <RotateCcw size={16} className="mr-1" />
                                    Request Refund
                                  </ButtonCustom>
                                ) : (
                                  <span className="text-coffee-brown text-sm">Available after delivery</span>
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

      {showReviewModal && reviewProduct && (
        <OrderReviewModal
          product={reviewProduct}
          onClose={() => setShowReviewModal(false)}
          onSubmit={handleSubmitReview}
        />
      )}

      {showRefundModal && refundOrderId && (
        <RefundRequestModal
          onClose={() => {
            setShowRefundModal(false);
            setRefundOrderId(null);
          }}
          onConfirm={async () => {
            if (refundOrderId) {
              await handleRefundRequest(refundOrderId);
              setShowRefundModal(false);
              setRefundOrderId(null);
            }
          }}
        />
      )}
    </>
  );
};

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

const statusColors = {
  'Ordered': 'bg-amber-100 text-amber-800',
  'Getting ready': 'bg-blue-100 text-blue-800',
  'On the way': 'bg-purple-100 text-purple-800',
  'Delivered': 'bg-green-100 text-green-800',
  'Cancelled': 'bg-gray-300 text-gray-700',
};

export default PastOrders;
