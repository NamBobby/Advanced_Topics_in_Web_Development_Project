import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app.jsx';
import './styles/main.css';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RegisterPage from './pages/register.jsx';
import HomePage from './pages/home.jsx';
import LoginPage from './pages/login.jsx';
import AdminPage from './pages/admin.jsx';
import { AuthWrapper } from './components/layout/context/auth.context.jsx';
import UserInfo from './pages/userInfo.jsx';

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
