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
import {
  LeftOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../services/axios.customize";
import "../../assets/styles/userAccount.css";
import EmptyImage from "../../assets/images/blackimage.png";

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
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const navigate = useNavigate();

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await getAccountApi();
        //console.log("User data from API:", res);
        if (res && Array.isArray(res) && res.length > 0) {
          const user = res[0]; 
          setUserData(user);

          // split day-month-year dateOfBirth
          if (user.dateOfBirth) {
            const [year, month, day] = user.dateOfBirth.split("-");
            form.setFieldsValue({
              ...user,
              year: parseInt(year),
              month: parseInt(month),
              day: parseInt(day),
              gender: user.gender,
            });
          } else {
            form.setFieldsValue(user);
          }

          if (user.avatarPath) {
            setAvatarPreview(
              `${axios.defaults.baseURL}/uploads/${user.avatarPath.replace(
                /^src[\\/]/,
                ""
              )}`
            );
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
    const file = info.file;

    if (file) {
      if (file.type.startsWith("image/")) {
        console.log("Avatar Info:", file); // Debug log

        setAvatarFile(file);

        // Generate preview
        const reader = new FileReader();
        reader.onload = (e) => {
          console.log("Preview URL:", e.target.result); 
          setAvatarPreview(e.target.result); // Update state with preview URL
        };
        reader.readAsDataURL(file); // Convert file to base64 URL
      } else {
        notification.error({
          message: "Invalid File",
          description: "Please select a valid image file.",
        });
      }
    } else {
      console.error("No valid file selected:", file);
    }
  };

  // Update profile
  const handleProfileUpdate = async () => {
    try {
      const values = form.getFieldsValue();
      const formData = new FormData();

      if (avatarFile) {
        formData.append("avatar", avatarFile); // Append new avatar file
      }

      const formattedDate = `${values.year}-${values.month
        .toString()
        .padStart(2, "0")}-${values.day.toString().padStart(2, "0")}`;
      formData.append("dateOfBirth", formattedDate);
      formData.append("gender", values.gender);

      // Update user profile
      await updateUserApi(userData.id, formData);
      notification.success({
        message: "Success",
        description: "Profile updated successfully!",
      });
      
      // Fetch updated user data
      const updatedUser = await getAccountApi();
      if (updatedUser && Array.isArray(updatedUser) && updatedUser.length > 0) {
        const newUser = updatedUser[0];
        setUserData(newUser);

        // Update avatarPreview with the new avatar path
        if (newUser.avatarPath) {
          setAvatarPreview(
            `${axios.defaults.baseURL}/uploads/${newUser.avatarPath.replace(
              /^src[\\/]/,
              ""
            )}`
          );
        }
      }

      window.dispatchEvent(new CustomEvent("authUpdate"));
      navigate("/");
      window.location.reload();
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
      <div className="user-account-navigation">
        <div className="user-account-logo">
          <Link to="/">
            <LeftOutlined className="back-icon" />
          </Link>
        </div>
      </div>
      <div className="user-account-box">
        <div className="user-account-form">
          <h1 className="user-account-title">User Profile</h1>
          <div className="avatar-wrapper">
            <div className="avatar-frame">
              <img
                src={
                  avatarPreview ||
                  (userData.avatarPath
                    ? `${
                        axios.defaults.baseURL
                      }/uploads/${userData.avatarPath.replace(/^src[\\/]/, "")}`
                    : EmptyImage)
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
            <Form.Item label="Username" name="name" id="username">
              <Input
                placeholder="Username"
                readOnly
                className="readonly-input"
                autoComplete="username"
              />
            </Form.Item>
            <Form.Item label="Email" name="email" id="email">
              <Input
                placeholder="Email"
                readOnly
                className="readonly-input"
                autoComplete="email"
              />
            </Form.Item>
            <Form.Item label="Role" name="role" id="role">
              <Input
                placeholder="Role"
                readOnly
                className="readonly-input"
                autoComplete="off"
              />
            </Form.Item>
            <Form.Item label="Date of Birth" required>
              <Row gutter={8}>
                <Col span={8}>
                  <Form.Item name="day" id="dob-day" noStyle>
                    <Select placeholder="Day" autoComplete="bday-day">
                      {days.map((day) => (
                        <Select.Option key={day} value={day}>
                          {day}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="month" id="dob-month" noStyle>
                    <Select placeholder="Month" autoComplete="bday-month">
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
                    id="dob-year"
                    noStyle
                    rules={[
                      { required: true, message: "Please enter a valid year!" },
                      {
                        pattern: /^(19\\d{2}|20(0\\d|1\\d|2[0-4]))$/,
                        message: "Year must be between 1900 and 2024!",
                      },
                    ]}>
                    <Input
                      type="number"
                      placeholder="Year"
                      autoComplete="bday-year"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>

            <Form.Item label="Gender" name="gender" required>
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

          <div className="change-password-section">
            <h1
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="user-account-toggle-password-form"
            >
              Change your Password
            </h1>
            {showPasswordForm && (
              <Form
                form={passwordForm}
                layout="vertical"
                className="useraccount-form">
                <Form.Item
                  name="username"
                  initialValue={userData.name}
                  style={{ display: "none" }}>
                  <Input type="text" autoComplete="username" />
                </Form.Item>
                <Form.Item
                  label="Current Password"
                  name="currentPassword"
                  rules={[
                    { required: true, message: "Enter your current password!" },
                  ]}>
                  <Input.Password
                    className="currentpassword-input"
                    placeholder="Current Password"
                    autoComplete="current-password"
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
                  rules={[
                    { required: true, message: "Enter a new password!" },
                  ]}>
                  <Input.Password
                    className="newpassword-input"
                    placeholder="New Password"
                    autoComplete="new-password"
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
                    autoComplete="new-password" 
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAccount;
