import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { getAllOrders } from '@/api/orderApi';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  price: number;
  discountRate: number;
  category: string;
}

interface Order {
  id: string;
  date: string;
  customerName: string;
  totalAmount: number;
  status: 'pending' | 'completed' | 'cancelled';
  invoiceNumber: string;
  items: OrderItem[];
}

interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
  discount: number;
}

interface RevenueData {
  date: string;
  revenue: number;
}

const SalesManagerPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const navigate = useNavigate();

  const handlePriceChange = (productId: string, newPrice: number) => {
    setProducts(products.map(product =>
      product.id === productId ? { ...product, price: newPrice } : product
    ));
  };

  const handleDiscountChange = (productId: string, newDiscount: number) => {
    setProducts(products.map(product =>
      product.id === productId ? { ...product, discountRate: newDiscount } : product
    ));
  };

  const handleOrderStatusChange = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.dispatchEvent(new Event('storage'));
    navigate('/');
  };

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required. Please log in.');
        navigate('/login');
        return;
      }

      try {
        console.log('Fetching all orders...');
        const rawOrders = await getAllOrders(token);
        console.log('Received orders:', rawOrders);

        if (!Array.isArray(rawOrders)) {
          console.error('Invalid orders data received:', rawOrders);
          toast.error('Invalid data received from server');
          return;
        }

        const mappedOrders = rawOrders.map((order) => {
          console.log('Processing order:', order);
          return {
            id: order.order_id?.toString() ?? '',
            date: new Date(order.date).toLocaleDateString(),
            customerName: order.user_name || order.username || order.name || order.customerName || '',
            totalAmount: parseFloat(order.total_price),
            status: order.order_status,
            invoiceNumber: order.invoice_number || '',
            items: order.product_list || [],
          };
        });
        console.log('Mapped orders:', mappedOrders);
        setOrders(mappedOrders);
      } catch (err: any) {
        console.error('Error fetching orders:', err);
        if (err.response?.status === 401) {
          toast.error('Your session has expired. Please log in again.');
          navigate('/login');
        } else {
          toast.error(err.response?.data?.message || 'Failed to fetch orders. Please try again.');
        }
      }
    };
    fetchOrders();
  }, [navigate]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Sales Manager Dashboard</h1>
      
      <Tabs defaultValue="pricing" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pricing">Pricing & Discounts</TabsTrigger>
          <TabsTrigger value="orders">Orders & Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="pricing">
          <Card>
            <CardHeader>
              <CardTitle>Product Pricing & Discounts</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Current Price</TableHead>
                    <TableHead>Discount Rate</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>$</span>
                          <Input
                            type="number"
                            value={product.price}
                            onChange={(e) => handlePriceChange(product.id, Number(e.target.value))}
                            className="w-24"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={product.discountRate}
                            onChange={(e) => handleDiscountChange(product.id, Number(e.target.value))}
                            className="w-24"
                          />
                          <span>%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedProduct(product)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <div className="grid grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#8884d8"
                        name="Revenue"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Orders Table */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>{order.customerName}</TableCell>
                        <TableCell>${order.totalAmount}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              order.status === 'completed'
                                ? 'default'
                                : order.status === 'cancelled'
                                ? 'destructive'
                                : 'secondary'
                            }
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleOrderStatusChange(order.id, 'completed')}
                              disabled={order.status === 'completed'}
                            >
                              Complete
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleOrderStatusChange(order.id, 'cancelled')}
                              disabled={order.status === 'cancelled'}
                            >
                              Cancel
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalesManagerPage; 