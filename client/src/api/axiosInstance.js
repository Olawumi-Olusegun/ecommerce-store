import axios from "axios";

    const axiosInstance = axios.create({ 
            baseURL: import.meta.mode === "development" ? "http://localhost:5000/api" : "/api", 
            withCredentials: true
    });

//     let refreshPromise = null;

//     axiosInstance.interceptors.response.use((response) => {
//         return response;
//     }, async(error) => {

//         const originalRequest = error.config;

//         if(error.response?.status === 401 && !originalRequest._retry) {
//         originalRequest._retry = true;
        
//         try {
                
//         } catch (refreshError) {
                
//         }
//         }
//     } )

    export default axiosInstance;