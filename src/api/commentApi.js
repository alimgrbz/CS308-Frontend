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


export const addComment = async (token, productId, comment) => {
  try {
    const response = await axiosInstance.post('/api/comments/add', {
      token,
      productId,
      comment
    });
    return response.data;
  } catch (error) {
    console.error("Failed to add comment:", error);
    throw error;
  }
};

export const getCommentsByUser = async (token) => {
  try {
    const response = await axiosInstance.post('/api/comments/by-user', {
      token
    });
    return response.data.comments;
  } catch (error) {
    console.error('Error fetching user comments:', error);
    throw error;
  }
};
