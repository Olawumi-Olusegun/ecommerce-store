import axiosInstance from "./axiosInstance";

export const getCartItems = async () => {
    try {
        const { data } = await axiosInstance.get(`/v1/carts`,);
        return data;
    } catch (error) {
        throw error;
    }
}

export const addToCart = async (product) => {
    try {
        const { data } = await axiosInstance.post(`/v1/carts`, { productId: product?._id });
        return data;
    } catch (error) {
        throw error;
    }
}

export const removeAllFromCart = async (product) => {
    try {
        const { data } = await axiosInstance.delete(`/v1/carts/${product?._id}`,);
        return data;
    } catch (error) {
        throw error;
    }
}

export const updateCartQuantity = async ({item, quantity}) => {

    try {
        const { data } = await axiosInstance.put(`/v1/carts/${item?._id}`, { quantity });
        return data;
    } catch (error) {
        throw error;
    }
}


export const getMyCoupons = async () => {
    try {
        const { data } = await axiosInstance.get(`/v1/coupons`);
        return data;
    } catch (error) {
        throw error;
    }
}

export const applyCoupon = async (couponCode) => {
    try {
        const { data } = await axiosInstance.get(`/v1/coupons/validate-coupon-code`, { code: couponCode});
        return data;
    } catch (error) {
        throw error;
    }
}

export const fetchAnalyticsData = async () => {
    try {
        const { data } = await axiosInstance.get(`/v1/analytics`);
        return data;
    } catch (error) {
        throw error;
    }
}