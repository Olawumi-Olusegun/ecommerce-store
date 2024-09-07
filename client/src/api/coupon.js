import axiosInstance from "./axiosInstance";

export const getMyCoupons = async () => {
    try {
        const { data } = await axiosInstance.get(`/v1/coupons`);
        return data;
    } catch (error) {
        throw error;
    }
}