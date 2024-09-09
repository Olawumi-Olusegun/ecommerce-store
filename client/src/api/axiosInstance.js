import axios from "axios";

const baseURL = import.meta.mode === "development" ? "http://localhost:5000/api" : "/api";

    const axiosInstance = axios.create({ baseURL, withCredentials: true });

    const callRefreshTokenApi = async () => await axios.post(`${baseURL}/v1/auth/refresh-token`, { withCredentials: true });

   axiosInstance.interceptors.request.use(async (request) => {

    const storedData = JSON.parse(localStorage.getItem("auth-user")) ?? null;

    const userData = storedData?.state;

    if(userData?.user && (userData?.user?.exp * 1000) < Date.now()) {

      try {

        const refreshedRequest = await callRefreshTokenApi();

        const newUserData = {
          ...storedData,
          state: {
            ...storedData.state,
            user: refreshedRequest?.data?.user,
          }
        }

        localStorage.setItem('auth-user', JSON.stringify(newUserData));

        return request;
        
      } catch (error) {
        console.log(error)
      }
    }

    return request;

   }, async (error) => {
    if(error?.response?.status === 401) {
      try {
        const storedData = JSON.parse(localStorage.getItem("auth-user")) ?? null;
        const requestResponse = await callRefreshTokenApi();

        const newUserData = {
          ...storedData,
          state: {
            ...storedData.state,
            user: requestResponse?.data?.user,
          }
        }

        localStorage.setItem('auth-user', JSON.stringify(newUserData));
      } catch (refreshTokenError) {
        localStorage.removeItem("auth-user")
        window.location.replace('/signin');
      }

      return axios(error?.config);

    }

    return Promise.reject(error);
   })
   
   
    axiosInstance.interceptors.response.use(async(response) => {

        return response;

      }, async (error) => {
      
          if(error?.response?.status === 401) {

            try {
      
              const responseResult = await callRefreshTokenApi();

              const storedData = JSON.parse(localStorage.getItem("auth-user")) ?? null;

              const newUserData = {
                ...storedData,
                state: {
                  ...storedData.state,
                  user: responseResult?.data?.user,
                }
              }

              localStorage.setItem('auth-user', JSON.stringify(newUserData));

            } catch (refreshTokenError) {
                localStorage.removeItem("auth-user")
                window.location.replace('/signin');
            }
       
            return axios(error?.config);
      
          }

          return Promise.reject(error);
      
      });

    export default axiosInstance;