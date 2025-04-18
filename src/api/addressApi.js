import axiosInstance from './axiosConfig';

// Get address information
export const getAddressInfo = async (token) => {
    console.log('Token:', token);
    try {
        const response = await axiosInstance.post('/api/customerinfos/adressInfo', {
            token
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching address info:', error);
        throw error;
    }
};

// Update address
export const updateAddress = async (token,address) => {
    try {
        const response = await axiosInstance.post('/api/customerinfos/adressInfo/update/address', {
            token,
            address
        });
        return response.data;
    } catch (error) {
        console.error('Error updating address:', error);
        throw error;
    }
};

// Update delivery address
export const updateDeliveryAddress = async (token, delivery_address) => {
    try {
        const response = await axiosInstance.post('/api/customerinfos/adressInfo/update/delivery', {
            token,
            delivery_address
        });
        return response.data;
    } catch (error) {
        console.error('Error updating delivery address:', error);
        throw error;
    }
}; 