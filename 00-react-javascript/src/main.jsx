import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './main.css';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RegisterPage from './containers/register.jsx';
import HomePage from './containers/home.jsx';
import LoginPage from './containers/login.jsx';
import AdminPage from './containers/admin.jsx';
import { AuthWrapper } from './components/auth.context.jsx';
import UserInfo from './containers/userInfo.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
  {
    path: 'register',
    element: <RegisterPage />,
  },
  {
    path: 'login',
    element: <LoginPage />,
  },
  {
    path: 'admin',
    element: <AdminPage />,
  },
  {
    path: 'userInfo',
    element: <UserInfo />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthWrapper>
      <RouterProvider router={router} />
    </AuthWrapper>
  </React.StrictMode>
);
