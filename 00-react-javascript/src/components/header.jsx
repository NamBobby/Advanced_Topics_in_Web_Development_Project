import React, { useContext, useState } from "react";
import {
  UserOutlined,
  HomeOutlined,
  SettingOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import "../assets/styles/header.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./auth.context";

const Header = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);
  console.log(">>> Check auth", auth);
  const [searchQuery, setSearchQuery] = useState("");
  const [current, setCurrent] = useState("home");

  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
    navigate(`/search?query=${searchQuery}`);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleLogout = () => {
    localStorage.clear("access_token");
    setAuth({
      isAuthenticated: false,
      user: {
        email: "",
        name: "",
      },
    });
    navigate("/");
  };

  return (
    <div className="header-container">
      <div className="logo">
        <Link to="/">
          <HomeOutlined style={{ fontSize: "24px", color: "#fff" }} />
        </Link>
      </div>

      <div className="search-box">
        <input
          type="text"
          className="search-input"
          placeholder="What do you want to play?"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <SearchOutlined className="search-icon" onClick={handleSearch} />
      </div>

      <div className="auth-buttons">
        {auth.isAuthenticated ? (
          <>
            <span className="welcome-message">
              Welcome, {auth?.user?.name ?? ""}
            </span>
            <button className="logout-btn" onClick={handleLogout}>
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="login-btn">
              Login
            </Link>
            <Link to="/register" className="signup-btn">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
