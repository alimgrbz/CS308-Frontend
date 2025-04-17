import React, { useState, useMemo, useEffect } from 'react';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import ProductCard from '@/components/ProductCard';
import ProductFilters from '@/components/ProductFilters';
import FilterSidebar from '@/components/FilterSidebar';
import { getAllProducts } from '@/api/productApi';
import { getAllCategories } from '@/api/categoryApi';
import Logo from '@/components/Logo';
import { Link } from 'react-router-dom';
/*
// Sample product data
const products = [
  // Coffee Beans
  {
    productId: 1,
    name: "Ethiopian Yirgacheffe Beans",
    description: "Floral and citrusy light roast coffee beans.",
    longDescription: "Sourced from the Yirgacheffe region, these light roast beans offer floral aromatics and bright citrus flavors. Perfect for pour-over and filter brewing methods.",
    price: 16.99,
    picture: "https://images.unsplash.com/photo-1587730746644-3fbc4c37ab44?auto=format&fit=crop&q=80&w=1000",
    rating: 4.8,
    numReviews: 45,
    stock: true,
    categoryId: "Coffee Beans",
    popularity: 10,
    badges: ["Best Seller"],
    ingredients: ["100% Arabica beans"],
    roastLevel: "Light",
    origin: "Ethiopia",
    distributor: "Local Coffee Distributors",
    discount: 0,
    status: "active",
    warrantyStatus: "none",
    costRatio: 0.6,
    serialNumber: "CB001",
    model: "Yirgacheffe-2024"
  },
  {
    productId: 2,
    name: "Cold Brew Blend",
    description: "Coarse ground beans perfect for cold brew.",
    longDescription: "A smooth and rich blend crafted for cold brewing. With notes of chocolate and almond, it's refreshing and bold when steeped overnight.",
    price: 15.50,
    picture: "https://images.unsplash.com/photo-1566378249362-804c4112a3d3?auto=format&fit=crop&q=80&w=1000",
    rating: 4.6,
    numReviews: 34,
    stock: true,
    categoryId: "Coffee Beans",
    popularity: 9,
    badges: [],
    ingredients: ["Arabica blend"],
    roastLevel: "Medium",
    origin: "Colombia & Brazil",
    distributor: "Global Coffee Imports",
    discount: 0,
    status: "active",
    warrantyStatus: "none",
    costRatio: 0.55,
    serialNumber: "CB002",
    model: "ColdBrew-2024"
  },
  {
    productId: 3,
    name: "Dark Roast Espresso",
    description: "Bold and intense espresso blend.",
    longDescription: "Deep roast with a smoky aroma and bold taste, best for espresso lovers.",
    price: 17.99,
    picture: "https://images.unsplash.com/photo-1587305701203-c4b4cc2436d7?auto=format&fit=crop&q=80&w=1000",
    rating: 4.7,
    numReviews: 39,
    stock: true,
    categoryId: "Coffee Beans",
    popularity: 9,
    badges: [],
    ingredients: ["Arabica", "Robusta"],
    roastLevel: "Dark",
    origin: "Brazil & Indonesia",
    distributor: "Premium Coffee Co.",
    discount: 0,
    status: "active",
    warrantyStatus: "none",
    costRatio: 0.58,
    serialNumber: "CB003",
    model: "Espresso-2024"
  },

  // Tea
  {
    productId: 12,
    name: "Jasmine Green Tea",
    description: "Delicate green tea with jasmine blossoms.",
    longDescription: "Green tea leaves from China, scented with jasmine. Light and aromatic.",
    price: 12.99,
    picture: "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?auto=format&fit=crop&q=80&w=1000",
    rating: 4.2,
    numReviews: 16,
    stock: true,
    categoryId: "Tea",
    popularity: 7,
    badges: ["Best Seller"],
    ingredients: ["Green tea", "Jasmine"],
    origin: "China",
    distributor: "Tea Masters Inc.",
    discount: 0,
    status: "active",
    warrantyStatus: "none",
    costRatio: 0.5,
    serialNumber: "T001",
    model: "Jasmine-2024"
  },
  {
    productId: 13,
    name: "Chai Spice Blend",
    description: "Traditional black tea with aromatic spices.",
    longDescription: "Aromatic blend with cinnamon, cardamom, cloves. Brew with milk for masala chai.",
    price: 13.99,
    picture: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&q=80&w=1000",
    rating: 4.6,
    numReviews: 35,
    stock: false,
    categoryId: "Tea",
    popularity: 8,
    badges: [],
    ingredients: ["Black tea", "Spices"],
    origin: "India",
    distributor: "Spice Tea Co.",
    discount: 0,
    status: "out_of_stock",
    warrantyStatus: "none",
    costRatio: 0.52,
    serialNumber: "T002",
    model: "Chai-2024"
  },
  {
    productId: 14,
    name: "Earl Grey Supreme",
    description: "Citrusy black tea with bergamot oil.",
    longDescription: "Classic Earl Grey recipe upgraded with blue cornflower petals and extra bergamot.",
    price: 12.99,
    picture: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&q=80&w=1000",
    rating: 4.7,
    numReviews: 23,
    stock: true,
    categoryId: "Tea",
    popularity: 8,
    badges: [],
    ingredients: ["Black tea", "Bergamot"],
    origin: "Sri Lanka & India",
    distributor: "British Tea Co.",
    discount: 0,
    status: "active",
    warrantyStatus: "none",
    costRatio: 0.51,
    serialNumber: "T003",
    model: "EarlGrey-2024"
  },

  // Brewing Equipment
  {
    productId: 4,
    name: "French Press Brewer",
    description: "Classic 1-liter glass French Press.",
    longDescription: "Crafted with borosilicate glass and stainless steel, our 1-liter French Press delivers full-bodied coffee with ease.",
    price: 29.99,
    picture: "https://images.unsplash.com/photo-1577985025774-699de1fe52f0?auto=format&fit=crop&q=80&w=1000",
    rating: 4.7,
    numReviews: 25,
    stock: true,
    categoryId: "Brewing Equipment",
    popularity: 8,
    badges: ["Best Seller"],
    ingredients: [],
    origin: "Imported",
    distributor: "Brewing Essentials",
    discount: 0,
    status: "active",
    warrantyStatus: "1_year",
    costRatio: 0.65,
    serialNumber: "BE001",
    model: "FrenchPress-2024"
  },
  {
    productId: 5,
    name: "Manual Coffee Grinder",
    description: "Stainless steel burr grinder with precision settings.",
    longDescription: "A compact manual grinder with adjustable settings for pour-over, espresso, or French press.",
    price: 24.95,
    picture: "https://images.unsplash.com/photo-1559115264-25824d92f71f?auto=format&fit=crop&q=80&w=1000",
    rating: 4.4,
    numReviews: 18,
    stock: false,
    categoryId: "Brewing Equipment",
    popularity: 7,
    badges: [],
    ingredients: [],
    origin: "Japan",
    distributor: "Precision Tools Inc.",
    discount: 0,
    status: "out_of_stock",
    warrantyStatus: "2_years",
    costRatio: 0.7,
    serialNumber: "BE002",
    model: "Grinder-2024"
  },
  {
    productId: 6,
    name: "Gooseneck Pour Over Kettle",
    description: "Precision pour kettle with thermometer.",
    longDescription: "Stainless steel kettle with a slim spout and integrated thermometer for perfect pour control.",
    price: 39.99,
    picture: "https://images.unsplash.com/photo-1661251487856-3e547df0bfc3?auto=format&fit=crop&q=80&w=1000",
    rating: 4.9,
    numReviews: 32,
    stock: true,
    categoryId: "Brewing Equipment",
    popularity: 10,
    badges: [],
    ingredients: [],
    origin: "Korea",
    distributor: "Brewing Masters",
    discount: 0,
    status: "active",
    warrantyStatus: "2_years",
    costRatio: 0.68,
    serialNumber: "BE003",
    model: "Gooseneck-2024"
  },

  // Accessories & Merch
  {
    productId: 7,
    name: "DriftMood Mug",
    description: "Matte black ceramic mug with logo.",
    longDescription: "12 oz matte ceramic mug. Microwave/dishwasher safe. Minimalist design.",
    price: 11.99,
    picture: "https://images.unsplash.com/photo-1517686469429-8bdb7a6b84cd?auto=format&fit=crop&q=80&w=1000",
    rating: 4.5,
    numReviews: 22,
    stock: true,
    categoryId: "Accessories",
    popularity: 9,
    badges: ["Best Seller"],
    ingredients: [],
    origin: "Turkey",
    distributor: "Ceramic Arts Co.",
    discount: 0,
    status: "active",
    warrantyStatus: "none",
    costRatio: 0.45,
    serialNumber: "A001",
    model: "Mug-2024"
  },
  {
    productId: 8,
    name: "Barista Tote Bag",
    description: "Cotton tote bag with coffee art.",
    longDescription: "Eco tote bag made from organic cotton, printed with barista-themed artwork.",
    price: 14.99,
    picture: "https://images.unsplash.com/photo-1621170728027-5892d26d4411?auto=format&fit=crop&q=80&w=1000",
    rating: 4.3,
    numReviews: 15,
    stock: true,
    categoryId: "Accessories",
    popularity: 6,
    badges: [],
    ingredients: [],
    origin: "Turkey",
    distributor: "Eco Bags Ltd.",
    discount: 0,
    status: "active",
    warrantyStatus: "none",
    costRatio: 0.4,
    serialNumber: "A002",
    model: "Tote-2024"
  },
  {
    productId: 9,
    name: "Coffee Sticker Set",
    description: "Set of 3 stickers: bean, mug, grinder.",
    longDescription: "Add flair to your bag or jacket with this sticker trio inspired by coffee life.",
    price: 9.99,
    picture: "https://images.unsplash.com/photo-1558449028-8b28fe774c73?auto=format&fit=crop&q=80&w=1000",
    rating: 4.2,
    numReviews: 12,
    stock: true,
    categoryId: "Accessories",
    popularity: 5,
    badges: [],
    ingredients: [],
    origin: "USA",
    distributor: "Sticker Art Co.",
    discount: 0,
    status: "active",
    warrantyStatus: "none",
    costRatio: 0.35,
    serialNumber: "A003",
    model: "Stickers-2024"
  },

  // Gift Sets
  {
    productId: 10,
    name: "Morning Ritual Gift Box",
    description: "Beans, mug, and brewing guide.",
    longDescription: "Perfect gift for new coffee lovers. Comes in a reusable box with coffee gear and instructions.",
    price: 39.99,
    picture: "https://images.unsplash.com/photo-1670594061876-cc8f3e3ad998?auto=format&fit=crop&q=80&w=1000",
    rating: 4.9,
    numReviews: 52,
    stock: true,
    categoryId: "Gift Sets",
    popularity: 10,
    badges: ["Best Seller"],
    ingredients: ["Coffee Beans", "Mug", "Guide"],
    origin: "Mixed",
    distributor: "Gift Box Co.",
    discount: 0,
    status: "active",
    warrantyStatus: "none",
    costRatio: 0.6,
    serialNumber: "G001",
    model: "MorningRitual-2024"
  },
  {
    productId: 11,
    name: "Holiday Cheer Coffee Set",
    description: "2 seasonal blends + festive wrap.",
    longDescription: "Celebrate with our special holiday blend duo, wrapped in festive packaging and ready to gift.",
    price: 34.95,
    picture: "https://images.unsplash.com/photo-1600096194940-5b3b5fdf12d2?auto=format&fit=crop&q=80&w=1000",
    rating: 4.7,
    numReviews: 40,
    stock: true,
    categoryId: "Gift Sets",
    popularity: 9,
    badges: [],
    ingredients: ["Holiday Roast A", "Holiday Roast B"],
    origin: "Guatemala & Honduras",  
    distributor: "Holiday Gifts Inc.",
    discount: 0,
    status: "active",
    warrantyStatus: "none",
    costRatio: 0.55,
    serialNumber: "G002",
    model: "HolidaySet-2024"
  }
];
*/

