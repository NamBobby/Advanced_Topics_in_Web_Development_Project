import React from "react";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  notification,
  Radio,
  Row,
  Select,
} from "antd";
import { createUserApi } from "../../services/apiService";
import { Link, useNavigate } from "react-router-dom";
import {
  LeftOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import "../../assets/styles/register.css";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const days = Array.from({ length: 31 }, (_, i) => i + 1);

const RegisterPage = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const { name, email, password, confirmPassword, day, month, year, gender } =
      values;

    if (password !== confirmPassword) {
      notification.error({
        message: "Error",
        description: "Passwords do not match!",
      });
      return;
    }

    const formattedDateOfBirth = `${year}-${String(month).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;
    // console.log("Formatted Date of Birth:", formattedDateOfBirth);
    // console.log("Form Data:", { name, email, password, formattedDateOfBirth, gender });

    try {
      const res = await createUserApi(
        name,
        email,
        password,
        formattedDateOfBirth,
        gender
      );

      notification.success({
        message: "Success",
        description: res.message || "Account created successfully!",
      });
      navigate("/login");
    } catch (error) {
      //console.error("Full Error:", error);

      const errorMessage =
        error.data?.message ||
        error.statusText ||
        "Failed to register user. Please try again.";

      notification.error({
        message: "Error",
        description: errorMessage,
      });
    }
  };

  return (
    <div className="register-container">
      <div className="register-navigation">
        <div className="register-logo">
          <Link to="/">
            <LeftOutlined className="back-icon" />
          </Link>
        </div>
      </div>
      <div className="register-box">
        <div className="register-form">
          <h1 className="register-title">Register Account</h1>
          <Form
            name="registerForm"
            className="register-custom-form"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                },
                {
                  type: "email",
                  message: "The input is not a valid email!",
                },
                {
                  pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Email must follow the format: example@domain.com",
                },
              ]}
            >
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
              ]}
            >
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

            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match!"));
                  },
                }),
              ]}
            >
              <Input.Password
                placeholder="Confirm Password"
                iconRender={(visible) =>
                  visible ? (
                    <EyeTwoTone twoToneColor="#ffffff" />
                  ) : (
                    <EyeInvisibleOutlined />
                  )
                }
              />
            </Form.Item>

            <Form.Item
              label="Username"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                },
              ]}
            >
              <Input placeholder="Username" />
            </Form.Item>

            <Form.Item label="Date of Birth" required>
              <Row gutter={8}>
                <Col span={8}>
                  <Form.Item
                    name="day"
                    noStyle
                    rules={[{ required: true, message: "Select day!" }]}
                  >
                    <Select placeholder="Day">
                      {days.map((day) => (
                        <Select.Option key={day} value={day}>
                          {day}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="month"
                    noStyle
                    rules={[{ required: true, message: "Select month!" }]}
                  >
                    <Select placeholder="Month">
                      {months.map((month, index) => (
                        <Select.Option key={index + 1} value={index + 1}>
                          {month}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="year"
                    noStyle
                    rules={[
                      {
                        required: true,
                        message: "Please enter a valid year!",
                      },
                      {
                        pattern: /^(19\d{2}|20(0\d|1\d|2[0-4]))$/,
                        message: "Year must be between 1900 and 2024!",
                      },
                    ]}
                  >
                    <Input type="number" placeholder="Year" />
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>

            <Form.Item
              label="Gender"
              name="gender"
              rules={[
                {
                  required: true,
                  message: "Please select your gender!",
                },
              ]}
            >
              <Radio.Group>
                <Radio value="Man">Man</Radio>
                <Radio value="Woman">Woman</Radio>
                <Radio value="Something else">Something else</Radio>
                <Radio value="Prefer not to say">Prefer not to say</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="register-button"
              >
                Sign Up
              </Button>
            </Form.Item>
          </Form>
          <div className="register-links">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="login-link">
                Login here
              </Link>
            </p>
          </div>
          <Divider />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
