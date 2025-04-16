import axiosInstance from './axiosConfig';

export const getAllCategories = async () => {
    console.log('Fetching categories from backend');
    const response = await axiosInstance.get('/api/categories');
    return response.data.categories;
};