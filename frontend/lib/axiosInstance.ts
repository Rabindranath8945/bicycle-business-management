import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // ends with /api
  withCredentials: false,
});

export default axiosInstance;
