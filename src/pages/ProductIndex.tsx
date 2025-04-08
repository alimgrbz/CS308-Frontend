import React, { useState, useMemo } from 'react';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import ProductCard from '@/components/ProductCard';
import ProductFilters from '@/components/ProductFilters';
import FilterSidebar from '@/components/FilterSidebar';
import Logo from '@/components/Logo';
import { Link } from 'react-router-dom';

// Sample product data
const PRODUCTS = [
  // Coffee Beans
  {
    id: 1,
    name: "Ethiopian Yirgacheffe Beans",
    description: "Floral and citrusy light roast coffee beans.",
    longDescription: "Sourced from the Yirgacheffe region, these light roast beans offer floral aromatics and bright citrus flavors. Perfect for pour-over and filter brewing methods.",
    price: 16.99,
    image: "https://images.unsplash.com/photo-1587730746644-3fbc4c37ab44?auto=format&fit=crop&q=80&w=1000",
    rating: 4.8,
    numReviews: 45,
    inStock: true,
    category: "Coffee Beans",
    popularity: 10,
    badges: ["Best Seller"],
    ingredients: ["100% Arabica beans"],
    roastLevel: "Light",
    origin: "Ethiopia"
  },
  {
    id: 2,
    name: "Cold Brew Blend",
    description: "Coarse ground beans perfect for cold brew.",
    longDescription: "A smooth and rich blend crafted for cold brewing. With notes of chocolate and almond, it's refreshing and bold when steeped overnight.",
    price: 15.50,
    image: "https://images.unsplash.com/photo-1566378249362-804c4112a3d3?auto=format&fit=crop&q=80&w=1000",
    rating: 4.6,
    numReviews: 34,
    inStock: true,
    category: "Coffee Beans",
    popularity: 9,
    badges: [],
    ingredients: ["Arabica blend"],
    roastLevel: "Medium",
    origin: "Colombia & Brazil"
  },
  {
    id: 3,
    name: "Dark Roast Espresso",
    description: "Bold and intense espresso blend.",
    longDescription: "Deep roast with a smoky aroma and bold taste, best for espresso lovers.",
    price: 17.99,
    image: "https://images.unsplash.com/photo-1587305701203-c4b4cc2436d7?auto=format&fit=crop&q=80&w=1000",
    rating: 4.7,
    numReviews: 39,
    inStock: true,
    category: "Coffee Beans",
    popularity: 9,
    badges: [],
    ingredients: ["Arabica", "Robusta"],
    roastLevel: "Dark",
    origin: "Brazil & Indonesia"
  },

  // Tea
  {
    id: 12,
    name: "Jasmine Green Tea",
    description: "Delicate green tea with jasmine blossoms.",
    longDescription: "Green tea leaves from China, scented with jasmine. Light and aromatic.",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?auto=format&fit=crop&q=80&w=1000",
    rating: 4.2,
    numReviews: 16,
    inStock: true,
    category: "Tea",
    popularity: 7,
    badges: ["Best Seller"],
    ingredients: ["Green tea", "Jasmine"],
    origin: "China"
  },
  {
    id: 13,
    name: "Chai Spice Blend",
    description: "Traditional black tea with aromatic spices.",
    longDescription: "Aromatic blend with cinnamon, cardamom, cloves. Brew with milk for masala chai.",
    price: 13.99,
    image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&q=80&w=1000",
    rating: 4.6,
    numReviews: 35,
    inStock: false,
    category: "Tea",
    popularity: 8,
    badges: [],
    ingredients: ["Black tea", "Spices"],
    origin: "India"
  },
  {
    id: 14,
    name: "Earl Grey Supreme",
    description: "Citrusy black tea with bergamot oil.",
    longDescription: "Classic Earl Grey recipe upgraded with blue cornflower petals and extra bergamot.",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&q=80&w=1000",
    rating: 4.7,
    numReviews: 23,
    inStock: true,
    category: "Tea",
    popularity: 8,
    badges: [],
    ingredients: ["Black tea", "Bergamot"],
    origin: "Sri Lanka & India"
  },  

  // Brewing Equipment
  {
    id: 4,
    name: "French Press Brewer",
    description: "Classic 1-liter glass French Press.",
    longDescription: "Crafted with borosilicate glass and stainless steel, our 1-liter French Press delivers full-bodied coffee with ease.",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1577985025774-699de1fe52f0?auto=format&fit=crop&q=80&w=1000",
    rating: 4.7,
    numReviews: 25,
    inStock: true,
    category: "Brewing Equipment",
    popularity: 8,
    badges: ["Best Seller"],
    ingredients: [],
    origin: "Imported"
  },
  {
    id: 5,
    name: "Manual Coffee Grinder",
    description: "Stainless steel burr grinder with precision settings.",
    longDescription: "A compact manual grinder with adjustable settings for pour-over, espresso, or French press.",
    price: 24.95,
    image: "https://images.unsplash.com/photo-1559115264-25824d92f71f?auto=format&fit=crop&q=80&w=1000",
    rating: 4.4,
    numReviews: 18,
    inStock: false,
    category: "Brewing Equipment",
    popularity: 7,
    badges: [],
    ingredients: [],
    origin: "Japan"
  },
  {
    id: 6,
    name: "Gooseneck Pour Over Kettle",
    description: "Precision pour kettle with thermometer.",
    longDescription: "Stainless steel kettle with a slim spout and integrated thermometer for perfect pour control.",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1661251487856-3e547df0bfc3?auto=format&fit=crop&q=80&w=1000",
    rating: 4.9,
    numReviews: 32,
    inStock: true,
    category: "Brewing Equipment",
    popularity: 10,
    badges: [],
    ingredients: [],
    origin: "Korea"
  },

  // Accessories & Merch
  {
    id: 7,
    name: "DriftMood Mug",
    description: "Matte black ceramic mug with logo.",
    longDescription: "12 oz matte ceramic mug. Microwave/dishwasher safe. Minimalist design.",
    price: 11.99,
    image: "https://images.unsplash.com/photo-1517686469429-8bdb7a6b84cd?auto=format&fit=crop&q=80&w=1000",
    rating: 4.5,
    numReviews: 22,
    inStock: true,
    category: "Accessories & Merch",
    popularity: 9,
    badges: ["Best Seller"],
    ingredients: [],
    origin: "Turkey"
  },
  {
    id: 8,
    name: "Barista Tote Bag",
    description: "Cotton tote bag with coffee art.",
    longDescription: "Eco tote bag made from organic cotton, printed with barista-themed artwork.",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1621170728027-5892d26d4411?auto=format&fit=crop&q=80&w=1000",
    rating: 4.3,
    numReviews: 15,
    inStock: true,
    category: "Accessories & Merch",
    popularity: 6,
    badges: [],
    ingredients: [],
    origin: "Turkey"
  },
  {
    id: 9,
    name: "Coffee Sticker Set",
    description: "Set of 3 stickers: bean, mug, grinder.",
    longDescription: "Add flair to your bag or jacket with this sticker trio inspired by coffee life.",
    price: 9.99,
    image: "https://images.unsplash.com/photo-1558449028-8b28fe774c73?auto=format&fit=crop&q=80&w=1000",
    rating: 4.2,
    numReviews: 12,
    inStock: true,
    category: "Accessories & Merch",
    popularity: 5,
    badges: [],
    ingredients: [],
    origin: "USA"
  },

  // Gift Sets
  {
    id: 10,
    name: "Morning Ritual Gift Box",
    description: "Beans, mug, and brewing guide.",
    longDescription: "Perfect gift for new coffee lovers. Comes in a reusable box with coffee gear and instructions.",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1670594061876-cc8f3e3ad998?auto=format&fit=crop&q=80&w=1000",
    rating: 4.9,
    numReviews: 52,
    inStock: true,
    category: "Gift Sets",
    popularity: 10,
    badges: ["Best Seller"],
    ingredients: ["Coffee Beans", "Mug", "Guide"],
    origin: "Mixed"
  },
  {
    id: 11,
    name: "Holiday Cheer Coffee Set",
    description: "2 seasonal blends + festive wrap.",
    longDescription: "Celebrate with our special holiday blend duo, wrapped in festive packaging and ready to gift.",
    price: 34.95,
    image: "https://images.unsplash.com/photo-1600096194940-5b3b5fdf12d2?auto=format&fit=crop&q=80&w=1000",
    rating: 4.7,
    numReviews: 40,
    inStock: true,
    category: "Gift Sets",
    popularity: 9,
    badges: [],
    ingredients: ["Holiday Roast A", "Holiday Roast B"],
    origin: "Guatemala & Honduras"
  }
];

