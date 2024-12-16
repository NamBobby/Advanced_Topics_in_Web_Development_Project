import axios from "axios";
import React from "react";
import ReactDOM from "react-dom/client"; 
import LoadingSpinner from "../components/loadingSpinner";


let requestCount = 0;
let root = null;

const showLoading = () => {
  if (requestCount === 0) {
    const loaderDiv = document.createElement("div");
    loaderDiv.setAttribute("id", "global-loading");
    document.body.appendChild(loaderDiv);

    root = ReactDOM.createRoot(loaderDiv);
    root.render(React.createElement(LoadingSpinner, { message: "Loading..." }));
  }
  requestCount++;
};


const hideLoading = () => {
  requestCount--;
  if (requestCount === 0) {
    const loaderDiv = document.getElementById("global-loading");
    if (loaderDiv && root) {
      root.unmount(); // Unmount component
      loaderDiv.parentNode.removeChild(loaderDiv);
      root = null; // Reset root
    }
  }
};

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // Set base URL từ .env
});

instance.interceptors.request.use(
  (config) => {
    showLoading();
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    hideLoading();
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    hideLoading();
    return response?.data || response;
  },
  (error) => {
    hideLoading();
    console.error("Axios Error:", error.response || error.message);
    return Promise.reject(error.response?.data || { message: "An unexpected error occurred" });
  }
);

export default instance;
