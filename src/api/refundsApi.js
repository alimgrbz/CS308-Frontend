// refundApi.js
import axiosInstance from './axiosConfig';

// 1. Request a refund
export const requestRefund = async (token, orderId, productId, quantity) => {
  const response = await axiosInstance.post('http://localhost:5000/api/refunds/requestRefund', {
    token,
    orderId,
    productId,
    quantity,
  }, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

// 2. Sales manager makes a decision on a refund
export const refundDecision = async (token, refundId, decision) => {
  try {
    const response = await axiosInstance.post('http://localhost:5000/api/refunds/refundDecision', 
      {
        token,
        refundId,
        decision,
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error making refund decision:", error);
    throw error;
  }
};

// 3. Get refunds requested by a user (customer-side view)
export const getRefundsByUser = async (token) => {
  try {
    const response = await axiosInstance.post('http://localhost:5000/api/refunds/refundsByUser', 
      { token },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error getting refunds by user:", error);
    return { refunds: [] }; // Return a safe default value
  }
};

// 4. Get all refund requests (sales manager view)
export const getAllRefunds = async (token) => {
  const response = await axiosInstance.get('http://localhost:5000/api/refunds/all', {
    token,
  }, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};
