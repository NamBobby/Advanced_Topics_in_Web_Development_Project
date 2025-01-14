import React, { useEffect, useState, useMemo, useCallback } from "react";
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
  const [isPlusIcon, setIsPlusIcon] = useState(true);
  const navigate = useNavigate();

  // Memo currentUser avoid re-render 
  const currentUser = useMemo(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  }, []);

  // Fetch users 
  const fetchUsers = useCallback(async () => {
    if (!currentUser) return;
  
    try {
      const response = await getUserApi();
      const filteredUsers = response.filter(
        (user) => user.accountId !== currentUser.accountId
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
  }, [currentUser, visibleCount]);
  
  const handleSeeMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  const handleSeeLess = () => {
    setVisibleCount(10);
  };

  const handleDelete = async (accountId) => {
    try {
      await deleteAccountApi({ accountId });
      notification.success({
        message: "Success",
        description: "Account deleted successfully.",
      });

      // Update accounts list
      const updatedUsers = users.filter((user) => user.accountId !== accountId);
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
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Gender", dataIndex: "gender", key: "gender" },
    { title: "Role", dataIndex: "role", key: "role" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button type="danger" onClick={() => handleDelete(record.accountId)}>
          Delete
        </Button>
      ),
    },
  ];

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    const handleAuthUpdate = () => {
      fetchUsers(); 
    };
  
    window.addEventListener("authUpdate", handleAuthUpdate);
  
    return () => {
      window.removeEventListener("authUpdate", handleAuthUpdate);
    };
  }, [fetchUsers]);  

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
