import React, { useContext, useState } from "react";
import { UserOutlined, HomeOutlined, SearchOutlined, ExportOutlined } from "@ant-design/icons";
import { Button, Dropdown, notification } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./auth.context";
import "../assets/styles/header.css";

const AdminHeader = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);
  console.log(">>> Check auth", auth);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    navigate(`/search?query=${searchQuery}`);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");

    setAuth({ isAuthenticated: false, user: { email: "", name: "" } });
    notification.success({ message: "Logout Successful" });
    navigate("/");
  };

  // Menu items cho dropdown
  const items = auth.isAuthenticated
    ? [
        {
          key: "profile",
          label: (
            <div
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/profile", { state: { user: auth.user } })}
            >
              {auth.user.name}
              <ExportOutlined className="export-icon" />
            </div>
          ),
        },
        {
          key: "logout",
          label: (
            <button className="logout-btn" onClick={handleLogout}>
              Log out
            </button>
          ),
        },
      ].filter(Boolean) // Lọc bỏ các giá trị null nếu role không khớp
    : [
        {
          key: "login",
          label: (
            <Link to="/login" className="login-btn">
              Login
            </Link>
          ),
        },
        {
          key: "register",
          label: (
            <Link to="/register" className="signup-btn">
              Sign Up
            </Link>
          ),
        },
      ];

  return (
    <div className="header-container">
      <div className="logo"></div>
      <div className="search-box">
        <div className="logo">
          <Link to="/">
            <HomeOutlined className="home-icon" />
          </Link>
        </div>
        <input
          type="text"
          className="search-input"
          placeholder="What do you want to play?"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="logo">
          <SearchOutlined className="search-icon" onClick={handleSearch} />
        </div>
      </div>

      <div className="auth-buttons">
        <Dropdown menu={{ items }} trigger={["click"]}>
          <Button icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </div>
  );
};

export default AdminHeader;
