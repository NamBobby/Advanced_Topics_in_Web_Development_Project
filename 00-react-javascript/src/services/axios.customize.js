import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // Đọc URL từ .env
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("Request Data:", config.data); // Dữ liệu gửi đi
    console.log("Request URL:", config.url); // Đường dẫn API
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => {
    if (response && response.data) return response.data;
    return response;
  },
  (error) => {
    console.error("Axios Error:", error.response || error.message);
    return error.response?.data || { message: "An unexpected error occurred" };
  }
);

export default instance;
