import React, { useContext, useState } from "react";
import {
  UserOutlined,
  HomeOutlined,
  SettingOutlined,
  SearchOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, Menu } from "antd";
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
    localStorage.clear(); // Xóa toàn bộ dữ liệu trong localStorage
    setAuth({
      isAuthenticated: false,
      user: {
        email: "",
        name: "",
      },
    });
    navigate("/");
  };

  const onClick = (e) => {
    console.log("click", e);
    setCurrent(e.key);
  };

  // Menu items cho dropdown
  const items = auth.isAuthenticated
    ? [
        {
          key: "username",
          label: (
            <div
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/profile")}
            >
              {auth?.user?.name ?? ""}{" "}
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
      ]
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
          <Button icon={<UserOutlined />}>
          </Button>
        </Dropdown>
      </div>
    </div>
  );
};

export default Header;
