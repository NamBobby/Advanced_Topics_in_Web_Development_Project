import React from "react";
import { Spin } from "antd";
import "../assets/styles/loadingSpinner.css";

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="loading-spinner">
      <Spin size="large" />
      <p className="loading-message">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
