import React, { useEffect, useState, useMemo } from "react";
import AdminHeader from "../../components/adminHeader";
import { Table, Button, notification } from "antd";
import { getUserApi, deleteAccountApi } from "../../services/apiService";
import { PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { Link, useNavigate, Outlet } from "react-router-dom";
import "../../assets/styles/admin.css";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const navigate = useNavigate();
  const [isPlusIcon, setIsPlusIcon] = useState(true);

  // Memo hóa currentUser để không gây re-render liên tục
  const currentUser = useMemo(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  }, []);

  // Fetch users khi component mount hoặc visibleCount thay đổi
  useEffect(() => {
    const fetchUsers = async () => {
      if (!currentUser) return; // Nếu currentUser không tồn tại, thoát

      try {
        const response = await getUserApi();
        const filteredUsers = response.filter(
          (user) => user.id !== currentUser.id
        );
        setUsers(filteredUsers);
        setDisplayedUsers(filteredUsers.slice(0, visibleCount));
      } catch (error) {
        console.error("Error fetching users:", error);
        notification.error({
          message: "Error",
          description: "Failed to fetch user data.",
        });
      }
    };

    fetchUsers();
  }, [visibleCount, currentUser]); // currentUser được memo hóa nên không gây re-render

  const handleSeeMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  const handleSeeLess = () => {
    setVisibleCount(10);
  };

  const handleDelete = async (email) => {
    try {
      await deleteAccountApi({ email });
      notification.success({
        message: "Success",
        description: "Account deleted successfully.",
      });

      // Cập nhật lại danh sách người dùng
      const updatedUsers = users.filter((user) => user.email !== email);
      setUsers(updatedUsers);
      setDisplayedUsers(updatedUsers.slice(0, visibleCount));
    } catch (error) {
      console.error("Error deleting account:", error);
      notification.error({
        message: "Error",
        description: "Failed to delete account.",
      });
    }
  };

  const toggleIcon = () => {
    setIsPlusIcon((prev) => !prev);
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Gender", dataIndex: "gender", key: "gender" },
    { title: "Role", dataIndex: "role", key: "role" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button type="danger" onClick={() => handleDelete(record.email)}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div className="admin-container">
      <AdminHeader />
      <div className="admin-layout">
        <div className="admin-content">
          <div className="admin-navigation">
            <div className="admin-title">
              <h2>User Management</h2>
            </div>
            <div className="admin-logo">
              {isPlusIcon ? (
                <Link to="/create" onClick={toggleIcon}>
                  <PlusCircleOutlined className="admin-icon" />
                </Link>
              ) : (
                <Link to="/" onClick={toggleIcon}>
                  <MinusCircleOutlined className="admin-icon" />
                </Link>
              )}
            </div>
          </div>
          <Table
            dataSource={displayedUsers}
            columns={columns}
            rowKey="id"
            pagination={false}
          />
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            {visibleCount < users.length && (
              <Button type="primary" onClick={handleSeeMore}>
                See More
              </Button>
            )}
            {visibleCount > 10 && (
              <Button style={{ marginLeft: "10px" }} onClick={handleSeeLess}>
                See Less
              </Button>
            )}
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
