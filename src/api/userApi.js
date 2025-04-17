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
