import React from "react";
import ReactDOM from "react-dom/client";
import { AuthWrapper } from "./components/auth.context";
import RoleBasedRouter from "./components/roleBasedRouter"; // Import RoleBasedRouter
import "./main.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthWrapper>
      <RoleBasedRouter />
    </AuthWrapper>
  </React.StrictMode>
);
