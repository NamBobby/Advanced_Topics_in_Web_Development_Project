import React, { useState } from 'react';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';

const Header = () => {
    const items = [
        {
          label: <Link to="/">Home Page</Link>,
          key: 'home',
          icon: <MailOutlined />,
        },
        {
            label: <Link to="/user">Users</Link>,
            key: 'user',
            icon: <MailOutlined />,
          },
        {
          label: 'Welcome Bobby',
          key: 'SubMenu',
          icon: <SettingOutlined />,
          children: [
            {
                label: 'Login',
                key: 'login',
            },
            {
                label: 'Log out',
                key: 'logout',
            },
          ],
        },
      ];
  const [current, setCurrent] = useState('mail');
  const onClick = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };
  return <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />;
};
export default Header;