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
import { getAll } from '@/api/orderApi';
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
  const [categories, setCategories] = useState<Category[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    fetchProducts();
    fetchOrders();
  }, []);

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
      const data = await getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
    }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const rawOrders = await getAll();
      const mappedOrders = rawOrders.map((order: any) => ({
        id: order.order_id?.toString() ?? '',
        date: new Date(order.date).toLocaleDateString(),
        customerName: order.user_name || order.username || order.name || order.customerName || '',
        totalAmount: parseFloat(order.total_price),
        status: order.order_status,
        invoiceNumber: order.invoice_number || '',
        items: order.product_list || [],
      }));
      setOrders(mappedOrders);
    } catch (error) {
      console.error('Failed to fetch orders');
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
      if (!target) return;
      if (target.price > 0) {
        toast.warning("Price has already been set and cannot be changed.");
        return;
      }
      await setPrice(token, productId, newPrice);
      setProducts(products.map(product =>
        product.id === productId ? { ...product, price: newPrice } : product
      ));
    } catch (error) {
      toast.error('Failed to update price');
    }
  };

  const handleDiscountChange = async (productId: string, newDiscount: number) => {
    try {
      const token = localStorage.getItem('token');
      await setDiscount(token, productId, newDiscount);
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
                            disabled={product.price > 0}
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
                        <Button variant="outline" size="sm">View Details</Button>
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