
import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import '../styles/HomePage.css';

// Sample featured products - replace with actual data in a real app
const featuredProducts = [
  {
    id: 1,
    name: 'Sumatra Dark Roast',
    price: 16.99,
    image: 'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    description: 'Bold, earthy flavors with low acidity and a smooth finish.',
    inStock: true
  },
  {
    id: 2,
    name: 'Ethiopia Light Roast',
    price: 18.99,
    image: 'https://images.unsplash.com/photo-1580933073521-dc51f22e6b72?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    description: 'Bright and fruity with notes of blueberry and citrus.',
    inStock: true
  },
  {
    id: 3,
    name: 'Colombia Medium Roast',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1598908314732-07113901949e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    description: 'Sweet caramel notes with a hint of nuttiness and cocoa.',
    inStock: false
  },
  {
    id: 4,
    name: 'Driftmood Espresso Blend',
    price: 17.99,
    image: 'https://images.unsplash.com/photo-1565600424568-8a868bb1ee25?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
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
            <h1>Experience Coffee in Every Sip</h1>
            <p>Artisanal coffee roasted to perfection, delivered to your doorstep.</p>
            <div className="hero-buttons">
              <Link to="/products" className="button">Shop Now</Link>
              <Link to="/about" className="button secondary">Our Story</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="categories-grid">
            <Link to="/products/coffee-beans" className="category-card">
              <div className="category-image">
                <img src="https://images.unsplash.com/photo-1621784562807-371034596d3c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Coffee Beans" />
              </div>
              <h3>Coffee Beans</h3>
            </Link>
            <Link to="/products/brewing-equipment" className="category-card">
              <div className="category-image">
                <img src="https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Brewing Equipment" />
              </div>
              <h3>Brewing Equipment</h3>
            </Link>
            <Link to="/products/accessories" className="category-card">
              <div className="category-image">
                <img src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Accessories" />
              </div>
              <h3>Accessories</h3>
            </Link>
            <Link to="/products/gifts" className="category-card">
              <div className="category-image">
                <img src="https://images.unsplash.com/photo-1606791405792-1004f1d5e60a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Gift Sets" />
              </div>
              <h3>Gift Sets</h3>
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

      <section className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-image">
              <img src="https://images.unsplash.com/photo-1541167760496-1628856ab772?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="About Driftmood Coffee" />
            </div>
            <div className="about-text">
              <h2>Our Passion for Coffee</h2>
              <p>At Driftmood Coffee, we believe that the perfect cup starts with the perfect bean. Our master roasters travel the world to find the highest quality, sustainably sourced coffee beans.</p>
              <p>Each small batch is carefully roasted to bring out the unique character and flavor profile, resulting in a coffee experience like no other.</p>
              <Link to="/about" className="button secondary">Learn More</Link>
            </div>
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
