import axiosInstance from './axiosConfig';

// Get all products
export const getAllProducts = async () => {
    console.log('Fetching products from backend');
    const response = await axiosInstance.get('/api/products');
    return response.data.products;
};
/*
// Get product by ID
export const getProductById = async (productId) => {
    const response = await axiosInstance.get(`/api/products/${productId}`);
    return response.data;
};
*/
// Get products by category
export const getProductsByCategory = async (categoryId) => {
    const response = await axiosInstance.get(`/api/products/category/${categoryId}`);
    return response.data.products;
};
/*
// Search products
export const searchProducts = async (searchTerm) => {
    const response = await axiosInstance.get(`/api/products/search?q=${searchTerm}`);
    return response.data.products;
};

// Filter products
export const filterProducts = async (filters) => {
    const response = await axiosInstance.post('/api/products/filter', filters);
    return response.data.products;
}; 

*/

export const getStockById = async (productId) => {
  try {
    const res = await axiosInstance.post('/api/products/get-stock', { productId });
    return res.data.stock;
  } catch (error) {
    console.error('Error fetching stock:', error);
    return null;
  }
};