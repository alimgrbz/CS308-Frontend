import React from 'react';
import { useParams } from 'react-router-dom';
import { Star, ShoppingCart, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import '../ProductDetailPage.css';
import { getAllProducts } from '@/api/productApi';
import { getAllCategories } from '@/api/categoryApi';
import { useEffect, useState } from 'react';

const getStarRatingFromPopularity = (popularity: number): number => {
  if (popularity <= 20) return 1;
  if (popularity <= 40) return 2;
  if (popularity <= 60) return 3;
  if (popularity <= 80) return 4;
  return 5;
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = React.useState('description');
  const [quantity, setQuantity] = React.useState(1);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const productsResponse = await getAllProducts();
        console.log('API Response:', productsResponse);
        
        if (!productsResponse) {
          console.error('No response from API');
          return;
        }

        // Handle different response formats
        let productsData = [];
        if (Array.isArray(productsResponse)) {
          productsData = productsResponse;
        } else if (productsResponse.products) {
          productsData = productsResponse.products;
        } else if (productsResponse.data) {
          productsData = productsResponse.data;
        }

        // Transform the data to match the expected structure
        const transformedProducts = productsData.map(product => ({
          ...product,
          productId: product.id || product.productId,
          picture: product.imageUrl || product.picture,
          stock: product.inStock || product.stock,
          categoryId: product.categoryId || product.category,
          price: Number(product.price) || 0,
          popularity: Number(product.popularity) || 0
        }));

        console.log('Transformed products:', transformedProducts);
        setProducts(transformedProducts);

        // Fetch categories
        const categoriesResponse = await getAllCategories();
        setCategories(categoriesResponse);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load data",
          variant: "destructive",
        });
      }
    };

    fetchData();
  }, []);

  console.log('Rendering with products:', products);
  console.log('Current ID from URL:', id);
  
  const product = products.find((p) => p.productId === parseInt(id || '', 10));
  console.log('Found product:', product);

  if (!product) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold">Product not found</h2>
        <p className="text-gray-500">ID: {id}</p>
        <p className="text-gray-500">Available products: {products.length}</p>
        <pre className="text-left mt-4 p-4 bg-gray-100 rounded">
          {JSON.stringify(products, null, 2)}
        </pre>
      </div>
    );
  }

  const reviews = [
    {
      id: 1,
      userName: "Jane Cooper",
      rating: 5,
      date: "2 months ago",
      comment: "This coffee has the perfect balance of flavors!",
      isVerified: true,
    },
    {
      id: 2,
      userName: "Alex Johnson",
      rating: 4,
      date: "3 weeks ago",
      comment: "Very good quality beans. Aroma is incredible!",
      isVerified: true,
    }
  ];

  const getCategoryName = (categoryId: number): string => {
    const category = categories.find(cat => cat.categoryId === categoryId);
    return category ? category.categoryType : "Unknown Category";
  };

  return (
    <div className="min-h-screen bg-driftmood-cream p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Image */}
          <div className="md:w-1/2">
            <img src={product.picture} alt={product.name} className="w-full rounded-lg object-cover" />
          </div>

          {/* Info */}
          <div className="md:w-1/2 space-y-4">
            <h1 className="text-2xl font-serif font-semibold">{product.name}</h1>
            <p className="text-driftmood-brown">{product.description}</p>

            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={18}
                  className={cn(
                    star <= getStarRatingFromPopularity(product.popularity) ? "rating-star-filled" : "rating-star"
                  )}
                  fill={star <= getStarRatingFromPopularity(product.popularity) ? "currentColor" : "none"}
                />
              ))}
              <span className="text-sm text-driftmood-brown">
                {getStarRatingFromPopularity(product.popularity).toFixed(1)} ({product.numReviews})
              </span>
            </div>

            <div className="text-xl font-bold">${product.price.toFixed(2)}</div>

            <div className="flex gap-2 flex-wrap">
              <span className="chip bg-driftmood-lime text-driftmood-dark">{getCategoryName(product.categoryId)}</span>
              {product.origin && (
                <span className="chip bg-driftmood-cream text-driftmood-brown">Origin: {product.origin}</span>
              )}
              {product.roastLevel && (
                <span className="chip bg-driftmood-cream text-driftmood-brown">Roast: {product.roastLevel}</span>
              )}
              {product.stock ? (
                <span className="chip bg-green-100 text-green-800">In Stock</span>
              ) : (
                <span className="chip bg-red-100 text-red-800">Out of Stock</span>
              )}
            </div>

            {/* Quantity selector + add to cart */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-4">
              <div className="flex items-center border border-driftmood-lightlime rounded-md overflow-hidden w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="quantity-btn"
                >
                  -
                </button>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="quantity-input"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="quantity-btn"
                >
                  +
                </button>
              </div>

              <button
                className={cn(
                  "btn-primary flex-1 flex items-center justify-center",
                  !product.stock && "opacity-50 cursor-not-allowed"
                )}
                disabled={!product.stock}
                onClick={() => {
                  toast({
                    title: "Added to cart",
                    description: `${product.name} (x${quantity}) has been added to your cart.`,
                    duration: 3000,
                  });
                }}
              >
                <ShoppingCart size={18} className="mr-2" />
                {product.stock ? "Add to Cart" : "Sold Out"}
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-10">
          <div className="border-b border-driftmood-lightlime mb-4 flex space-x-6">
            {["description", "details", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "py-2 text-sm font-medium relative",
                  activeTab === tab ? "text-driftmood-dark" : "text-driftmood-brown hover:text-driftmood-dark"
                )}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-driftmood-dark" />
                )}
              </button>
            ))}
          </div>

          {activeTab === "description" && (
            <p className="text-driftmood-brown">{product.longDescription}</p>
          )}

          {activeTab === "details" && (
            <div className="space-y-4 text-driftmood-brown">
              <div>
                <h4 className="font-medium">Ingredients</h4>
                <ul className="list-disc ml-6 text-sm">
                  {product.ingredients?.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium">Origin</h4>
                <p className="text-sm">{product.origin}</p>
              </div>
              {product.distributor && (
                <div>
                  <h4 className="font-medium">Distributor</h4>
                  <p className="text-sm">{product.distributor}</p>
                </div>
              )}
              {product.warrantyStatus && (
                <div>
                  <h4 className="font-medium">Warranty</h4>
                  <p className="text-sm">{product.warrantyStatus}</p>
                </div>
              )}
              {product.serialNumber && (
                <div>
                  <h4 className="font-medium">Serial Number</h4>
                  <p className="text-sm">{product.serialNumber}</p>
                </div>
              )}
              {product.model && (
                <div>
                  <h4 className="font-medium">Model</h4>
                  <p className="text-sm">{product.model}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-4 text-driftmood-brown">
              {reviews.map((r) => (
                <div key={r.id} className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{r.userName}</span>
                    <span className="text-xs">{r.date}</span>
                  </div>
                  <div className="text-sm">{r.comment}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;