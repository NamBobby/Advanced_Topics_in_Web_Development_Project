import React, { useEffect, useState } from "react";
import {
  Button,
  Divider,
  Form,
  Input,
  Radio,
  Select,
  Row,
  Col,
  Upload,
  notification,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  getAccountApi,
  updateUserApi,
  updatePasswordApi,
} from "../../services/apiService";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../services/axios.customize";
import "../../assets/styles/userAccount.css";

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

const UserAccount = () => {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [userData, setUserData] = useState({});
  const [avatarFile, setAvatarFile] = useState(null);

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await getAccountApi();
        console.log("User data from API:", res);
        if (res && Array.isArray(res) && res.length > 0) {
          const user = res[0]; // Lấy phần tử đầu tiên trong mảng
          setUserData(user);

          // Tách ngày tháng năm từ dateOfBirth
          if (user.dateOfBirth) {
            const [year, month, day] = user.dateOfBirth.split("-");
            form.setFieldsValue({
              ...user,
              year: parseInt(year),
              month: parseInt(month),
              day: parseInt(day),
            });
          } else {
            form.setFieldsValue(user);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        notification.error({
          message: "Error",
          description: "Unable to fetch user data.",
        });
      }
    };

    fetchUserData();
  }, [form]);

  // Handle avatar upload
  const handleAvatarChange = (info) => {
    if (info.file) {
      setAvatarFile(info.file.originFileObj);
    }
  };

  // Update profile
  const handleProfileUpdate = async () => {
    try {
      const values = form.getFieldsValue();
      const formData = new FormData();

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const formattedDate = `${values.year}-${values.month
        .toString()
        .padStart(2, "0")}-${values.day.toString().padStart(2, "0")}`;
      formData.append("dateOfBirth", formattedDate);
      formData.append("gender", values.gender);

      await updateUserApi(userData.id, formData);
      notification.success({
        message: "Success",
        description: "Profile updated successfully!",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      notification.error({
        message: "Error",
        description: "Failed to update profile.",
      });
    }
  };

  // Update password
  const handlePasswordUpdate = async () => {
    try {
      const values = passwordForm.getFieldsValue();
      console.log("Password update data:", values);

      if (values.newPassword !== values.confirmPassword) {
        notification.error({
          message: "Error",
          description: "New password and confirmation do not match.",
        });
        return;
      }

      await updatePasswordApi(userData.id, {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });

      console.log("Password update data:", {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });
      

      notification.success({
        message: "Success",
        description: "Password updated successfully!",
      });
      passwordForm.resetFields();
    } catch (error) {
      console.error("Error updating password:", error);
      notification.error({
        message: "Error",
        description: "Failed to update password.",
      });
    }
  };

  return (
    <div className="user-account-container">
      <div className="user-account-box">
        <div className="user-account-form">
          <Link to="/" className="back-home-link">
            <h1 className="user-account-title">User Profile</h1>
          </Link>

          <div className="avatar-wrapper">
            <div className="avatar-frame">
              <img
                src={
                  userData.avatarPath
                    ? `${axios.defaults.baseURL}/${userData.avatarPath.replace(
                        /^src[\\/]/,
                        ""
                      )}`
                    : "https://via.placeholder.com/100"
                }
                alt="Avatar"
                className="avatar-image"
              />
              <Upload
                beforeUpload={() => false}
                onChange={handleAvatarChange}
                showUploadList={false}>
                <Button
                  icon={<UploadOutlined />}
                  className="avatar-upload-button">
                  Upload
                </Button>
              </Upload>
            </div>
          </div>
          <Form form={form} layout="vertical" className="useraccount-form">
            <Form.Item label="Username" name="name">
              <Input
                placeholder="Username"
                readOnly
                className="readonly-input"
              />
            </Form.Item>
            <Form.Item label="Email" name="email">
              <Input placeholder="Email" readOnly className="readonly-input" />
            </Form.Item>
            <Form.Item
              label="Date of Birth"
              name="dateOfBirth"
              required
              rules={[
                {
                  required: true,
                  message: "Please select your date of birth!",
                },
              ]}>
              <Row gutter={8}>
                <Col span={8}>
                  <Form.Item name="day" noStyle>
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
                  <Form.Item name="month" noStyle>
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
                  <Form.Item name="year" noStyle>
                    <Input type="number" placeholder="Year" />
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>
            <Form.Item label="Gender" name="gender">
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
                className="user-account-button"
                onClick={handleProfileUpdate}>
                Update Profile
              </Button>
            </Form.Item>
          </Form>
          <Divider />
          <Form
            form={passwordForm}
            layout="vertical"
            className="useraccount-form">
            <Form.Item
              label="Current Password"
              name="currentPassword"
              rules={[
                { required: true, message: "Enter your current password!" },
              ]}>
              <Input.Password
                className="currentpassword-input"
                placeholder="Current Password"
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
              label="New Password"
              name="newPassword"
              rules={[{ required: true, message: "Enter a new password!" }]}>
              <Input.Password
                className="newpassword-input"
                placeholder="New Password"
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
              rules={[
                { required: true, message: "Confirm your new password!" },
              ]}>
              <Input.Password
                className="confirmpassword-input"
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
            <Form.Item>
              <Button
                type="primary"
                className="user-account-button"
                onClick={handlePasswordUpdate}>
                Change Password
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default UserAccount;
