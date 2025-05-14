// refundApi.js
import axiosInstance from './axiosConfig';

// 1. Request a refund
export const requestRefund = async (token, orderId, productId, quantity) => {
  const response = await axiosInstance.post('http://localhost:5000/api/refunds/requestRefund', {
    token,
    orderId,
    productId,
    quantity,
  });
  return response.data;
};

// 2. Sales manager makes a decision on a refund
export const refundDecision = async (token, refundId, decision) => {
  const response = await axiosInstance.post('http://localhost:5000/api/refunds/refundDecision', {
    token,
    refundId,
    decision,
  });
  return response.data;
};

// 3. Get refunds requested by a user (customer-side view)
export const getRefundsByUser = async (token) => {
  const response = await axiosInstance.post('http://localhost:5000/api/refunds/refundsByUser', {
    token,
  });
  return response.data;
};

// 4. Get all refund requests (sales manager view)
export const getAllRefunds = async (token) => {
  const response = await axiosInstance.post('http://localhost:5000/api/refunds/all', {
    token,
  });
  return response.data;
};
