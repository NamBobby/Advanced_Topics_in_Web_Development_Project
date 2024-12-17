import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import "./main.css";

import MainLayout from "./App.jsx";
import RegisterPage from "./containers/auth/register.jsx";
import HomePage from "./containers/homePage/home.jsx";
import LoginPage from "./containers/auth/login.jsx";
import AdminPage from "./containers/homePage/admin.jsx";
import { AuthWrapper } from "./components/auth.context.jsx";
import UserInfo from "./containers/profileInfoPage/userInfo.jsx";
import AlbumUserList from "./containers/profileInfoPage/albumuserlist.jsx";
import PlayListUserList from "./containers/profileInfoPage/playlistuserlist.jsx";
import AlbumDetail from "./components/albumDetail.jsx";
import PlaylistDetail from "./components/playlistDetail.jsx";
import UploadMusicPage from "./containers/userPage/uploadmusic.jsx";
import ProfilePage from "./containers/userPage/userAccount.jsx";

// Lấy role từ localStorage
const role = localStorage.getItem("role");

const router = createBrowserRouter([
  {
    path: "/", // Layout chính
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "userInfo", element: <UserInfo /> },
      { path: "userAlbum", element: <AlbumUserList /> },
      { path: "userPlaylist", element: <PlayListUserList /> },
      { path: "album/:title", element: <AlbumDetail /> },
      { path: "playlist/:title", element: <PlaylistDetail /> },
      { path: "uploadmusic", element: <UploadMusicPage /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminPage />,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  { path: "*", element: <Navigate to="/" /> },
]);


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthWrapper>
      <RouterProvider router={router} />
    </AuthWrapper>
  </React.StrictMode>
);
