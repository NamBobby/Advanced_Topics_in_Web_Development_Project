import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import RegisterPage from './pages/register.jsx';
import UserPage from './pages/user.jsx';
import HomePage from './pages/home.jsx';
import LoginPage from './pages/login.jsx';
import { AuthWrapper } from './components/layout/context/auth.context.jsx';
import UploadMusicPage from './pages/uploadmusic.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      {
        index: true, 
        element: <HomePage />
      },
      {
        path: "user", 
        element: <UserPage />
      },
    ]
  },
  {
    path: "register", 
    element: <RegisterPage />
  },
  {
    path: "login", 
    element: <LoginPage />
  },
  {
    path: "upload", 
    element: <UploadMusicPage />
  },
  
  
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthWrapper>
      <RouterProvider router={router} />
    </AuthWrapper>
  </React.StrictMode>,
)
