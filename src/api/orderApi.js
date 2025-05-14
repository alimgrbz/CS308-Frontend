import axiosInstance from './axiosConfig';

export const getOrdersByUser = async (token) => {
  const response = await axiosInstance.post('/api/orders/getOrdersByUser', {
    token
  });
  return response.data.orders;
};

export const getOrderInvoice = async (token, orderId) => {
  const response = await axiosInstance.post('/api/orders/getInvoice', {
    token,
    orderId: String(orderId)
  });

  console.log("🧾 Invoice API response:", response.data); // 🔍 add this

  if (!response.data || !response.data.invoiceBase64) {
    throw new Error("Invalid response format from server");
  }

  return response.data.invoiceBase64;
};


export const createOrder = async (token) => {
  const response = await axiosInstance.post('/api/orders/checkout', {
    token
  });
  return response.data;
};


// orderApi.js
export const getAll = async (token) => {
  try {
    const response = await axiosInstance.post('/api/items/getAll', {
      token
    });
    return response.data;
  } catch (error) {
    console.error("Fetching all items failed:", error);
    throw error;
  }
};


export const getRevenueGraph = async (token, startDate, endDate) => {
  const response = await axiosInstance.post('/api/orders/revenueGraph', {
    token,
    startDate,
    endDate,
  });
  return response.data.data; // or .data if the shape is different
};

export const acceptRefund = async ({ token, orderId }) => {
  const response = await axiosInstance.post('/api/orders/acceptRefund', { token, orderId });
  return response.data;
};
  
export const getAllOrders = async (token) => {
  try {
    const response = await axiosInstance.post('/api/orders/all', {
      token
    });
    return response.data.orders; 
  } catch (error) {
    console.error("Fetching all orders failed:", error);
    throw error;
  }
};

