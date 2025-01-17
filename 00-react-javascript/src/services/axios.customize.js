import axios from "axios";
import React from "react";
import ReactDOM from "react-dom/client";
import LoadingSpinner from "../components/loadingSpinner";


let requestCount = 0; // Tracks the number of ongoing requests
let root = null;

// Show loading spinner
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

// Hide loading spinner
const hideLoading = () => {
  requestCount--;
  if (requestCount <= 0) {
    requestCount = 0; // Reset request count
    const loaderDiv = document.getElementById("global-loading");
    if (loaderDiv && root) {
      root.unmount();
      loaderDiv.parentNode.removeChild(loaderDiv);
      root = null; // Reset root
    }
  }
};

// Create an Axios instance
const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // Backend URL from environment variables
});

// Add request interceptor to show loading spinner
instance.interceptors.request.use(
  (config) => {
    showLoading(); // Show loading spinner
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    hideLoading(); // Hide spinner if request fails
    return Promise.reject(error);
  }
);

// Add response interceptor to hide loading spinner
instance.interceptors.response.use(
  (response) => {
    hideLoading(); // Hide spinner on successful response
    return response?.data || response;
  },
  (error) => {
    hideLoading(); // Hide spinner if response fails
    console.error("Axios Error:", error.response || error.message);
    return Promise.reject({
      data: error.response?.data || null,
      status: error.response?.status || null,
      statusText: error.response?.statusText || "An unexpected error occurred",
    });
  }
);

export default instance;
