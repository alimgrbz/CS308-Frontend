import axios from 'axios';

export const getRatingsByProduct = async (productId) => {
  try {
    const response = await axios.post('http://localhost:5000/api/rates/getall', {
      product_id: productId
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching ratings:', error);
    throw error;
  }
};
