import axiosInstance from './axiosConfig';

export const getCommentsByProduct = async (productId) => {
  try {

    const response = await axiosInstance.post('/api/comments/', {
      productId
    });

    return response.data.comments; // returns the array of comments
  } catch (error) {
    console.error('Failed to fetch comments:', error);
    return []; // fallback if there's an error
  }
};