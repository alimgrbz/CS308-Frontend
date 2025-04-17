import axiosInstance from './axiosConfig';

// Signin Function
export const signin = async (user) => {
    const response = await axiosInstance.post('/api/users/signin', user);
    console.log("User signed in:", response.data);
    return response.data;
};

// Signup Function
export const signup = async (newuser) => {
    const response = await axiosInstance.post('/api/users/signup', newuser);
    console.log("User registered:", response.data);
    return response.data;
};

// Get user profile
export const getProfile = async () => {
    const response = await axiosInstance.get('/api/users/profile');
    return response.data;
};

// Update user profile
export const updateProfile = async (profileData) => {
    const response = await axiosInstance.put('/api/users/profile', profileData);
    return response.data;
};

// Get user orders
export const getUserOrders = async () => {
    const response = await axiosInstance.get('/api/users/orders');
    return response.data;
};

export const getUserProfile = async () => {
    try {
        const response = await axiosInstance.get('/api/user/profile');
        return response.data;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
};

export const updateUserProfile = async (userData) => {
    try {
        const response = await axiosInstance.put('/api/user/profile', userData);
        return response.data;
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
};
