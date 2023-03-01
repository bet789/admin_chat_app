import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "../pages/auth/login";
import Logout from "../pages/auth/logout";
import Page404 from "../pages/error/404";

import AuthProtectedLayout from "../layouts/";

const Index = () => {
  const AuthProtected = ({ children }) => {
    let auth = sessionStorage.getItem("token") ? true : false;
    if (!auth) {
      return <Navigate to="/sign-in" />;
    }
    return children;
  };

  return (
    <React.Fragment>
      <Router>
        <Routes>
          <Route
            path="/*"
            element={
              <AuthProtected>
                <AuthProtectedLayout />
              </AuthProtected>
            }
          />
          <Route element={<Login />} path="/sign-in" />;
          <Route element={<Logout />} path="/logout" />
          <Route element={<Page404 />} path="/404" />
        </Routes>
      </Router>
    </React.Fragment>
  );
};

export default Index;
