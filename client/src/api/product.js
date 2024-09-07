import axiosInstance from "./axiosInstance";

export const createProduct = async (formData) => {
    try {
        const { data } = await axiosInstance.post(`/v1/products`, formData);
        return data;
    } catch (error) {
        throw error;
    }
}

export const fetchAllProducts = async () => {
    try {
        const { data } = await axiosInstance.get(`/v1/products`);
        return data;
    } catch (error) {
        throw error;
    }
}

export const fetchProductsByCategory = async (category) => {
    try {
        const { data } = await axiosInstance.get(`/v1/products/category/${category}`);
        return data;
    } catch (error) {
        throw error;
    }
}

export const toggleFeaturedProduct = async (productId) => {
    try {
        const { data } = await axiosInstance.patch(`/v1/products/${productId}`);
        return data;
    } catch (error) {
        throw error;
    }
}

export const deleteProduct = async (productId) => {
    try {
        const { data } = await axiosInstance.delete(`/v1/products/${productId}`);
        return data;
    } catch (error) {
        throw error;
    }
}

export const fetchRecommendedProducts = async () => {
    try {
        const { data } = await axiosInstance.get(`/v1/products/recommended-products`,);
        return data;
    } catch (error) {
        throw error;
    }
}



export const fetchFeaturedProducts = async () => {
    try {
        const { data } = await axiosInstance.get(`/v1/products/featured-products`,);
        return data;
    } catch (error) {
        throw error;
    }
}


