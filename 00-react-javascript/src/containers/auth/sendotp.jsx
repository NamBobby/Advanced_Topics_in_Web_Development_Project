import React, { useState } from "react";
import { Form, Input, Button, notification } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { sendOtpApi } from "../../services/apiService";
import "../../assets/styles/forgotpassword.css";

const SendOtpPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await sendOtpApi({ email: values.email });
      notification.success({
        message: "Success",
        description: response?.message || "OTP has been sent to your email!",
      });
      navigate("/resetpassword", { state: { email: values.email } });
    } catch (error) {
      console.error("Error sending OTP:", error);
      notification.error({
        message: "Error",
        description: error.response?.data?.EM || "Failed to send OTP. Try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgotpassword-container">
      <div className="forgotpassword-navigation">
        <div className="forgotpassword-logo">
          <Link to="/login">
            <LeftOutlined className="back-icon" />
          </Link>
        </div>
      </div>
      <div className="forgotpassword-box">
        <div className="forgotpassword-form">
          <h1 className="forgotpassword-title">Forgot your password?</h1>
          <Form 
            name="sendOtpForm"
            className="forgotpassword-custom-form" 
            onFinish={onFinish} 
            layout="vertical">
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Invalid email format!" },
              ]}
            >
              <Input placeholder="Enter your email" />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="forgotpassword-button"
              >
                Send OTP
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SendOtpPage;