const ProductIndex = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortOption, setSortOption] = useState('popularity');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedRoast, setSelectedRoast] = useState<string | null>(null);
  const [selectedOrigin, setSelectedOrigin] = useState<string | null>(null);
  
  // Get unique categories from products
  const categories = useMemo(() => {
    return Array.from(new Set(PRODUCTS.map(product => product.category)));
  }, []);
  
  // Calculate min and max prices from products
  const { minPrice, maxPrice } = useMemo(() => {
    const prices = PRODUCTS.map(product => product.price);
    return {
      minPrice: Math.floor(Math.min(...prices)),
      maxPrice: Math.ceil(Math.max(...prices))
    };
  }, []);
  
  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);
  
  // Get unique coffee origins
  const coffeeOrigins = useMemo(() => {
    return Array.from(new Set(PRODUCTS
      .filter(product => product.category === "Coffee Beans")
      .map(product => product.origin)));
  }, []);
  
  // Filter products based on search, category, price, and availability
  const filteredProducts = useMemo(() => {
    let filtered = [...PRODUCTS];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Apply roast level filter
    if (selectedRoast && selectedCategory === "Coffee Beans") {
      filtered = filtered.filter(product => product.roastLevel === selectedRoast);
    }

    // Apply origin filter
    if (selectedOrigin && selectedCategory === "Coffee Beans") {
      filtered = filtered.filter(product => product.origin === selectedOrigin);
    }

    // Apply price filter
    if (inStockOnly) {
      filtered = filtered.filter(product => product.inStock);
    }

    return filtered;
  }, [searchTerm, selectedCategory, selectedRoast, selectedOrigin, inStockOnly]);
  
  // Sort products
  const sortedProducts = useMemo(() => {
    let filtered = [...filteredProducts];

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

    return filtered;
  }, [filteredProducts, sortOption]);

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
            {sortedProducts.length === 0 ? (
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
                {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
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
export { PRODUCTS };