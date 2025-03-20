
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ProductCard.css';

const ProductCard = ({ product }) => {
  const { id, name, price, description, inStock } = product;

  return (
    <div className={`product-card ${!inStock ? 'out-of-stock' : ''}`}>
      <Link to={`/product/${id}`}>
        <div className="product-info">
          <h3 className="product-name">{name}</h3>
          <p className="product-description">{description}</p>
          <div className="product-price">${price.toFixed(2)}</div>
          {!inStock && <div className="out-of-stock-label">Out of Stock</div>}
        </div>
      </Link>
      <button 
        className="add-to-cart-btn" 
        disabled={!inStock}
        onClick={(e) => {
          e.preventDefault();
          if (inStock) {
            console.log(`Added ${name} to cart`);
            // Implement add to cart functionality here
          }
        }}
      >
        {inStock ? 'Add to Cart' : 'Out of Stock'}
      </button>
    </div>
  );
};

export default ProductCard;
