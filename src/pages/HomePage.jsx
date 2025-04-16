import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import '../styles/HomePage.css';
import { getAllProducts } from '../api/productApi';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchAndSetRandomProducts = async () => {
      try {
        const response = await getAllProducts();
        const products = response.products || response.data || response;
        
        // Function to get random products
        const getRandomProducts = (products, count) => {
          const shuffled = [...products].sort(() => 0.5 - Math.random());
          return shuffled.slice(0, count);
        };

        const randomProducts = getRandomProducts(products, 4);
        // Ensure each product has a consistent ID field
        const processedProducts = randomProducts.map(product => ({
          ...product,
          productId: product.id || product.productId // Use id if productId doesn't exist
        }));
        setFeaturedProducts(processedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchAndSetRandomProducts();
  }, []);

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1>Welcome to DriftMood Coffee</h1>
            <p> Let your mood drift with every sip </p>
            <div className="hero-buttons">
              <Link to="/products" className="button">Shop Now</Link>
              <Link to="/about" className="button secondary"> View More</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="categories-grid">
            <Link to="/products/coffee-beans" className="category-card">
              <div className="category-name">
                <h3>Coffee Beans</h3>
              </div>
            </Link>
            <Link to="/products/brewing-equipment" className="category-card">
              <div className="category-name">
                <h3>Brewing Equipment</h3>
              </div>
            </Link>
            <Link to="/products/accessories" className="category-card">
              <div className="category-name">
                <h3>Accessories</h3>
              </div>
            </Link>
            <Link to="/products/gifts" className="category-card">
              <div className="category-name">
                <h3>Gift Sets</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="featured-products-section">
        <div className="container">
          <h2 className="section-title">Featured Products</h2>
          <div className="products-grid">
            {featuredProducts.map(product => (
              <ProductCard key={product.productId} product={product} />
            ))}
          </div>
          <div className="view-all-link">
            <Link to="/products">View All Products</Link>
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title">What Our Customers Say</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"The Sumatra Dark Roast is absolutely incredible. Rich, complex flavor that makes my morning something to look forward to."</p>
                <div className="testimonial-author">- Sarah J.</div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"I've tried coffee from all over, but Driftmood's Ethiopia Light Roast stands out. The fruity notes are so vibrant!"</p>
                <div className="testimonial-author">- Michael T.</div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"Their subscription service is a game-changer. Fresh coffee delivered right when I need it, and I've discovered so many new favorites."</p>
                <div className="testimonial-author">- Emma R.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="subscription-section">
        <div className="container">
          <div className="subscription-content">
            <h2>Never Run Out of Great Coffee</h2>
            <p>Join our subscription service and receive freshly roasted coffee at your doorstep as often as you'd like.</p>
            <Link to="/subscriptions" className="button">Start Your Subscription</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
