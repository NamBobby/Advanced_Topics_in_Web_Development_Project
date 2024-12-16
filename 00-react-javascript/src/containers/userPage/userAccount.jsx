import React, { useEffect, useState } from "react";
import {
  getUserApi,
  updateUserApi,
  updatePasswordApi
} from "../../services/apiService";  // Import các API từ apiService

const ProfilePage = () => {
  const [userData, setUserData] = useState({});
  const [avatar, setAvatar] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Fetch user data
  useEffect(() => {
    getUserApi()
      .then((response) => setUserData(response.data)) // Sử dụng hàm API đã được export
      .catch((error) => console.error("Error fetching user data:", error));
  }, []);

  // Upload avatar
  const handleAvatarChange = (e) => setAvatar(e.target.files[0]);

  // Update user data
  const handleProfileUpdate = () => {
    const updatedData = {
      dateOfBirth: userData.dateOfBirth,
      gender: userData.gender,
    };
    
    updateUserApi(userData.id, updatedData)  // Sử dụng API update user
      .then(() => alert("Profile updated successfully!"))
      .catch((error) => console.error("Update failed:", error));
  };

  // Update password
  const handlePasswordUpdate = () => {
    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }

    const passwordData = {
      currentPassword,
      newPassword,
    };

    updatePasswordApi(userData.id, passwordData)  // Sử dụng API update password
      .then(() => alert("Password updated successfully!"))
      .catch((error) => console.error("Password update failed:", error));
  };

  return (
    <div>
      <h1>Chỉnh sửa hồ sơ</h1>
      <div>
        <label>Tên người dùng:</label>
        <input value={userData.name} readOnly />
      </div>
      <div>
        <label>Email:</label>
        <input value={userData.email} readOnly />
      </div>
      <div>
        <label>Ngày sinh:</label>
        <input
          type="date"
          value={userData.dateOfBirth}
          onChange={(e) =>
            setUserData({ ...userData, dateOfBirth: e.target.value })
          }
        />
      </div>
      <div>
        <label>Giới tính:</label>
        <select
          value={userData.gender}
          onChange={(e) =>
            setUserData({ ...userData, gender: e.target.value })
          }
        >
          <option value="Man">Nam</option>
          <option value="Woman">Nữ</option>
          <option value="Other">Khác</option>
        </select>
      </div>
      <div>
        <label>Change Avatar:</label>
        <input type="file" onChange={handleAvatarChange} />
        <button >Upload Avatar</button>
      </div>
      <div>
        <label>Current Password:</label>
        <input
          type="password"
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
      </div>
      <div>
        <label>New Password:</label>
        <input
          type="password"
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <div>
        <label>Confirm Password:</label>
        <input
          type="password"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <button onClick={handleProfileUpdate}>Lưu hồ sơ</button>
      <button onClick={handlePasswordUpdate}>Đổi mật khẩu</button>
    </div>
  );
};

export default ProfilePage;
