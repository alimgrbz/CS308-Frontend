import axiosInstance from './axiosConfig';

// Get all products
export const getAllProducts = async () => {
    console.log('Fetching products from backend');
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
export const setPrice = async (token, productId, price) => {
    const response = await axiosInstance.post('/api/products/setPrice', {
        token,
        productId,
        price
    });
    return response.data;
};

// Add product (POST, with token)
export const addProductWithToken = async (token, productData) => {
    const response = await axiosInstance.post('/api/products/add', {
        token,
        ...productData
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