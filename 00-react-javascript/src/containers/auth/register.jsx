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
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
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
    const { name, email, password } = values;

    try {
      const res = await createUserApi(name, email, password);

      if (res) {
        notification.success({
          message: "CREATE USER",
          description: "Success",
        });
        navigate("/login");
      } else {
        notification.error({
          message: "CREATE USER",
          description: "Error",
        });
      }
    } catch (error) {
      notification.error({
        message: "CREATE USER",
        description: "Unexpected error occurred!",
      });
      console.error(error);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <div className="register-form">
          <Link to="/" className="back-home-link">
            <h1 className="register-title">Register Account</h1>
          </Link>

          <Form
            name="registerForm"
            className="custom-form"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical">
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
            <Form.Item
              label="Username"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                },
              ]}>
              <Input placeholder="Username" />
            </Form.Item>
            <Form.Item
              label="Date of Birth"
              name="dateOfBirth"
              rules={[
                {
                  required: true,
                  message: "Please select your date of birth!",
                },
              ]}>
              <Row gutter={8}>
                <Col span={8}>
                  <Select placeholder="Day">
                    {days.map((day, index) => (
                      <Select.Option key={index} value={day}>
                        {day}
                      </Select.Option>
                    ))}
                  </Select>
                </Col>
                <Col span={8}>
                  <Select placeholder="Month">
                    {months.map((month, index) => (
                      <Select.Option key={index} value={month}>
                        {month}
                      </Select.Option>
                    ))}
                  </Select>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="year"
                    noStyle
                    rules={[
                      {
                        validator: (_, value) => {
                          if (value < 1900 || value > 2024) {
                            return Promise.reject(
                              "Year must be between 1900 and 2024"
                            );
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}>
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
              ]}>
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
                className="register-button">
                Sign Up
              </Button>
            </Form.Item>
          </Form>
          <Divider />
          <div className="register-links">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="login-link">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
