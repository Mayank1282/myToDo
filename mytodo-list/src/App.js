import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./common/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import Login from "./components/Login";
import Registration from "./components/Registration";
import ForgotPassword from "./components/ForgotPassword";
import { AuthProvider } from "./context/auth/AuthContext";
import Dashboard from "./components/Dashboard";
import PageNotFound from "./components/PageNotFound";
import ProtectedRoutes from "./context/auth/ProtectedRoutes";
import CreateTask from "./components/CreateTask";
import TaskList from "./components/TaskList";
import Profile from "./components/Profile";
import { TaskProvider } from "./context/auth/TaskContext";

function App() {
  const Layout = ({ children }) => {
    const location = useLocation();

    // List the routes where you want to exclude the Navbar
    const hideNavbarRoutes = ["/login", "/register", "/forgot_psw"];

    return (
      <>
        {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
        <main>{children}</main>
      </>
    );
  };

  return (
    <BrowserRouter>
      <AuthProvider>
        <TaskProvider>
          <Layout />
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoutes>
                  <Home />
                </ProtectedRoutes>
              }
            ></Route>
            <Route path="/about" element={<About />}></Route>
            <Route
              path="/login"
              element={
                <ProtectedRoutes>
                  <Login />
                </ProtectedRoutes>
              }
            ></Route>
            <Route
              path="/register"
              element={
                <ProtectedRoutes>
                  <Registration />
                </ProtectedRoutes>
              }
            ></Route>
            <Route
              path="/forgot_psw"
              element={
                <ProtectedRoutes>
                  <ForgotPassword />
                </ProtectedRoutes>
              }
            ></Route>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoutes>
                  <Dashboard />
                </ProtectedRoutes>
              }
            ></Route>
            <Route
              path="/create_task"
              element={
                <ProtectedRoutes>
                  <CreateTask />
                </ProtectedRoutes>
              }
            ></Route>
            <Route
              path="/task_list"
              element={
                <ProtectedRoutes>
                  <TaskList />
                </ProtectedRoutes>
              }
            ></Route>
            <Route
              path="/profile"
              element={
                <ProtectedRoutes>
                  <Profile />
                </ProtectedRoutes>
              }
            ></Route>
            <Route path="*" element={<PageNotFound />}></Route>
          </Routes>
        </TaskProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
