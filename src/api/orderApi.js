import axiosInstance from './axiosConfig';

export const getOrdersByUser = async (token) => {
  const response = await axiosInstance.post('/api/orders/getOrdersByUser', {
    token
  });

  return response.data.orders; // returns the array of orders
};

export const getOrderInvoice = async (token, orderId) => {
  try {
    console.log("Requesting invoice for order:", orderId);
    const response = await axiosInstance.post('/api/orders/getInvoice', {
      token,
      orderId: String(orderId)
    });

    if (!response.data || !response.data.invoiceBase64) {
      console.error("Invalid response format from server:", response.data);
      throw new Error("Invalid response format from server");
    }

    console.log("Invoice received successfully");
    return response.data.invoiceBase64;
  } catch (error) {
    console.error("Failed to get invoice:", error.response?.data || error.message);
    throw error;
  }
};

export const createOrder = async (token) => {
  try {
    const response = await axiosInstance.post('/api/orders/checkout', {
      token
    });
    return response.data;
  } catch (error) {
    console.error("Checkout failed:", error);
    throw error;
  }
};

export const getAllOrders = async (token) => {
  try {
    console.log('Fetching all orders with token:', token);
    const response = await axiosInstance.post('/api/orders/all', {
      token
    });
    console.log('Received orders response:', response.data);
    if (!response.data || !response.data.orders) {
      console.error('Invalid response format:', response.data);
      throw new Error('Invalid response format from server');
    }
    return response.data.orders;
  } catch (error) {
    console.error("Failed to fetch all orders:", error.response?.data || error.message);
    throw error;
  }
};