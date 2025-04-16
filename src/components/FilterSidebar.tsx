import React, { useEffect, useState, useMemo } from 'react';
import FilterSidebar from '@/components/FilterSidebar';
import { getAllCategories } from '@/api/categoryApi';
import { getAllProducts } from '@/api/productApi';
import ProductCard from '@/components/ProductCard';

const ProductIndex = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedRoast, setSelectedRoast] = useState<string | null>(null);
  const [selectedOrigin, setSelectedOrigin] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedCategories = await getAllCategories();
      const fetchedProducts = await getAllProducts();

      setCategories(fetchedCategories);
      setProducts(fetchedProducts);

      const prices = fetchedProducts.map(p => parseFloat(p.price));
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      setPriceRange([min, max]);
    };
    fetchData();
  }, []);

  const categoryNameMap = useMemo(() => {
    const map = new Map<number, string>();
    categories.forEach(c => map.set(c.id, c.name));
    return map;
  }, [categories]);

  const categoryNames = categories.map(c => c.name);

  useEffect(() => {
    const filtered = products.filter(p => {
      const price = parseFloat(p.price);
      const categoryMatch = selectedCategory
        ? categoryNameMap.get(p.category_id) === selectedCategory
        : true;
      const stockMatch = inStockOnly ? p.stock > 0 : true;

      const roastMatch = selectedRoast ? p.description.toLowerCase().includes(selectedRoast.toLowerCase()) : true;
      const originMatch = selectedOrigin ? p.distributor === selectedOrigin : true;

      return (
        categoryMatch &&
        price >= priceRange[0] &&
        price <= priceRange[1] &&
        stockMatch &&
        roastMatch &&
        originMatch
      );
    });
    setFilteredProducts(filtered);
  }, [products, selectedCategory, priceRange, inStockOnly, selectedRoast, selectedOrigin, categoryNameMap]);

  const allPrices = products.map(p => parseFloat(p.price));
  const minPrice = Math.min(...allPrices);
  const maxPrice = Math.max(...allPrices);

  const coffeeOrigins = Array.from(new Set(products.map(p => p.distributor)));

  return (
    <div className="flex gap-6">
      <FilterSidebar
        categories={categoryNames}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        inStockOnly={inStockOnly}
        onInStockChange={setInStockOnly}
        selectedRoast={selectedRoast}
        onRoastChange={setSelectedRoast}
        selectedOrigin={selectedOrigin}
        onOriginChange={setSelectedOrigin}
        minPrice={minPrice}
        maxPrice={maxPrice}
        coffeeOrigins={coffeeOrigins}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 flex-1">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductIndex;
