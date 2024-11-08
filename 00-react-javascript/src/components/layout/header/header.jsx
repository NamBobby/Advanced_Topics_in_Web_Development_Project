import './header.css';
import React, { useContext, useState } from 'react';
import {
  UsergroupAddOutlined,
  HomeOutlined,
  SettingOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';

const Header = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);
  console.log('>>> Chech auth', auth);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
    // có thể chuyển hướng hoặc thực hiện tìm kiếm tại đây
    navigate(`/search?query=${searchQuery}`);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch(); // Gọi hàm tìm kiếm khi nhấn Enter
    }
  };

  const handleLogout = () => {
    localStorage.clear('access_token'); // Xóa token khi logout
    setAuth({
      isAuthenticated: false,
      user: {
        email: '',
        name: '',
      },
    });
    navigate('/'); // Điều hướng về trang chủ sau khi đăng xuất
  };

  const items = [

  ];

  const [current, setCurrent] = useState('mail');
  const onClick = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };
  return (
    <div>
      <div className="header-container">
        <div className="logo">
          <Link to="/">
            <img
              src="./src/assets/img/spotify-white-icon.svg" // Thay bằng đường dẫn logo của bạn
              alt="logo"
              style={{ width: '100px', height: '40px' }} // Điều chỉnh kích thước logo
            />
          </Link>
        </div>

        <Menu
          className="menu-header"
          onClick={onClick}
          selectedKeys={[current]}
          mode="horizontal"
          items={items}
        />

        <div className="search-box">
          <input
            type="text"
            className="search-input"
            placeholder="What do you want to play?"
            value={searchQuery} // Liên kết giá trị với state
            onChange={(e) => setSearchQuery(e.target.value)} // Cập nhật giá trị khi nhập
            onKeyDown={handleKeyDown} // Xử lý nhấn phím
          />
          <SearchOutlined className="search-icon" onClick={handleSearch} />
        </div>

        <div className="auth-buttons">
          {auth.isAuthenticated ? (
            <button className="logout-btn" onClick={handleLogout}>
              Log out
            </button>
          ) : (
            <>
              <Link to="/login" className="login-btn">
                Login
              </Link>
              <Link to="/register" className="signup-btn">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default Header;