interface Category {
  id: number;
  name: string;
}

const ProductIndex = () => {
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [sortOption, setSortOption] = useState('popularity');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedRoast, setSelectedRoast] = useState<string | null>(null);
  const [selectedOrigin, setSelectedOrigin] = useState<string | null>(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories first
        const categoriesResponse = await getAllCategories();
        setCategories(categoriesResponse);

        // Fetch products
        const productsResponse = await getAllProducts();
        console.log('Raw products data from backend:', productsResponse);
        
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
          categoryId: product.category_id || product.categoryId,
          price: Number(product.price) || 0,
          rating: Number(product.rating) || 0,
          numReviews: Number(product.numReviews) || 0,
          categoryType: categoriesResponse.find(cat => cat.id === (product.category_id || product.categoryId))?.name || "Unknown Category"
        }));

        console.log('Transformed products:', transformedProducts);
        setProducts(transformedProducts);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Get unique categories from categories state
  const uniqueCategories = useMemo(() => {
    return categories.map(category => ({
      id: category.id,
      name: category.name
    }));
  }, [categories]);
  
  // Calculate min and max prices from products
  const { minPrice, maxPrice } = useMemo(() => {
    const prices = products.map(product => product.price);
    return {
      minPrice: Math.floor(Math.min(...prices)),
      maxPrice: Math.ceil(Math.max(...prices))
    };
  }, [products]);
  
  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);
  
  // Get unique coffee origins
  const coffeeOrigins = useMemo(() => {
    return Array.from(new Set(products
      .filter(product => product.categoryId === 1) // Assuming 1 is the ID for Coffee Beans
      .map(product => product.origin)));
  }, [products]);
  
  // Filter products based on search, category, price, and availability
  const filteredproducts = useMemo(() => {
    console.log('Current products state:', products);
    let filtered = [...products];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(product => product.categoryId === selectedCategory);
    }

    // Apply roast level filter
    if (selectedRoast && selectedCategory === 1) {
      filtered = filtered.filter(product => product.roastLevel === selectedRoast);
    }

    // Apply origin filter
    if (selectedOrigin && selectedCategory === 1) {
      filtered = filtered.filter(product => product.origin === selectedOrigin);
    }

    // Apply stock filter
    if (inStockOnly) {
      filtered = filtered.filter(product => product.stock);
    }

    console.log('Filtered products:', filtered);
    return filtered;
  }, [products, searchTerm, selectedCategory, selectedRoast, selectedOrigin, inStockOnly]);
  
  // Sort products
  const sortedproducts = useMemo(() => {
    console.log('Filtered products before sorting:', filteredproducts);
    let filtered = [...filteredproducts];

    // Apply sorting
    switch (sortOption) {
      case 'priceLow':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'priceHigh':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default: // popularity
        filtered.sort((a, b) => b.popularity - a.popularity);
    }

    console.log('Sorted products:', filtered);
    return filtered;
  }, [filteredproducts, sortOption]);

  useEffect(() => {
    console.log('Products state updated:', products);
  }, [products]);

  return (
    <div className="min-h-screen bg-driftmood-cream">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <ProductFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sortOption={sortOption}
            setSortOption={setSortOption}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar with filters */}
          <div className="md:w-1/4 lg:w-1/5">
            <FilterSidebar
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              inStockOnly={inStockOnly}
              onInStockChange={setInStockOnly}
              minPrice={minPrice}
              maxPrice={maxPrice}
              selectedRoast={selectedRoast}
              onRoastChange={setSelectedRoast}
              selectedOrigin={selectedOrigin}
              onOriginChange={setSelectedOrigin}
              coffeeOrigins={coffeeOrigins}
            />
          </div>
          
          {/* Product grid */}
          <div className="md:w-3/4 lg:w-4/5">
            {sortedproducts.length === 0 ? (
              <div className="bg-white border border-driftmood-lightlime rounded-xl p-8 text-center">
                <h3 className="font-serif text-xl font-medium text-driftmood-dark mb-2">
                  No products found
                </h3>
                <p className="text-driftmood-brown mb-4">
                  We couldn't find any products matching your search criteria.
                </p>
                <button
                  className="btn-secondary"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory(null);
                    setPriceRange([minPrice, maxPrice]);
                    setInStockOnly(false);
                    setSortOption('popularity');
                    setSelectedRoast(null);
                    setSelectedOrigin(null);
                  }}
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedproducts.map((product) => (
                  <ProductCard key={product.productId} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductIndex;