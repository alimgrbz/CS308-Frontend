import axiosInstance from './axiosConfig';

// Add multiple products to the cart
export const addToCart = async (token, products) => {
  const response = await axiosInstance.post('/carts/add', {
    token,
    products,
  });
  return response.data;
};

// Get all products in the cart
export const getCart = async (token) => {
  const response = await axiosInstance.post('/carts', {
    token,
  });
  return response.data.products; // returns array of products with count
};

// Remove a product from the cart
export const removeCartItem = async (token, productId, quantity) => {
  const response = await axiosInstance.post('/carts/remove', {
    token,
    productId,
    quantity,
  });
  return response.data;
};

// Clear the entire cart (if endpoint exists)
export const clearCart = async (token) => {
  const response = await axiosInstance.post('/carts/clear', {
    token,
  });
  return response.data;
};