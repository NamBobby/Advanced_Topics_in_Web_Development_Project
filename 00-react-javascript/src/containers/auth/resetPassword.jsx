import React, { useEffect, useState } from "react";
import { Button, Divider, Form, Input, notification } from "antd";
import { LeftOutlined, EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { verifyOtpApi } from "../../services/apiService";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../../assets/styles/resetpassword.css";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation(); 
  const email = state?.email; 
  const [countdown, setCountdown] = useState(600); 

  
  useEffect(() => {
    if (!email) {
      notification.error({
        message: "Error",
        description: "Invalid access. Redirecting to Forgot Password page.",
      });
      navigate("/forgot-password"); 
    }
  }, [email, navigate]);

  // countdown time
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          notification.warning({
            message: "Session Expired",
            description: "Your session has expired. Please request a new OTP.",
          });
          navigate("/login"); 
          return 0;
        }
        return prev - 1;
      });
    }, 1000); 
    return () => clearInterval(timer); 
  }, [navigate]);

  const onFinish = async (values) => {
    const { otp, newPassword, confirmPassword } = values;

    if (newPassword !== confirmPassword) {
      notification.error({
        message: "Error",
        description: "Passwords do not match!",
      });
      return;
    }

    try {
      const response = await verifyOtpApi({ email, otp, newPassword });
      notification.success({
        message: "Success",
        description: response?.message || "Password reset successfully!",
      });
      navigate("/login"); 
    } catch (error) {
      notification.error({
        message: "Error",
        description:
          error.response?.data?.EM || "Failed to verify OTP. Please try again.",
      });
    }
  };

  // display countdown time
  const formattedCountdown = `${Math.floor(countdown / 60)
    .toString()
    .padStart(2, "0")}:${(countdown % 60).toString().padStart(2, "0")}`;


  if (!email) return null;

  return (
    <div className="resetpassword-container">
      <div className="resetpassword-navigation">
        <div className="resetpassword-logo">
          <Link to="/login">
            <LeftOutlined className="back-icon" />
          </Link>
        </div>
      </div>
      <div className="resetpassword-box">
        <div className="resetpassword-form">
          <h1 className="resetpassword-title">Reset Password</h1>
          <div className="resetpassword-countdown">
            <p>
              <strong>Time Remaining:</strong>{" "}
              <span className={countdown < 60 ? "countdown-warning" : ""}>
                {formattedCountdown}
              </span>
            </p>
          </div>
          <Form
            name="verifyOtpForm"
            className="resetpassword-custom-form"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item
              label="OTP"
              name="otp"
              rules={[{ required: true, message: "Please input your OTP!" }]}
            >
              <Input placeholder="Enter the OTP" />
            </Form.Item>

            <Form.Item
              label="New Password"
              name="newPassword"
              rules={[
                { required: true, message: "Please input your new password!" },
              ]}
            >
              <Input.Password
                placeholder="Enter new password"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone twoToneColor="#ffffff" /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={["newPassword"]}
              rules={[
                { required: true, message: "Please confirm your password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match!"));
                  },
                }),
              ]}
            >
              <Input.Password
                placeholder="Confirm password"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone twoToneColor="#ffffff" /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" className="resetpassword-button">
                Submit
              </Button>
            </Form.Item>
          </Form>
          <Divider />
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
