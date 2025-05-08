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
import { getOrdersByUser, getOrderInvoice } from '@/api/orderApi';
import { getAllComments, deleteComment } from '@/api/commentApi';

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

  const fetchComments = async () => {
    try {
      const commentsData = await getAllComments();
      setComments(commentsData);
    } catch (error) {
      toast.error('Failed to fetch comments');
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleAcceptComment = async (commentId: number) => {
    // Call your API to set status to 1 (accepted)
    // For now, just update state
    setComments(comments.map(c => c.id === commentId ? { ...c, status: 1 } : c));
    toast.success('Comment accepted');
  };

  const handleRejectComment = async (commentId: number) => {
    // Call your API to set status to 0 (rejected)
    // For now, just update state
    setComments(comments.map(c => c.id === commentId ? { ...c, status: 0 } : c));
    toast.success('Comment rejected');
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await deleteComment(commentId);
      setComments(comments.filter(c => c.id !== commentId));
      toast.success('Comment deleted');
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  };

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
    switch (backendStatus) {
      case 'processing': return 'Getting ready';
      case 'in-transit': return 'On the way';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return 'Ordered';
    }
  };

  const fetchAllOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
      const rawOrders = await getOrdersByUser(token);
      const mappedOrders: Order[] = rawOrders.map((order: any) => ({
        id: order.order_id?.toString() ?? '',
        date: new Date(order.date).toISOString(),
        status: mapBackendStatus(order.order_status),
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
    } catch (err) {
      toast.error('Failed to fetch orders');
    } finally {
      setIsLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

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

        <TabsContent value="comments">
          <Card>
            <CardHeader>
              <CardTitle>User Comments</CardTitle>
            </CardHeader>
            <CardContent>
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
                      <TableCell>{comment.productName || comment.productId}</TableCell>
                      <TableCell>{comment.userName || comment.userId}</TableCell>
                      <TableCell>{comment.content}</TableCell>
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
                          <Button size="sm" onClick={() => handleAcceptComment(comment.id)} disabled={comment.status === 1}>
                            Accept
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleRejectComment(comment.id)} disabled={comment.status === 0}>
                            Reject
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteComment(comment.id)}>
                            Delete
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
      </Tabs>
    </div>
  );
};

export default ProductManagerPage; 