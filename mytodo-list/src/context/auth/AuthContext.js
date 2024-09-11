import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const register = async (formData) => {
    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    };

    const checkUser = await fetch(
      `http://localhost:5000/registration?email=${formData.email}`,
      { method: "GET" }
    );

    if (checkUser.ok) {
      const user = await checkUser.json();

      if (user.user.length > 0) {
        setMessage("User Already Exists");
      } else {
        const response = await fetch(
          `http://localhost:5000/registration`,
          config
        );

        if (response.ok) {
          await response.json();

          setMessage("Registered Successfully");

          setTimeout(() => {
            navigate("/login");
          }, 3000);
        } else {
          setMessage("Something Went Wrong");
        }
      }
    } else {
      setMessage("Something Went Wrong, please try again");
    }
  };

  const login = async (formData) => {
    const getuser = await fetch(
      `http://localhost:5000/login?email=${formData.email}&password=${formData.password}`,
      { method: "GET" }
    );

    if (getuser.ok) {
      const user = await getuser.json();

      if (user.length > 0) {
        if (formData.checked) {
          localStorage.setItem("toDo", JSON.stringify(user[0]));
        } else {
          sessionStorage.setItem("toDo", JSON.stringify(user[0]));
        }
        setUser(user[0]);
        setMessage("Login Successfully");
        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);
      } else {
        setMessage("Invalid Login Details");
      }
    }
  };

  const forgotPassword = async (formData) => {
    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    };

    const user = await fetch(
      `http://localhost:5000/login?email=${formData.email}&password=${formData.old_pswd}`,
      { method: "GET" }
    );

    if (user.ok) {
      const chkUser = await user.json();

      if (chkUser.length > 0) {
        const updatePswd = await fetch(
          `http://localhost:5000/forgot_pwd`,
          config
        );

        if (updatePswd.ok) {
          const check = await updatePswd.json();

          if (Object.keys(check).length > 0) {
            setMessage("Password Changed Successfully");
            setTimeout(() => {
              navigate("/login");
            }, 3000);
          } else {
            setMessage("Something went wrong");
          }
        }
      } else {
        setMessage("Invalid Email or Old Password");
      }
    }
  };

  // Check if User is logged in //

  const checkUser = async () => {
    let local = "";

    if (localStorage.getItem("toDo")) {
      local = localStorage.getItem("toDo");
    } else {
      local = sessionStorage.getItem("toDo");
    }

    if (local) {
      const user = JSON.parse(local);
      const getData = await fetch(
        `http://localhost:5000/registration?email=${user.email}`,
        { method: "GET" }
      );

      if (getData.ok) {
        const data = await getData.json();
        if (data.user.length > 0) {
          setUser(data.user[0]);
        } else {
          localStorage.removeItem("toDo");
          sessionStorage.removeItem("toDo");
          navigate("/");
        }
      }
    }
  };

  // ----------- //

  useEffect(() => {
    checkUser();
  }, []);

  const logout = () => {
    localStorage.removeItem("toDo"); // for remember me //
    sessionStorage.removeItem("toDo"); // for normal case //
    setUser(null);
    navigate("/");
  };

  const Profileup = async (formData) => {
    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    };

    const response = await fetch(`http://localhost:5000/profileUpdate`, config);

    if (response.ok) {
      await response.json();

      setMessage("Profile Updated Successfully");
    } else {
      setMessage("Something Went Wrong");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        message,
        setMessage,
        forgotPassword,
        logout,
        Profileup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
