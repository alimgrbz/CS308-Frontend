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
import { getAllProducts, addProduct, updateProduct, deleteProduct, setPrice, setStock,getProductsByCategory } from '@/api/productApi';
import { toast } from 'sonner';
import { getOrdersByUser, getOrderInvoice } from '@/api/orderApi';
import { getAllComments, deleteComment } from '@/api/commentApi';


import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';


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

const SalesManagerPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('');

  useEffect(() => {
    fetchCategories();
    fetchProducts();
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
          <p className="text-muted">Order and revenue section here…</p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalesManagerPage;