import React from "react";
import { Link } from "react-router-dom";
//import "../assets/styles/notFound.css"; 

const NotFoundPage = () => {
  return (
    <div className="notfound-container">
      <h1 className="notfound-title">404 PAGE NOT FOUND</h1>
      <p className="notfound-message">Oops! The page you`re looking for doesn`t exist.</p>
      <Link to="/" className="notfound-link">
        Go Back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
