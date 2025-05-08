import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Save, X, Download } from "lucide-react";
import { getAllCategories, addCategory, deleteCategory } from '@/api/categoryApi';
import { getAllProducts, addProduct, updateProduct, deleteProduct, setPrice, setStock } from '@/api/productApi';
import { toast } from 'sonner';
import { getAllOrders, getOrderInvoice } from '@/api/orderApi';
import { getAllComments, deleteComment, acceptComment, rejectComment } from '@/api/commentApi';

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  category: string;
  categoryId: number;
  price: number;
  stock: number;
  description?: string;
  image?: string;
}

interface Delivery {
  id: string;
  productName: string;
  quantity: number;
  status: 'pending' | 'in_transit' | 'delivered';
  invoiceNumber: string;
}

interface Comment {
  id: number;
  productId: number;
  userId: number;
  userName?: string;
  productName?: string;
  content: string;
  status: number; // 1 = accepted, 0 = rejected
  createdAt: string;
}

interface OrderProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  grind?: string;
}

interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  products: OrderProduct[];
  userEmail?: string;
  userName?: string;
  address: string;
  invoicePdf: string;
}

const ProductManagerPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    category: '',
    categoryId: 0,
    price: 0,
    stock: 0,
    description: '',
    image: ''
  });
  const [filterName, setFilterName] = useState('');
  const [sortOption, setSortOption] = useState('date-desc'); // default: newest first
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  // Fetch categories and products on component mount
  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const categoriesData = await getAllCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories');
    }
  };

  const fetchProducts = async () => {
    try {
      const productsData = await getAllProducts();
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
    }
  };

  const handleAddCategory = async () => {
    if (newCategory.trim()) {
      try {
        const response = await addCategory(newCategory.trim());
        setCategories([...categories, response]);
        setNewCategory('');
        toast.success('Category added successfully');
      } catch (error) {
        console.error('Error adding category:', error);
        toast.error('Failed to add category');
      }
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      await deleteCategory(id);
      setCategories(categories.filter(cat => cat.id !== id));
      toast.success('Category deleted successfully');
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  };

  const handleAddProduct = async () => {
    if (newProduct.name && newProduct.categoryId) {
      try {
        const response = await addProduct(newProduct);
        setProducts([...products, response]);
        setNewProduct({
          name: '',
          category: '',
          categoryId: 0,
          price: 0,
          stock: 0,
          description: '',
          image: ''
        });
        setIsAddingProduct(false);
        toast.success('Product added successfully');
      } catch (error) {
        console.error('Error adding product:', error);
        toast.error('Failed to add product');
      }
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      await deleteProduct(id);
      setProducts(products.filter(prod => prod.id !== id));
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
  };

  const handleSaveEdit = async () => {
    if (editingProduct) {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        // Update price
        await setPrice(token, editingProduct.id, editingProduct.price);
        // Update stock
        await setStock(token, editingProduct.id, editingProduct.stock);
        // Update local state
        setProducts(products.map(p =>
          p.id === editingProduct.id ? { ...p, price: editingProduct.price, stock: editingProduct.stock } : p
        ));
        setEditingProduct(null);
        toast.success('Product updated successfully');
      } catch (error) {
        console.error('Error updating product:', error);
        toast.error('Failed to update product');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  const handleAcceptComment = async (commentId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required. Please log in.');
        return;
      }
      const comment = comments.find(c => c.id === commentId);
      if (!comment) {
        toast.error('Comment not found');
        return;
      }
      await acceptComment(token, comment.productId, comment.content);
      setComments(comments.map(c => c.id === commentId ? { ...c, status: 1 } : c));
      toast.success('Comment accepted');
    } catch (error) {
      console.error('Error accepting comment:', error);
      toast.error('Failed to accept comment');
    }
  };

  const handleRejectComment = async (commentId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required. Please log in.');
        return;
      }
      const comment = comments.find(c => c.id === commentId);
      if (!comment) {
        toast.error('Comment not found');
        return;
      }
      await rejectComment(token, comment.productId, comment.content);
      setComments(comments.map(c => c.id === commentId ? { ...c, status: 0 } : c));
      toast.success('Comment rejected');
    } catch (error) {
      console.error('Error rejecting comment:', error);
      toast.error('Failed to reject comment');
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required. Please log in.');
        return;
      }
      await deleteComment(commentId);
      setComments(comments.filter(c => c.id !== commentId));
      toast.success('Comment deleted');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    }
  };

  const fetchComments = async () => {
    setIsLoadingComments(true);
    try {
      console.log('Fetching all comments...');
      const commentsData = await getAllComments();
      console.log('Received comments:', commentsData);
      if (!Array.isArray(commentsData)) {
        console.error('Invalid comments data received:', commentsData);
        toast.error('Invalid data received from server');
        return;
      }
      setComments(commentsData);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to fetch comments');
    } finally {
      setIsLoadingComments(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  // Filter and sort products
  const getFilteredSortedProducts = () => {
    let filtered = products.filter(p =>
      p.name.toLowerCase().includes(filterName.toLowerCase())
    );
    switch (sortOption) {
      case 'date-asc':
        filtered = filtered.slice().sort((a, b) => a.id - b.id); // assuming id increments with date
        break;
      case 'date-desc':
        filtered = filtered.slice().sort((a, b) => b.id - a.id);
        break;
      case 'alpha-asc':
        filtered = filtered.slice().sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'alpha-desc':
        filtered = filtered.slice().sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }
    return filtered;
  };

  const mapBackendStatus = (backendStatus: string): string => {
    switch (backendStatus?.toLowerCase()) {
      case 'processing':
      case 'getting ready':
        return 'Getting ready';
      case 'in-transit':
      case 'on the way':
        return 'On the way';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Ordered';
    }
  };

  const fetchAllOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required. Please log in.');
        return;
      }
      console.log('Fetching all orders...');
      const rawOrders = await getAllOrders(token);
      console.log('Received orders:', rawOrders);
      
      if (!Array.isArray(rawOrders)) {
        console.error('Invalid orders data received:', rawOrders);
        toast.error('Invalid data received from server');
        return;
      }

      const mappedOrders: Order[] = rawOrders.map((order: any) => {
        console.log('Processing order:', order);
        const mappedOrder: Order = {
          id: order.order_id?.toString() ?? '',
          date: new Date(order.date).toISOString(),
          status: mapBackendStatus(order.order_status),
          total: parseFloat(order.total_price),
          products: Array.isArray(order.product_list) ? order.product_list.map((prod: any) => ({
            id: prod.p_id?.toString() ?? '',
            name: prod.name,
            image: prod.image,
            price: parseFloat(prod.total_price),
            quantity: prod.quantity,
            grind: prod.grind,
          })) : [],
          userEmail: order.user_email || order.email || '',
          userName: order.user_name || order.username || order.name || '',
          address: order.address || '',
          invoicePdf: order.invoice_pdf || ''
        };
        return mappedOrder;
      });
      console.log('Mapped orders:', mappedOrders);
      setAllOrders(mappedOrders);
    } catch (err) {
      console.error('Error fetching orders:', err);
      toast.error(err.response?.data?.message || 'Failed to fetch orders. Please try again.');
    } finally {
      setIsLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const handleDownloadInvoice = async (orderId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('You must be logged in to download invoices.');
        return;
      }
      console.log('Downloading invoice for order:', orderId);
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
      console.error('Error downloading invoice:', error);
      toast.error('Failed to download invoice. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Product Manager Dashboard</h1>
      
      <Tabs defaultValue="inventory" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="inventory">Inventory Management</TabsTrigger>
          <TabsTrigger value="deliveries">Deliveries & Invoices</TabsTrigger>
          <TabsTrigger value="comments">User Comments</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory">
          <div className="space-y-6">
            {/* Categories Section */}
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  <Input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="New category name"
                  />
                  <Button onClick={handleAddCategory}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Badge key={category.id} variant="secondary" className="flex items-center gap-2">
                      {category.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Filter and Sort Controls (now below Categories, above Products) */}
            <div className="flex flex-col md:flex-row gap-4 my-4 items-center">
              <Input
                className="w-full md:w-1/3"
                placeholder="Filter by product name..."
                value={filterName}
                onChange={e => setFilterName(e.target.value)}
              />
              <select
                className="w-full md:w-1/4 p-2 border rounded-md"
                value={sortOption}
                onChange={e => setSortOption(e.target.value)}
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="alpha-asc">A-Z</option>
                <option value="alpha-desc">Z-A</option>
              </select>
            </div>

            {/* Products Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Products</CardTitle>
                <Button onClick={() => setIsAddingProduct(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Product
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Add New Product Form */}
                  {isAddingProduct && (
                    <Card className="border-2 border-dashed">
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div>
                            <Label>Name</Label>
                            <Input
                              value={newProduct.name}
                              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                              placeholder="Product name"
                            />
                          </div>
                          <div>
                            <Label>Category</Label>
                            <select
                              className="w-full p-2 border rounded-md"
                              value={newProduct.categoryId}
                              onChange={(e) => setNewProduct({ 
                                ...newProduct, 
                                categoryId: Number(e.target.value),
                                category: categories.find(c => c.id === Number(e.target.value))?.name || ''
                              })}
                            >
                              <option value="">Select a category</option>
                              {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                  {category.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <Label>Price</Label>
                            <Input
                              type="number"
                              value={newProduct.price}
                              onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                            />
                          </div>
                          <div>
                            <Label>Stock</Label>
                            <Input
                              type="number"
                              value={newProduct.stock}
                              onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                            />
                          </div>
                          <div>
                            <Label>Description</Label>
                            <Input
                              value={newProduct.description}
                              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                              placeholder="Product description"
                            />
                          </div>
                          <div>
                            <Label>Image URL</Label>
                            <Input
                              value={newProduct.image}
                              onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                              placeholder="Image URL"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={handleAddProduct}>Save</Button>
                            <Button variant="outline" onClick={() => setIsAddingProduct(false)}>Cancel</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Product Cards */}
                  {getFilteredSortedProducts().map((product) => (
                    <Card key={product.id}>
                      <CardContent className="pt-6">
                        {editingProduct?.id === product.id ? (
                          <div className="space-y-4">
                            <div>
                              <Label>Name</Label>
                              <p className="font-semibold text-lg">{editingProduct.name}</p>
                            </div>
                            <div>
                              <Label>Category</Label>
                              <p className="text-sm text-gray-500">{editingProduct.category}</p>
                            </div>
                            <div>
                              <Label>Description</Label>
                              <p className="text-sm text-gray-600">{editingProduct.description}</p>
                            </div>
                            <div>
                              <Label>Image URL</Label>
                              {editingProduct.image && (
                                <img
                                  src={editingProduct.image}
                                  alt={editingProduct.name}
                                  className="w-full h-32 object-cover rounded-md mb-2"
                                />
                              )}
                              <p className="text-xs text-gray-400">{editingProduct.image}</p>
                            </div>
                            <div>
                              <Label>Price</Label>
                              <Input
                                type="number"
                                value={editingProduct.price}
                                onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                              />
                            </div>
                            <div>
                              <Label>Stock</Label>
                              <Input
                                type="number"
                                value={editingProduct.stock}
                                onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button onClick={handleSaveEdit}>
                                <Save className="h-4 w-4 mr-2" />
                                Save
                              </Button>
                              <Button variant="outline" onClick={handleCancelEdit}>
                                <X className="h-4 w-4 mr-2" />
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {product.image && (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-48 object-cover rounded-md"
                              />
                            )}
                            <div>
                              <h3 className="font-semibold text-lg">{product.name}</h3>
                              <p className="text-sm text-gray-500">{product.category}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label>Price</Label>
                                <p className="font-medium">${product.price}</p>
                              </div>
                              <div>
                                <Label>Stock</Label>
                                <p className="font-medium">{product.stock}</p>
                              </div>
                            </div>
                            {product.description && (
                              <p className="text-sm text-gray-600">{product.description}</p>
                            )}
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditProduct(product)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="deliveries">
          <Card>
            <CardHeader>
              <CardTitle>Deliveries & Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingOrders ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  <span className="ml-2">Loading orders...</span>
                </div>
              ) : allOrders.length === 0 ? (
                <div className="text-center text-gray-500 py-4">No orders found</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Products</TableHead>
                        <TableHead>Invoice</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                order.status === 'Delivered'
                                  ? 'default'
                                  : order.status === 'Cancelled'
                                  ? 'destructive'
                                  : 'secondary'
                              }
                            >
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>${order.total.toFixed(2)}</TableCell>
                          <TableCell>{order.userName || 'N/A'}</TableCell>
                          <TableCell>{order.userEmail || 'N/A'}</TableCell>
                          <TableCell className="max-w-xs truncate">{order.address || 'N/A'}</TableCell>
                          <TableCell>
                            <div className="max-w-xs">
                              {order.products.map((prod) => (
                                <div key={prod.id} className="flex items-center gap-2 mb-1">
                                  {prod.image && (
                                    <img
                                      src={prod.image}
                                      alt={prod.name}
                                      className="w-8 h-8 object-cover rounded"
                                    />
                                  )}
                                  <div>
                                    <p className="text-sm font-medium">{prod.name}</p>
                                    <p className="text-xs text-gray-500">
                                      {prod.quantity}x ${prod.price.toFixed(2)}
                                      {prod.grind && ` (${prod.grind})`}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button 
                              size="sm" 
                              onClick={() => handleDownloadInvoice(order.id)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments">
          <Card>
            <CardHeader>
              <CardTitle>User Comments</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingComments ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  <span className="ml-2">Loading comments...</span>
                </div>
              ) : comments.length === 0 ? (
                <div className="text-center text-gray-500 py-4">No comments found</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Comment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {comments.map((comment) => (
                      <TableRow key={comment.id}>
                        <TableCell>{comment.productName || `Product #${comment.productId}`}</TableCell>
                        <TableCell>{comment.userName || `User #${comment.userId}`}</TableCell>
                        <TableCell className="max-w-md truncate">{comment.content}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              comment.status === 1
                                ? 'default'
                                : comment.status === 0
                                ? 'destructive'
                                : 'secondary'
                            }
                          >
                            {comment.status === 1 ? 'Accepted' : comment.status === 0 ? 'Rejected' : 'Pending'}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(comment.createdAt).toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleAcceptComment(comment.id)} 
                              disabled={comment.status === 1}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Accept
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              onClick={() => handleRejectComment(comment.id)} 
                              disabled={comment.status === 0}
                            >
                              Reject
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleDeleteComment(comment.id)}
                            >
                              Delete
                            </Button>
                          </div>
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

export default ProductManagerPage; 