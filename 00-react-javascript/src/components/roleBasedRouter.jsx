import React, { useContext } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { AuthContext } from "./auth.context";

import MainLayout from "../App.jsx";
import AdminPage from "../containers/homePage/admin.jsx";
import AdminCreatePage from "../components/adminCreate";
import RegisterPage from "../containers/auth/register.jsx";
import LoginPage from "../containers/auth/login.jsx";
import HomePage from "../containers/homePage/home.jsx";
import ArtistInfo from "../containers/profileInfoPage/artistInfo.jsx";
import AlbumUserList from "../containers/profileInfoPage/albumuserlist.jsx";
import PlayListUserList from "../containers/profileInfoPage/playlistuserlist.jsx";
import AlbumDetail from "../components/albumDetail.jsx";
import PlaylistDetail from "../components/playlistDetail.jsx";
import UploadMusicPage from "../containers/userPage/uploadmusic.jsx";
import UserAccount from "../containers/userPage/userAccount.jsx";
import UserInfo from "../containers/userPage/userInfo.jsx";
import SendOtpPage from "../containers/auth/sendotp.jsx";
import ResetPasswordPage from "../containers/auth/resetPassword.jsx";
import CreateAlbum from "../containers/userPage/createAlbum.jsx";
import CreatePlaylist from "../containers/userPage/createPlaylist.jsx";

// Các route chung cho User và Artist
const commonRoutes = [
  { index: true, element: <HomePage /> },
  { path: "artist/:id", element: <ArtistInfo /> },
  { path: "userInfo", element: <UserInfo /> },
  { path: "userAlbum", element: <AlbumUserList /> },
  { path: "userPlaylist", element: <PlayListUserList /> },
  { path: "album/:title", element: <AlbumDetail /> },
  { path: "playlist/:title", element: <PlaylistDetail /> },
  { path: "createplaylist", element: <CreatePlaylist /> },
];

// Component Role-Based Router
const RoleBasedRouter = () => {
  const { auth } = useContext(AuthContext);

  // Xác định role
  const role = auth.isAuthenticated ? auth.user.role : "Guest";

  // Router configuration
  const router = createBrowserRouter([
    {
      path: "/",
      element: role === "Administrator" ? <AdminPage /> : <MainLayout />,
      children: [
        ...(role === "Administrator"
          ? [{ path: "create", element: <AdminCreatePage /> }] 
          : []),
        ...(role === "Artist"
          ? [
            { path: "uploadmusic", element: <UploadMusicPage /> },
            { path: "createalbum", element: <CreateAlbum /> },
            ] 
          : []),
        ...(role === "User" || role === "Artist"
          ? commonRoutes 
          : []),
        ...(role === "Guest"
          ? [
              { index: true, element: <HomePage /> },
              { path: "artist/:id", element: <ArtistInfo /> },
              { path: "userAlbum", element: <AlbumUserList /> },
              { path: "album/:title", element: <AlbumDetail /> },
            ]
          : []),
      ],
    },
    { path: "/profile", element: <UserAccount /> },
    { path: "/register", element: <RegisterPage /> },
    { path: "/forgot-password", element: <SendOtpPage /> },
    { path: "/resetpassword", element: <ResetPasswordPage /> },
    { path: "/login", element: <LoginPage /> },
    { path: "*", element: <Navigate to="/" /> },
  ]);

  return <RouterProvider router={router} />;
};

export default RoleBasedRouter;
