import axiosInstance from './axiosConfig';

// Get all products
export const getAllProducts = async () => {
    const response = await axiosInstance.get('/api/products');
    return response.data.products; 
  };
  
  
  

// Get product by ID
export const getProductById = async (productId) => {
    const response = await axiosInstance.get(`/api/products/${productId}`);
    return response.data;
};

// Get products by category
export const getProductsByCategory = async (categoryId) => {
    const response = await axiosInstance.get(`/api/products/category/${categoryId}`);
    return response.data.products;
};

// Add new product
export const addProduct = async (productData) => {
    const response = await axiosInstance.post('/api/products', productData);
    return response.data;
};

// Update product
export const updateProduct = async (productId, productData) => {
    const response = await axiosInstance.put(`/api/products/${productId}`, productData);
    return response.data;
};

// Delete product
export const deleteProduct = async (productId) => {
    const response = await axiosInstance.delete(`/api/products/${productId}`);
    return response.data;
};

export const getStockById = async (productId) => {
    try {
        const res = await axiosInstance.post('/api/products/get-stock', { productId });
        return res.data.stock;
    } catch (error) {
        console.error('Error fetching stock:', error);
        return null;
    }
};

// Get product stock (POST)
export const getStock = async (productId) => {
    const response = await axiosInstance.post('/api/products/get-stock', { productId });
    return response.data.stock;
};

// Set product price (POST)
export const setPrice = async ({ token, productId, price }) => {
    const response = await axiosInstance.post(
      '/api/products/setPrice',
      { productId, price },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  };
  
  

// Add new product (with token)
export const addProductWithToken = async (productData) => {
    const token = localStorage.getItem('token');
    const response = await axiosInstance.post('/api/products/add', productData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

// Set product stock (POST)
export const setStock = async (token, productId, stock) => {
    const response = await axiosInstance.post('/api/products/set-stock', {
        token,
        productId,
        stock
    });
    return response.data;
};

export const setDiscount = async (token, productId, discount) => {
    return await axiosInstance.post(
      '/api/products/setDiscount',
      { productId, discount },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  };


  
