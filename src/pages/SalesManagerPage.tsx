import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { getAllCategories } from '@/api/categoryApi';
import { getAllProducts, getProductsByCategory, setPrice, setDiscount } from '@/api/productApi';
import { getAllOrders, getOrdersByUser, getOrderInvoice, getRevenueGraph} from '@/api/orderApi';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  price: number;
  discountRate: number;
  category: string;
}

interface Category {
  id: number;
  name: string;
}

interface Order {
  id: string;
  date: string;
  customerName: string;
  totalAmount: number;
  status: string;
  invoiceNumber: string;
  address: string; 
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

interface Refund {
  id: number;
  userName: string;
  userEmail: string;
  orderId: string;
  reason: string;
  status: number; // 0 = pending, 1 = approved, 2 = rejected
  createdAt: string;
}


  const SalesManagerPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    fetchProducts();
    fetchAllOrders();
    fetchOrders();
    fetchRefunds();
  
    if (startDate && endDate) {
      fetchRevenueData(startDate, endDate);
    }
  }, [startDate, endDate]);
  
  
  const fetchRefunds = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("No token found. Please log in again.");
        return;
      }
      const response = await fetch('http://localhost:5000/api/orders/refundRequests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      const data = await response.json();
      if (response.ok) {
        setRefunds(data.refunds || []);
      } else {
        toast.error(data.message || "Failed to fetch refund requests.");
      }
    } catch (error) {
      toast.error("An error occurred while fetching refunds.");
    }
  };
  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories');
    }
  };

  const fetchProducts = async () => {
    try {
      console.log('🔁 fetchProducts started');
      const data = await getAllProducts();
      console.log('📦 Received products:', data);
      setProducts(data);
    } catch (error) {
      console.error('🚨 Error fetching products:', error);
      toast.error('Failed to fetch products');
    }
  };

  const fetchRevenueData = async (start: string, end: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("You must be logged in to fetch revenue data.");
        return;
      }
  
      const data = await getRevenueGraph(token, start, end);
      setRevenueData(data);
      console.log("📊 Revenue API Response:", data);
      toast.success("Revenue data loaded.");
    } catch (error) {
      console.error("❌ Error fetching revenue data:", error);
      toast.error("Failed to load revenue data.");
    }
  };
  
  const handleRefundAction = async (orderId: number, accept: boolean) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      if (accept) {
        await acceptRefund({ token, orderId });
        toast.success('Refund accepted successfully.');
      } else {
        await cancelOrder({ token, orderId });
        toast.success('Order cancelled successfully.');
      }
      fetchRefunds();
    } catch (error) {
      toast.error('Failed to process refund action.');
    }
  };
  
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const rawOrders = await getAllOrders(token);
      const mappedOrders = rawOrders.map((order: any) => ({
        id: order.order_id?.toString() ?? '',
        date: new Date(order.date).toISOString().split("T")[0], // ✅ format: '2025-05-14'
        customerName: order.user_name || order.username || order.name || order.customerName || '',
        totalAmount: parseFloat(order.total_price),
        status: order.order_status,
        address: order.address || '', // ✅ ADD THIS
        invoiceNumber: order.invoice_number || '',
        items: order.product_list || [],
      }));
      
      setOrders(mappedOrders);
    } catch (error) {
      console.error('Failed to fetch orders');
    }
  };

  const fetchAllOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
      const rawOrders = await getOrdersByUser(token);
      const mappedOrders = rawOrders.map((order: any) => ({
        id: order.order_id?.toString() ?? '',
        date: new Date(order.date).toISOString(),
        status: order.order_status,
        total: parseFloat(order.total_price),
        products: order.product_list.map((prod: any) => ({
          id: prod.p_id?.toString() ?? '',
          name: prod.name,
          image: prod.image,
          price: parseFloat(prod.total_price),
          quantity: prod.quantity,
          grind: prod.grind,
        })),
        userEmail: order.user_email || order.email || '',
        userName: order.user_name || order.username || order.name || '',
      }));
      setAllOrders(mappedOrders);
      if (mappedOrders.length > 0) {
        const dates = mappedOrders.map(o => new Date(o.date));
        const minDate = new Date(Math.min(...dates));
        const maxDate = new Date(Math.max(...dates));
        setStartDate(minDate.toISOString().split("T")[0]);
        setEndDate(maxDate.toISOString().split("T")[0]);
      }

      // Backend doesnt have the functionalities yet:
      //setStartDate(minDate.toISOString().split("T")[0]); // YYYY-MM-DD
      //setEndDate(maxDate.toISOString().split("T")[0]);
      
    } catch (err) {
      toast.error('Failed to fetch orders');
    } finally {
      setIsLoadingOrders(false);
    }
  };
  

  const fetchProductsByCategoryName = async (name: string) => {
    try {
      const matched = categories.find(c => c.name === name);
      if (!matched) return;
      const data = await getProductsByCategory(matched.id);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching category products:', error);
      toast.error('Failed to fetch category products');
    }
  };
  const handlePriceChange = async (productId: string, newPrice: number) => {
    try {
      const token = localStorage.getItem('token');
      const target = products.find(p => p.id === productId);
      if (!target) {
        toast.error("Product not found.");
        return;
      }
  
      await setPrice({ token, productId, price: newPrice });
  
      setProducts(products.map(product =>
        product.id === productId ? { ...product, price: newPrice } : product
      ));
      toast.success("Price updated successfully.");
    } catch (error) {
      console.error("❌ Error in handlePriceChange:", error.response || error.message || error);

      toast.error('Failed to update price');
    }
  };
  const handleDiscountChange = async (productId: string, newDiscount: number) => {
    try {
      const token = localStorage.getItem('token');
      await setDiscount(token, productId, newDiscount);
      toast.success("Discount submitted successfully.");
  
      // Optional: visually update the discount in UI
      setProducts(products.map(product =>
        product.id === productId ? { ...product, discountRate: newDiscount } : product
      ));
    } catch (error) {
      toast.error('Failed to update discount');
    }
  };
  

  const handleOrderStatusChange = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const handleDownloadInvoice = async (orderId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('You must be logged in to download invoices.');
      return;
    }
    try {
      const invoiceBase64 = await getOrderInvoice(token, orderId);
      if (!invoiceBase64) {
        toast.error('No invoice data received from server.');
        return;
      }
      const link = document.createElement('a');
      link.href = `data:application/pdf;base64,${invoiceBase64}`;
      link.download = `DriftMood-Order-${orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Invoice downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download invoice.');
    }
  };
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Sales Manager Dashboard</h1>
      <Tabs defaultValue="pricing" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pricing">Pricing & Discounts</TabsTrigger>
          <TabsTrigger value="orders">Orders & Revenue</TabsTrigger>
          <TabsTrigger value="deliveries">Deliveries & Invoices</TabsTrigger>
          <TabsTrigger value="refunds">User Refunds</TabsTrigger>
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
                    <TableHead>
                      <select
                        className="border p-1 rounded text-sm"
                        value={filterCategory}
                        onChange={(e) => {
                          const selected = e.target.value;
                          setFilterCategory(selected);
                          if (selected === '') {
                            fetchProducts();
                          } else {
                            fetchProductsByCategoryName(selected);
                          }
                        }}
                      >
                        <option value="">All Categories</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    </TableHead>
                    <TableHead>Current Price</TableHead>
                    <TableHead>Discount Rate</TableHead>
                    
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
                     
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
  <div className="grid grid-cols-2 gap-6">
    <Card>
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
      </CardHeader>
      <CardContent>
      <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-4">
      <div>
      <label className="block text-sm font-medium mb-1">Start Date</label>
            <Input
              type="date"
              value={startDate}
              max={new Date().toISOString().split("T")[0]} 
              onChange={(e) => setStartDate(e.target.value)}
            />
            </div>

            <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <Input
               type="date"
              value={endDate}
              max={new Date().toISOString().split("T")[0]} 
              onChange={(e) => setEndDate(e.target.value)}
            />
           </div>
           <Button onClick={() => fetchRevenueData(startDate, endDate)}>
            Update Chart
          </Button>
        </div>

        {/* EXISTING CHART */}
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
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Address</TableHead> 
                  </TableRow>
                </TableHeader>

                  <TableBody>
                  {orders
                    .filter(order => {
                      const orderDate = new Date(order.date);
                      const start = new Date(startDate);
                      const end = new Date(endDate);
                      return orderDate >= start && orderDate <= end;
                    })
  .                 map((order) => (

                      <TableRow key={order.id}>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>${order.totalAmount}</TableCell>
                        <TableCell>{order.status}</TableCell> 
                        <TableCell>{order.address}</TableCell> 
                       </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="refunds">
  <Card>
    <CardHeader>
      <CardTitle>User Refund Requests</CardTitle>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Order ID</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {refunds.map((refund) => (
            <TableRow key={refund.id}>
              <TableCell>{refund.userName}</TableCell>
              <TableCell>{refund.userEmail}</TableCell>
              <TableCell>{refund.orderId}</TableCell>
              <TableCell>{refund.reason}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    refund.status === 1
                      ? 'default'
                      : refund.status === 2
                      ? 'destructive'
                      : 'secondary'
                  }
                >
                  {refund.status === 1
                    ? 'Accepted'
                    : refund.status === 2
                    ? 'Rejected'
                    : 'Pending'}
                </Badge>
              </TableCell>
              <TableCell>{new Date(refund.createdAt).toLocaleString()}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button size="sm" disabled onClick={() => toast.info('Backend not ready')}>
                    Accept
                  </Button>
                  <Button size="sm" variant="destructive" disabled onClick={() => toast.info('Backend not ready')}>
                    Decline
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
</TabsContent>



        
        <TabsContent value="deliveries">
          <Card>
            <CardHeader>
              <CardTitle>Deliveries & Invoices</CardTitle>
            </CardHeader>
          <CardContent>
            {isLoadingOrders ? (
            <div>Loading orders...</div>
              ) : (
            <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Invoice</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>${order.total.toFixed(2)}</TableCell>
                <TableCell>{order.userName}</TableCell>
                <TableCell>{order.userEmail}</TableCell>
                <TableCell>
                  <ul className="list-disc pl-4">
                    {order.products.map((prod) => (
                      <li key={prod.id}>{prod.name} x{prod.quantity}</li>
                    ))}
                  </ul>
                </TableCell>
                <TableCell>
                  <Button size="sm" onClick={() => handleDownloadInvoice(order.id)}>
                    <Download className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </CardContent>
  </Card>
</TabsContent>

      </Tabs>
    </div>
  );
};

export default SalesManagerPage;
