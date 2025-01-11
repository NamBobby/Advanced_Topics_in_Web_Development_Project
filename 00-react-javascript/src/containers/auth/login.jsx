import React, { useContext } from "react";
import { Button, Form, Input, notification } from "antd";
import {
  LeftOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { LoginApi } from "../../services/apiService";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../components/auth.context";
import "../../assets/styles/login.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);

  const onFinish = async (values) => {
    try {
      const response = await LoginApi(values.email, values.password);

      if (response.EC === 0) {
        const { access_token, user } = response;
        
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("role", user.role); 
        localStorage.setItem("user", JSON.stringify(user));

        setAuth({
          isAuthenticated: true,
          user: {
            email: user.email,
            name: user.name,
            role: user.role,
          },
        });

        // Notify sidebar to refresh followed items
        window.dispatchEvent(new Event("authUpdate"));
        
        notification.success({
          message: "Login Successful",
          description: `Welcome back, ${user.name}!`,
        });

        navigate("/");
        window.location.reload();
      } else {
        notification.error({
          message: "Login Failed",
          description: response.EM || "Invalid credentials",
        });
      }
    } catch (error) {
      console.error("Login Error:", error);
      notification.error({
        message: "Login Failed",
        description: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="login-container">
      <div className="login-navigation">
        <div className="login-logo">
          <Link to="/">
            <LeftOutlined className="back-icon" />
          </Link>
        </div>
      </div>
      <div className="login-box">
        <div className="login-form">
          <h1 className="login-title">Log In</h1>
          <Form
            name="loginForm"
            className="custom-form"
            onFinish={onFinish}
            layout="vertical"
            autoComplete="off">
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}>
              <Input placeholder="Email" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}>
              <Input.Password
                placeholder="Password"
                iconRender={(visible) =>
                  visible ? (
                    <EyeTwoTone twoToneColor="#ffffff" />
                  ) : (
                    <EyeInvisibleOutlined />
                  )
                }
              />
            </Form.Item>

            <Form.Item>
              <Button htmlType="submit" className="login-button">
                Log In
              </Button>
            </Form.Item>
          </Form>
          <div className="login-links">
            <Link to="/forgot-password" className="forgot-password-link">
              Forgot your password?
            </Link>
            <p>
              Don’t have an account?{" "}
              <Link to="/register" className="signup-link">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
