import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext({
  isAuthenticated: false,
  user: {
    email: "",
    name: "",
  },
  appLoading: true,
});

export const AuthWrapper = (props) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: {
      email: "",
      name: "",
    },
  });

  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {

    const isFirstLoad = sessionStorage.getItem("firstLoad") === null;
    if (isFirstLoad) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      sessionStorage.setItem("firstLoad", "false");
    }

    const access_token = localStorage.getItem("access_token");
    const userData = localStorage.getItem("user");

    if (access_token && userData) {
      setAuth({
        isAuthenticated: true,
        user: JSON.parse(userData),
      });
    } else {
      setAuth({
        isAuthenticated: false,
        user: {
          email: "",
          name: "",
        },
      });
    }
    setAppLoading(false);

    // Dispatch sự kiện auth update
    window.dispatchEvent(new Event("authUpdate"));
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth, appLoading, setAppLoading }}>
      {props.children}
    </AuthContext.Provider>
  );
};
