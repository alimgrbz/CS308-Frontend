import axiosInstance from './axiosConfig';

export const getWishlist = async (token) => {
  const response = await axiosInstance.post("/wishlists/get", { token });
  return response.data;
};

export const addProductToWishlist = async (token, productId) => {
  const response = await axiosInstance.post("/wishlists/add", {
    token,
    productId,
  });
  return response.data;
};

export const removeProductFromWishlist = async (token, productId) => {
  const response = await axiosInstance.post("/wishlists/remove", {
    token,
    productId,
  });
  return response.data;
};

export const clearWishlist = async (token) => {
  const response = await axiosInstance.post("/wishlists/clear", { token });
  return response.data;
};