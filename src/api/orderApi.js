import axiosInstance from './axiosConfig';

export const getOrdersByUser = async (token) => {
  const response = await axiosInstance.post('/api/orders/getOrdersByUser', {
    token
  });

  return response.data.orders; // returns the array of orders
};
