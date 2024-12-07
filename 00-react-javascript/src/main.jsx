import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './main.css';

import MainLayout from './App.jsx'; // Layout chính với Sidebar
import RegisterPage from './containers/auth/register.jsx';
import HomePage from './containers/homePage/home.jsx';
import LoginPage from './containers/auth/login.jsx';
import AdminPage from './containers/homePage/admin.jsx';
import { AuthWrapper } from './components/auth.context.jsx';
import UserInfo from './containers/profileInfoPage/userInfo.jsx';

const router = createBrowserRouter([
  {
    path: '/', // Layout chính có Sidebar
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> }, // Trang chủ
      { path: 'userInfo', element: <UserInfo /> }, 
    ],
  },
  {
    path: '/register', // Không có Sidebar
    element: <RegisterPage />,
  },
  {
    path: '/login', // Không có Sidebar
    element: <LoginPage />,
  },
  {
    path: '/admin', // Không có Sidebar
    element: <AdminPage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthWrapper>
      <RouterProvider router={router} />
    </AuthWrapper>
  </React.StrictMode>
);
