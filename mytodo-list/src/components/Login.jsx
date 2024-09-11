import React, { useContext, useEffect, useRef, useState } from "react";
import img from "../assets/login_bg.jpg";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faUser } from "@fortawesome/free-solid-svg-icons";
import AuthContext from "../context/auth/AuthContext";

function Login(props) {
  const { login, message, setMessage } = useContext(AuthContext);

  const [pswdAction, setPswdAction] = useState(false);

  const [formData, setFormData] = useState([]);

  const inputField = useRef(null);

  const [errors, setErrors] = useState({
    email: [],
    password: [],
  });

  const [dirty, setDirty] = useState({
    email: false,
    password: false,
  });

  const validate = () => {
    let errorData = {};
    errorData.email = [];
    errorData.password = [];

    //email//

    let emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;

    if (!formData.email) {
      errorData.email.push("Please Provide email");
    }

    if (formData.email) {
      if (!emailReg.test(formData.email)) {
        errorData.email.push("Please Provide valid email");
      }
    }

    //password//
    let passReg =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/;

    if (!formData.password) {
      errorData.password.push("Please Enter Password");
    }

    if (formData.password) {
      if (!passReg.test(formData.password)) {
        errorData.password.push(
          "Please Enter Password between 8 to 12 characters"
        );
      }
    }

    setErrors(errorData);
  };

  const isValid = () => {
    let valid = true;
    for (let key in errors) {
      if (errors[key].length > 0) {
        valid = false;
      }
    }
    return valid;
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      checked: checked,
    }));
  };

  const onblurHandle = (e) => {
    const { name } = e.target;

    setDirty((dirty) => ({
      ...dirty,
      [name]: true,
    }));

    validate();
  };

  const submitForm = (e) => {
    e.preventDefault();

    if (isValid()) {
      login(formData);
    } else {
      const currVal = inputField.current.value;

      if (!currVal) {
        Object.keys(dirty).forEach((test) => (dirty[test] = true));
      }

      setMessage("Please resolve all errors in form");
    }
  };

  const pswd_hide = () => {
    if (pswdAction) {
      setPswdAction(false);
    } else {
      setPswdAction(true);
    }
  };

  useEffect(() => {
    validate();
  }, [formData]);

  useEffect(() => {
    setMessage("");
  }, []);

  useEffect(() => {
    document.body.style.backgroundImage = `url(${img})`;
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.margin = "0";
    document.body.style.height = "100vh";

    return () => {
      document.body.style.backgroundImage = "";
      document.body.style.backgroundRepeat = "";
      document.body.style.backgroundSize = "";
      document.body.style.backgroundPosition = "";
      document.body.style.margin = "";
      document.body.style.height = "";
    };
  }, []);

  return (
    <div className="pt-80 flex justify-center">
      <div className="w-600 card text-center rounded-[53px] border-[#315CAB] transparent-card">
        <div className="card-body">
          <h5 className="card-title text-[55px] text-white">Login</h5>
          <form>
            <div className="justify-center relative flex items-center">
              <FontAwesomeIcon
                icon={faUser}
                className="absolute right-20 mt-3 text-black"
              />
              <input
                className="pl-5 mt-3 block w-96 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                type="email"
                name="email"
                placeholder="Enter Your Email"
                ref={inputField}
                onChange={handleChange}
                onBlur={onblurHandle}
              />
            </div>
            <div className="text-danger mt-2">
              {dirty["email"] && errors["email"][0] ? errors["email"] : ""}
            </div>
            <div className="justify-center relative flex items-center">
              <FontAwesomeIcon
                icon={faEye}
                className="absolute right-20 mt-3 text-black"
                onClick={pswd_hide}
              />
              <input
                className="pl-5 mt-3 block w-96 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                type={pswdAction ? "text" : "password"}
                name="password"
                placeholder="Enter Your Password"
                ref={inputField}
                onChange={handleChange}
                onBlur={onblurHandle}
              />
            </div>
            <div className="text-danger mt-2">
              {dirty["password"] && errors["password"][0]
                ? errors["password"]
                : ""}
            </div>
            <div className="mt-3">
              <input
                type="checkbox"
                name="remember_me"
                onChange={handleChange}
              />
              <span className="text-white"> Remember Me </span>
              <Link to="/forgot_psw">
                <span className="text-white pl-16"> Forgot Password ? </span>
              </Link>
            </div>
            <input
              type="submit"
              className="btn btn-light mt-3"
              name="Login"
              onClick={submitForm}
            />
            {message}
          </form>
        </div>
        <div className="mt-2">
          <span className="text-white"> Don't Have an account ? </span>
          <Link to="/register" className="text-[#5AC5E7] hover:text-[#244698]">
            {" "}
            Register
          </Link>
        </div>
        <div className="mt-3">
          <span className="text-white"> Return to </span>
          <Link to="/" className="text-[#5AC5E7] hover:text-[#244698]">
            {" "}
            Home{" "}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
