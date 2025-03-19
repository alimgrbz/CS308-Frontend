import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import '../styles/HomePage.css';

const featuredProducts = [
  {
    id: 1,
    name: 'Sumatra Dark Roast',
    price: 16.99,
    description: 'Bold, earthy flavors with low acidity and a smooth finish.',
    inStock: true
  },
  {
    id: 2,
    name: 'Ethiopia Light Roast',
    price: 18.99,
    description: 'Bright and fruity with notes of blueberry and citrus.',
    inStock: true
  },
  {
    id: 3,
    name: 'Colombia Medium Roast',
    price: 15.99,
    description: 'Sweet caramel notes with a hint of nuttiness and cocoa.',
    inStock: false
  },
  {
    id: 4,
    name: 'Driftmood Espresso Blend',
    price: 17.99,
    description: 'Rich, full-bodied blend perfect for espresso machines.',
    inStock: true
  }
];

const HomePage = () => {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1>Welcome to DriftMood Coffee</h1>
            <p>Let your mood drift with every sip</p>
            <Link to="/products" className="cta-button">Shop Now</Link>
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
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="view-all-link">
            <Link to="/products">View All Products</Link>
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
