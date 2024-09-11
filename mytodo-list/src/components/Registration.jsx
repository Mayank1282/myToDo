import React, { useContext, useEffect, useRef, useState } from "react";
import "../index.css";
import { Link } from "react-router-dom";
import "../../node_modules/react-phone-number-input/bundle/style.css";
import "../assets/css/register.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import PhoneInput from "react-phone-number-input";
import AuthContext from "../context/auth/AuthContext";

function Registration(props) {
  const { register, message, setMessage } = useContext(AuthContext);

  const [pswdAction, setPswdAction] = useState(false);

  const [formData, setFormData] = useState([]);

  const [phoneNumber, setPhoneNumber] = useState("");

  const handleInputChange = (value) => {
    setPhoneNumber(value);

    setFormData((prev) => ({
      ...prev,
      phone: phoneNumber,
    }));
  };

  const inputField = useRef(null);

  const [errors, setErrors] = useState({
    name: [],
    email: [],
    phone: [],
    password: [],
    confirm_password: [],
  });

  const [dirty, setDirty] = useState({
    name: false,
    email: false,
    phone: false,
    password: false,
    confirm_password: false,
  });

  const validate = () => {
    let errorData = {};
    errorData.name = [];
    errorData.email = [];
    errorData.phone = [];
    errorData.password = [];
    errorData.confirm_password = [];

    //name

    if (!formData.name) {
      errorData.name.push("Please Enter Name");
    }

    // email
    if (!formData.email) {
      errorData.email.push("Please Enter Email");
    }

    let emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;

    if (formData.email) {
      if (!emailReg.test(formData.email)) {
        errorData.email.push("Please enter valid email");
      }
    }

    if (!formData.phone) {
      errorData.phone.push("Please enter valid Number");
    }

    //password

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

    if (!formData.confirm_password) {
      errorData.confirm_password.push("Please Enter Confirm Password");
    }

    if (formData.confirm_password) {
      if (formData.password != formData.confirm_password)
        errorData.confirm_password.push("Password does not match");
    }

    if (formData.confirm_password) {
      if (!passReg.test(formData.confirm_password)) {
        errorData.confirm_password.push(
          "Please Enter Password between 8 to 12 characters"
        );
      }
    }

    setErrors(errorData);
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

  // for Background colour
  useEffect(() => {
    document.body.classList.add("register_bg");

    return () => {
      document.body.classList.remove("register_bg");
    };
  }, []);

  const isValid = () => {
    let valid = true;
    for (let control in errors) {
      if (errors[control].length > 0) {
        valid = false;
      }
    }
    return valid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    handleInputChange(phoneNumber);

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
      register(formData); //context part//
    } else {
      const currVal = inputField.current.value;
      if (!currVal) {
        Object.keys[dirty].forEach((temp) => (dirty[temp] = true));
      }
      setMessage("Please resolve errors in the form");
    }
  };

  useEffect(() => {
    setMessage("");
  }, []);

  return (
    <div className="mt-20 flex justify-center">
      <div className="w-600 card text-center rounded-[5px] border-black registration-card">
        <div className="card-body">
          <div className="form-body">
            <form className="flex justify-center">
              <div className="form-container">
                <h2>• Registration Form •</h2>
                <div className="form-group mt-5">
                  <label htmlFor="name">
                    <span className="flex justify-start">• Name</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    ref={inputField}
                    onChange={handleChange}
                    onBlur={onblurHandle}
                  />
                  <div className="text-danger">
                    {dirty["name"] && errors["name"][0] ? errors["name"] : ""}
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="email">
                    <span className="flex justify-start">• Email</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    ref={inputField}
                    onChange={handleChange}
                    onBlur={onblurHandle}
                  />
                  <div className="text-danger">
                    {dirty["email"] && errors["email"][0]
                      ? errors["email"]
                      : ""}
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="phone">
                    <span className="flex justify-start">• Phone No.</span>
                  </label>
                  <PhoneInput
                    defaultCountry={"IN"}
                    value={phoneNumber}
                    onChange={handleInputChange}
                  />
                  <div className="text-danger">
                    {dirty["phone"] && errors["phone"][0]
                      ? errors["phone"]
                      : ""}
                  </div>
                </div>
                <div className="form-group password-eye">
                  <label htmlFor="password">
                    <span className="flex justify-start">• Password</span>
                  </label>
                  <input
                    type={pswdAction ? "text" : "password"}
                    id="password"
                    name="password"
                    ref={inputField}
                    onChange={handleChange}
                    onBlur={onblurHandle}
                  />
                  <FontAwesomeIcon
                    icon={faEye}
                    className="absolute right-20 mt-2 mr-16 text-black"
                    onClick={pswd_hide}
                  ></FontAwesomeIcon>
                  <div className="text-danger">
                    {dirty["password"] && errors["password"][0]
                      ? errors["password"]
                      : ""}
                  </div>
                </div>
                <div className="form-group password-eye">
                  <label htmlFor="confirm-password">
                    <span className="flex justify-start">
                      • Confirm Password
                    </span>
                  </label>
                  <input
                    type="text"
                    id="confirm-password"
                    name="confirm_password"
                    ref={inputField}
                    onChange={handleChange}
                    onBlur={onblurHandle}
                  />
                  <div className="text-danger">
                    {dirty["confirm_password"] && errors["confirm_password"][0]
                      ? errors["confirm_password"]
                      : ""}
                  </div>
                </div>
                {message}
                <button className="btn-register mt-3" onClick={submitForm}>
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
        <div>
          <span className="text-black">Already Have an account ? </span>
          <Link to="/login" className="text-[#04B2EB] hover:text-[#244698]">
            {" "}
            Sign in
          </Link>
        </div>
        <div className="mt-3">
          <span className="text-black"> Return to </span>
          <Link to="/" className="text-[#04B2EB] hover:text-[#244698]">
            {" "}
            Home{" "}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Registration;
