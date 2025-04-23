import axiosInstance from './axiosConfig';

// Get address info
export const getAddressInfo = async (token) => {
    try {
        const response = await axiosInstance.post('/api/customerinfos/adressInfo', {
            token
        });
        return response.data;
    } catch (error) {
        console.error('Error getting address:', error);
        throw error;
    }
};

// Update address
export const updateAddress = async (token, address) => {
    try {
        // Ensure proper encoding of special characters
        const encodedAddress = encodeURIComponent(address);
        const response = await axiosInstance.post('/api/customerinfos/adressInfo/update/address', {
            token,
            address: decodeURIComponent(encodedAddress) // Send decoded for proper storage
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
        // Ensure proper encoding of special characters
        const encodedAddress = encodeURIComponent(delivery_address);
        const response = await axiosInstance.post('/api/customerinfos/adressInfo/update/delivery', {
            token,
            delivery_address: decodeURIComponent(encodedAddress) // Send decoded for proper storage
        });
        return response.data;
    } catch (error) {
        console.error('Error updating delivery address:', error);
        throw error;
    }
}; 