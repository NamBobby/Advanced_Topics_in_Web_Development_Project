import React, { useContext } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { AuthContext } from "./auth.context";

import MainLayout from "../App.jsx";
import AdminPage from "../containers/homePage/admin.jsx";
import AdminCreatePage from "../components/adminCreate";
import RegisterPage from "../containers/auth/register.jsx";
import LoginPage from "../containers/auth/login.jsx";
import HomePage from "../containers/homePage/home.jsx";
import ArtistInfo from "../containers/userPage/artistInfo.jsx";
import AlbumDetail from "../components/albumDetail.jsx";
import PlaylistDetail from "../components/playlistDetail.jsx";
import UploadMusicPage from "../containers/userPage/uploadmusic.jsx";
import UserAccount from "../containers/userPage/userAccount.jsx";
import UserInfo from "../containers/userPage/userInfo.jsx";
import SendOtpPage from "../containers/auth/sendotp.jsx";
import ResetPasswordPage from "../containers/auth/resetPassword.jsx";
import CreateAlbum from "../containers/userPage/createAlbum.jsx";
import CreatePlaylist from "../containers/userPage/createPlaylist.jsx";
import AlbumUserDetail from "./albumuserDetail.jsx";
import NotFoundPage from "../components/notfoundPage.jsx";


// Component Role-Based Router
const RoleBasedRouter = () => {
  const { auth } = useContext(AuthContext);

  const role = auth.isAuthenticated ? auth.user.role : "Guest";

  // Các route chung cho User và Artist
  const commonRoutes = [
    { index: true, element: <HomePage /> },
    { path: "artist/:name", element: <ArtistInfo /> },
    { path: "userInfo", element: <UserInfo />, state: { user: auth.user }, },
    { path: "album/:title", element: <AlbumDetail /> },
    { path: "playlist/:title", element: <PlaylistDetail /> },
    { path: "createplaylist", element: <CreatePlaylist /> },
  ];


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
            { path: "albumuser/:title", element: <AlbumUserDetail /> },
            ] 
          : []),
        ...(role === "User" || role === "Artist"
          ? commonRoutes 
          : []),
        ...(role === "Guest"
          ? [
              { index: true, element: <HomePage /> },
              { path: "artist/:name", element: <ArtistInfo /> },
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
    { path: "*", element: <NotFoundPage /> },
  ]);

  return <RouterProvider router={router} />;
};

export default RoleBasedRouter;
