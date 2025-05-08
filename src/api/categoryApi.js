import axiosInstance from './axiosConfig';

export const getAllCategories = async () => {
    console.log('Fetching categories from backend');
    const response = await axiosInstance.get('/api/categories');
    return response.data.categories;
};

export const addCategory = async (categoryName) => {
    const response = await axiosInstance.post('/api/categories', {
        name: categoryName
    });
    return response.data;
};

export const deleteCategory = async (categoryId) => {
    const response = await axiosInstance.delete(`/api/categories/${categoryId}`);
    return response.data;
};