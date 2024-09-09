import axiosInstance from "./axiosInstance";

export const signup = async (formData) => {
    try {
        const { data } = await axiosInstance.post(`/v1/auth/signup`, formData);
        return data;
    } catch (error) {
        throw error;
    }
}

export const signin = async (formData) => {
    try {
        const { data } = await axiosInstance.post(`/v1/auth/signin`, formData);
        return data;
    } catch (error) {
        throw error;
    }

}

export const signout = async () => {
    try {
        const { data } = await axiosInstance.post(`/v1/auth/signout`);
        return data;
    } catch (error) {
        throw error;
    }
}

export const userProfile = async () => {
    try {
        const { data } = await axiosInstance.get(`/v1/auth/profile`);
        return data;
    } catch (error) {
        throw error;
    }
}
