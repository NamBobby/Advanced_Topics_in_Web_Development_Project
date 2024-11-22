import React, { useContext } from "react";
import { Button, Form, Input, notification } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { LoginApi } from "../../services/apiService";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../components/auth.context";
import "../../assets/styles/login.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);

  const onFinish = async (values) => {
    const { email, password } = values;

    try {
      const res = await LoginApi(email, password);

      if (res && res.EC === 0) {
        localStorage.setItem("access_token", res.access_token);

        notification.success({
          message: "Login Successful",
          description: "Welcome back!",
        });

        setAuth({
          isAuthenticated: true,
          user: {
            email: res?.user?.email ?? "",
            name: res?.user?.name ?? "",
          },
        });

        navigate("/");
      } else {
        notification.error({
          message: "Login Failed",
          description: res?.EM ?? "An unexpected error occurred.",
        });
      }
    } catch (error) {
      notification.error({
        message: "Login Error",
        description: "Unable to log in. Please try again later.",
      });
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-form">
        <Link to="/" className="back-home-link">
          <h1 className="login-title">Log In</h1>
        </Link>
        <Form
          name="loginForm"
          className="custom-form"
          onFinish={onFinish}
          layout="vertical"
          autoComplete="off">
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                },
              ]}>
              <Input placeholder="Email" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}>
              <Input.Password
                className="custom-password-input"
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
            <Button 
                htmlType="submit" 
                className="login-button">
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
