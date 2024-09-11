import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ProtectedRoutes({ children }) {
  const [isLogged, setIsLogged] = useState();

  const navigate = useNavigate();

  const getUrl = useLocation().pathname;

  const condition =
    getUrl == "/" ||
    getUrl == "/login" ||
    getUrl == "/register" ||
    getUrl == "/forgot_psw";

  useEffect(() => {
    let localUser = "";

    if (localStorage.getItem("toDo")) {
      localUser = localStorage.getItem("toDo");
    } else {
      localUser = sessionStorage.getItem("toDo");
    }

    const user = JSON.parse(localUser);

    if (!user) {
      if (condition) {
        setIsLogged(true);
        navigate(getUrl);
      } else {
        setIsLogged(false);
        navigate("/");
      }
    } else {
      setIsLogged(true);
      if (condition) {
        navigate("/dashboard");
      }
    }
  }, []);

  return <>{isLogged ? children : null}</>;
}

export default ProtectedRoutes;
