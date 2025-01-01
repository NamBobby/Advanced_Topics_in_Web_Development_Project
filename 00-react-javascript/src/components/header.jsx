import React, { useContext, useState, useEffect } from "react";
import {
  UserOutlined,
  HomeOutlined,
  SearchOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, notification } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./auth.context";
import { searchAllApi, getAccountApi } from "../services/apiService";
import "../assets/styles/header.css";
import MusicLogo from "../assets/images/Musiclogo-backgroundcut.png";
import axios from "../services/axios.customize";

const Header = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);
  //console.log(">>> Check auth", auth);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async () => {
    try {
      const results = await searchAllApi(searchQuery);
      navigate("/", { state: results });
    } catch (error) {
      console.error("Error during search:", error);
    }
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
    window.location.reload();
  };

  useEffect(() => {
    const handleAuthUpdate = async () => {
      try {
        const response = await getAccountApi();
        if (response && Array.isArray(response) && response.length > 0) {
          const updatedUser = response[0];
          setAuth({
            isAuthenticated: true,
            user: {
              ...updatedUser,
              avatarPath: updatedUser.avatarPath || null,
            },
          });
        } else {
          setAuth({ isAuthenticated: false, user: { email: "", name: "" } });
        }
      } catch (error) {
        console.error("Error fetching updated user data:", error);
      }
    };

    window.addEventListener("authUpdate", handleAuthUpdate);

    return () => {
      window.removeEventListener("authUpdate", handleAuthUpdate);
    };
  }, [setAuth]);

  // Menu items cho dropdown
  const items = auth.isAuthenticated
    ? [
        {
          key: "profile",
          label: (
            <div
              style={{ cursor: "pointer" }}
              onClick={() =>
                navigate("/profile", { state: { user: auth.user } })
              }>
              {auth.user.name}
              <ExportOutlined className="export-icon" />
            </div>
          ),
        },
        {
          key: "userInfo",
          label: (
            <div
              style={{ cursor: "pointer" }}
              onClick={() =>
                navigate("/userInfo", { state: { user: auth.user } })
              }>
              {"Info"}
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
      ].filter(Boolean)
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
      <div className="header-logo">
        <img src={MusicLogo} alt="Music Logo" className="logo-image" />
      </div>
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
          <Button
            icon={
              auth?.user?.avatarPath ? (
                <img
                  src={`${
                    axios.defaults.baseURL
                  }/uploads/${auth.user.avatarPath.replace(/^src[\\/]/, "")}`}
                  alt={auth?.user?.name || "User Avatar"}
                  className="avatar-image"
                />
              ) : (
                <UserOutlined />
              )
            }
          />
        </Dropdown>
      </div>
    </div>
  );
};

export default Header;
