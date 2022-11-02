import axios from 'axios'

const axiosInstance = axios.create()

axiosInstance.interceptors.request.use((config) => {
    console.log(123444433)
    return config;
  }, (error) => {
    return Promise.reject(error);
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) =>
        Promise.reject(
            (error.response && error.response.data) || 'Something went wrong!'
        )
)

export default axiosInstance
