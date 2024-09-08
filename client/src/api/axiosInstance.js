import axios from "axios";

const baseURL = import.meta.mode === "development" ? "http://localhost:5000/api" : "/api";

    const axiosInstance = axios.create({ baseURL, withCredentials: true });

    const callRefreshTokenApi = async () => await axios.post(`${baseURL}/v1/auth/refresh-token`, { withCredentials: true });

    axiosInstance.interceptors.response.use(async(response) => {

        return response;

      }, async (error) => {
      
          if(error?.response?.status === 401) {

            try {
      
              const responseResult = await callRefreshTokenApi();

              localStorage.setItem('auth-user', JSON.stringify(responseResult?.data?.user));

            } catch (refreshTokenError) {
                localStorage.removeItem("auth-user")
                window.location.replace('/signin');
            }
       
            return axios(error?.config);
      
          }

          return Promise.reject(error?.message);
      
      });

    export default axiosInstance;