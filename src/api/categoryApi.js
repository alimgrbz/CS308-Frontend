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

export const addCategoryByProductManager = async (categoryName) => {
    const token = localStorage.getItem('token');
    const response = await axiosInstance.post('/api/categories/add',
        { name: categoryName },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};
