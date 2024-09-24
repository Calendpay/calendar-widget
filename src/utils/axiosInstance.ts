import axios from "axios";

export const backendUrl = "https://backend.calendpay.com";
// export const backendUrl = "http://localhost:8000";

const axiosInstance = axios.create({
  baseURL: backendUrl,
});

export default axiosInstance;
