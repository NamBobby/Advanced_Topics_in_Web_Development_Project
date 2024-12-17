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
    try {
      const response = await LoginApi(values.email, values.password);

      if (response.EC === 0) {
        const { access_token, user } = response;

        // Lưu token và thông tin người dùng vào localStorage
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("user", JSON.stringify(user)); // Lưu user

        // Cập nhật context Auth
        setAuth({
          isAuthenticated: true,
          user: {
            email: user.email,
            name: user.name,
            role: user.role,
          },
        });

        // Điều hướng dựa trên role
        if (user.role === "Administrator") {
          console.log("Navigating to /admin");
          navigate("/admin");
        } else {
          console.log("Navigating to /");
          navigate("/");
        }

        // Thông báo thành công
        notification.success({
          message: "Login Successful",
          description: `Welcome back, ${user.name}!`,
        });
      } else {
        // Xử lý lỗi từ server
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
              rules={[{ required: true, message: "Please input your email!" }]}>
              <Input placeholder="Email" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Please input your password!" }]}>
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
