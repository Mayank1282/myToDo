import React, { useContext, useEffect, useRef, useState } from "react";
import img from "../assets/login_bg.jpg";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faUser } from "@fortawesome/free-solid-svg-icons";
import AuthContext from "../context/auth/AuthContext";

function ForgotPassword(props) {
  const { forgotPassword, message, setMessage } = useContext(AuthContext);

  const [formData, setFormData] = useState([]);

  const [pswdAction1, setPswdAction1] = useState(false);
  const [pswdAction2, setPswdAction2] = useState(false);

  const inputField = useRef(null);

  const [errors, setErrors] = useState({
    email: [],
    old_pswd: [],
    new_pswd: [],
    confirm_pswd: [],
  });

  const [dirty, setDirty] = useState({
    email: false,
    old_pswd: false,
    new_pswd: false,
    confirm_pswd: false,
  });

  const validate = () => {
    let errorData = {};
    errorData.email = [];
    errorData.old_pswd = [];
    errorData.new_pswd = [];
    errorData.confirm_pswd = [];

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

    let passReg =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/;

    //old password//

    if (!formData.old_pswd) {
      errorData.old_pswd.push("Please Enter Password");
    }

    if (formData.old_pswd) {
      if (!passReg.test(formData.old_pswd)) {
        errorData.old_pswd.push(
          "Please Enter Password between 8 to 12 characters"
        );
      }
    }

    //new password//

    if (!formData.new_pswd) {
      errorData.new_pswd.push("Please Enter Password");
    }

    if (formData.new_pswd == formData.old_pswd) {
      errorData.new_pswd.push(" Old Password should not match new Password ");
    }

    if (formData.new_pswd) {
      if (!passReg.test(formData.new_pswd)) {
        errorData.new_pswd.push(
          " Please Enter Password between 8 to 12 characters "
        );
      }
    }

    //confirm password//

    if (!formData.confirm_pswd) {
      errorData.confirm_pswd.push("Please Enter Password");
    }

    if (formData.confirm_pswd == formData.old_pswd) {
      errorData.confirm_pswd.push("Old Password should not match new Password");
    }

    if (formData.confirm_pswd) {
      if (formData.new_pswd != formData.confirm_pswd) {
        errorData.confirm_pswd.push(
          "New Password does not match Confirm Password"
        );
      }
    }

    if (formData.confirm_pswd) {
      if (!passReg.test(formData.confirm_pswd)) {
        errorData.confirm_pswd.push(
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
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
      forgotPassword(formData);
    } else {
      const currVal = inputField.current.value;

      if (!currVal) {
        Object.keys(dirty).forEach((test) => (dirty[test] = true));
      }

      setMessage("Please resolve all errors in form");
    }
  };

  const pswd1_hide = () => {
    if (pswdAction1) {
      setPswdAction1(false);
    } else {
      setPswdAction1(true);
    }
  };

  const pswd2_hide = () => {
    if (pswdAction2) {
      setPswdAction2(false);
    } else {
      setPswdAction2(true);
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
          <h5 className="card-title text-[55px] text-white">Forgot Password</h5>
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
                onClick={pswd1_hide}
              />
              <input
                className="pl-5 mt-3 block w-96 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                type="password"
                name="old_pswd"
                placeholder="Old Password"
                ref={inputField}
                onChange={handleChange}
                onBlur={onblurHandle}
              />
            </div>
            <div className="text-danger mt-2">
              {dirty["old_pswd"] && errors["old_pswd"][0]
                ? errors["old_pswd"]
                : ""}
            </div>
            <div className="justify-center relative flex items-center">
              <FontAwesomeIcon
                icon={faEye}
                className="absolute right-20 mt-3 text-black"
                onClick={pswd2_hide}
              />
              <input
                className="pl-5 mt-3 block w-96 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                type="password"
                name="new_pswd"
                placeholder="New Password"
                ref={inputField}
                onChange={handleChange}
                onBlur={onblurHandle}
              />
            </div>
            <div className="text-danger mt-2">
              {dirty["new_pswd"] && errors["new_pswd"][0]
                ? errors["new_pswd"]
                : ""}
            </div>
            <div className="justify-center relative flex items-center">
              <input
                className="pl-5 mt-3 block w-96 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                type="text"
                name="confirm_pswd"
                placeholder="Confirm New Password"
                ref={inputField}
                onChange={handleChange}
                onBlur={onblurHandle}
              />
            </div>
            <div className="text-danger mt-2">
              {dirty["confirm_pswd"] && errors["confirm_pswd"][0]
                ? errors["confirm_pswd"]
                : ""}
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
        <div className="mt-3">
          <span className="text-white"> Return to </span>
          <Link to="/login" className="text-[#5AC5E7] hover:text-[#244698]">
            {" "}
            Login{" "}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
