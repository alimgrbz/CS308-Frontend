import axiosInstance from './axiosConfig';

// Get address information
export const getAddressInfo = async () => {
    try {
        const response = await axiosInstance.get('/api/customerinfos/adressInfo');
        return response.data;
    } catch (error) {
        console.error('Error fetching address info:', error);
        throw error;
    }
};

// Update address
export const updateAddress = async (address) => {
    try {
        const response = await axiosInstance.put('/api/customerinfos/adressInfo/update/address', {
            address
        });
        return response.data;
    } catch (error) {
        console.error('Error updating address:', error);
        throw error;
    }
};

// Update delivery address
export const updateDeliveryAddress = async (delivery_address) => {
    try {
        const response = await axiosInstance.put('/api/customerinfos/adressInfo/update/delivery', {
            delivery_address
        });
        return response.data;
    } catch (error) {
        console.error('Error updating delivery address:', error);
        throw error;
    }
}; 