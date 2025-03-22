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
  {
    id: 1,
    name: "Morning Blend Coffee",
    description: "Medium roast with notes of caramel and chocolate.",
    longDescription: "Our signature Morning Blend is perfect for starting your day. This medium roast coffee features beans from Ethiopia and Colombia, creating a balanced cup with sweet notes of caramel and dark chocolate. The smooth finish makes it ideal for everyday drinking.",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1598530222482-9a558111416d?auto=format&fit=crop&q=80&w=1000",
    rating: 4.5,
    numReviews: 28,
    inStock: true,
    category: "Coffee",
    popularity: 9,
    ingredients: ["Arabica beans", "Robusta beans"],
    origin: "Ethiopia & Colombia"
  },
  {
    id: 2,
    name: "Jasmine Green Tea",
    description: "Delicate green tea scented with jasmine blossoms.",
    longDescription: "Our Jasmine Green Tea is a classic favorite. We start with high-quality green tea leaves from the mountains of China, then scent them with fresh jasmine blossoms. The result is a delicate, aromatic tea with a smooth, slightly sweet finish.",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?auto=format&fit=crop&q=80&w=1000",
    rating: 4.2,
    numReviews: 16,
    inStock: true,
    category: "Tea",
    popularity: 7,
    ingredients: ["Green tea leaves", "Jasmine blossoms"],
    origin: "China"
  },
  {
    id: 3,
    name: "Dark Roast Espresso",
    description: "Bold and intense with rich crema, perfect for espresso machines.",
    longDescription: "Our Dark Roast Espresso blend delivers a bold, intense flavor profile with a rich crema. Crafted specifically for espresso machines, this blend combines beans from Brazil and Indonesia for notes of dark chocolate and a subtle smokiness.",
    price: 16.99,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=1000",
    rating: 4.8,
    numReviews: 42,
    inStock: true,
    category: "Coffee",
    popularity: 10,
    ingredients: ["Arabica beans", "Robusta beans"],
    origin: "Brazil & Indonesia"
  },
  {
    id: 4,
    name: "Chai Tea Blend",
    description: "Spicy and aromatic with cinnamon, cardamom, and ginger.",
    longDescription: "Our signature Chai Tea Blend combines premium black tea with aromatic spices including cinnamon, cardamom, ginger, and cloves. This traditional recipe creates a warming, spicy cup that can be enjoyed with milk for a classic chai experience.",
    price: 13.99,
    image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&q=80&w=1000",
    rating: 4.6,
    numReviews: 35,
    inStock: false,
    category: "Tea",
    popularity: 8,
    ingredients: ["Black tea", "Cinnamon", "Cardamom", "Ginger", "Cloves"],
    origin: "India"
  },
  {
    id: 5,
    name: "Vanilla Caramel Coffee",
    description: "Sweet and smooth with natural vanilla and caramel flavors.",
    longDescription: "Our Vanilla Caramel Coffee combines medium roasted beans with natural vanilla and caramel flavors for a sweet, smooth cup. The perfect indulgence for those who enjoy flavored coffee without overwhelming sweetness.",
    price: 15.99,
    image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&q=80&w=1000",
    rating: 4.3,
    numReviews: 19,
    inStock: true,
    category: "Coffee",
    popularity: 7,
    ingredients: ["Arabica beans", "Natural vanilla flavor", "Natural caramel flavor"],
    origin: "Colombia"
  },
  {
    id: 6,
    name: "Earl Grey Supreme",
    description: "Classic black tea infused with bergamot oil and blue cornflower petals.",
    longDescription: "Our Earl Grey Supreme enhances the classic recipe with additional bergamot oil and blue cornflower petals. The result is a more aromatic, flavorful cup with the characteristic citrus notes that Earl Grey lovers appreciate.",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&q=80&w=1000",
    rating: 4.7,
    numReviews: 23,
    inStock: true,
    category: "Tea",
    popularity: 8,
    ingredients: ["Black tea", "Bergamot oil", "Blue cornflower petals"],
    origin: "Sri Lanka & India"
  },
];

const ProductIndex = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortOption, setSortOption] = useState('popularity');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  
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

    // Apply price filter
    if (inStockOnly) {
      filtered = filtered.filter(product => product.inStock);
    }

    return filtered;
  }, [searchTerm, selectedCategory, inStockOnly]);
  
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
                  }}
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={{
                      id: product.id,
                      name: product.name,
                      description: product.description,
                      price: product.price,
                      image: product.image,
                      rating: product.rating,
                      numReviews: product.numReviews,
                      inStock: product.inStock,
                      category: product.category,
                      popularity: product.popularity
                    }}
                  />
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