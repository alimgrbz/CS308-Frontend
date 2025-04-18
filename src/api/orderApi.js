import axiosInstance from './axiosConfig';

export const getOrdersByUser = async (token) => {
  const response = await axiosInstance.post('/api/orders/getOrdersByUser', {
    token
  });

  return response.data.orders; // returns the array of orders
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