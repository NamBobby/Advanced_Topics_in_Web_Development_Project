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

  const onClick = (e) => {
    console.log("click", e);
    setCurrent(e.key);
  };

  const menu = (
    <Menu>
      {auth.isAuthenticated ? (
        <>
          <Menu.Item key="username">
            {auth?.user?.name ?? ""} 
            <ExportOutlined className="export-icon"/>
          </Menu.Item>
          <Menu.Item key="logout">
            <button className="logout-btn" onClick={handleLogout}>
              Log out
            </button>
          </Menu.Item>
        </>
      ) : (
        <>
          <Menu.Item key="login">
            <Link to="/login" className="login-btn">
              Login
            </Link>
          </Menu.Item>
          <Menu.Item key="register">
            <Link to="/register" className="signup-btn">
              Sign Up
            </Link>
          </Menu.Item>
        </>
      )}
    </Menu>
  );

  return (
    <div className="header-container">
      <div className="logo">
      </div>

      <div className="search-box">
        <div className="logo">
          <Link to="/">
            <HomeOutlined className="home-icon"/>
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
        <Dropdown overlay={menu} trigger={['click']}>
          <Button icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </div>
  );
};

export default Header;
