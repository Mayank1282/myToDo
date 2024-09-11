import React, { useContext, useEffect, useRef, useState } from "react";
import profile from "../assets/default_profile.png";
import AuthContext from "../context/auth/AuthContext";
import { designation } from "../utitlity/apirequests";

function Profile(props) {
  const [editChange, setEditChange] = useState(false);

  const { user, setMessage, message, Profileup } = useContext(AuthContext);

  const editProfile = (e) => {
    e.preventDefault();
    setEditChange(true);
  };

  const forminit = {
    name: "",
    designation: "",
    gender: "",
    dob: "",
    profile_image: "",
  };

  const [formData, setFormData] = useState(forminit);

  const [imagePreview, setImagePreview] = useState(profile);

  const inputField = useRef(null);

  const [errors, setErrors] = useState({
    name: [],
    designation: [],
    gender: [],
    dob: [],
    profile_image: [],
  });

  const [dirty, setDirty] = useState({
    name: false,
    designation: false,
    gender: false,
    dob: false,
    profile_image: false,
  });

  const validate = () => {
    const errorData = {};
    errorData.name = [];
    errorData.designation = [];
    errorData.gender = [];
    errorData.dob = [];
    errorData.profile_image = [];

    if (!formData.name) {
      errorData.name.push("Please Enter Name");
    }

    if (!formData.designation) {
      errorData.designation.push("Please Select Designation");
    }

    if (!formData.gender) {
      errorData.gender.push("Please Select Gender");
    }

    if (!formData.dob) {
      errorData.dob.push("Please Select Date of Birth");
    }

    if (!formData.profile_image || formData.profile_image === "") {
      errorData.profile_image.push("Please Select Profile Image");
    }

    setErrors(errorData);
  };

  useEffect(() => {
    validate();
  }, [formData]);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        // const base64String = reader.result.replace(/^data:.+;base64,/, "");
        setFormData((prev) => ({
          ...prev,
          profile_image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const updateProfile = (e) => {
    e.preventDefault();
    if (isValid()) {
      Profileup(formData);
      setEditChange((prev) => !prev);
      setInterval(() => {
        setMessage("");
      }, 3000);
    } else {
      const currVal = inputField.current.value;
      if (!currVal) {
        Object.keys(dirty).forEach((temp) => (dirty[temp] = true));
      }
      setMessage("Please resolve all errors in the form");
    }
  };

  useEffect(() => {
    if (!user?.profile_image) {
      setImagePreview(profile);
    } else {
      const profile_image = `http://localhost:5000/public/user_images/${user?.profile_image}`;
      setImagePreview(profile_image);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  useEffect(() => {
    setMessage("");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-300 to-gray-300">
      <div className="bg-purple-100 rounded-lg shadow-lg p-8 w-3/4 max-w-2xl">
        <div className="flex items-center mb-8">
          <img
            src={imagePreview} // replace with your actual image path
            alt="Profile"
            className="rounded-full w-32 h-32"
          />
          <div className="ml-8">
            <h2 className="text-xl font-semibold text-gray-800">
              {user?.name}
            </h2>
            <p className="text-gray-600">{user?.dob}</p>
            <p className="text-gray-600">{user?.gender}</p>
            <p className="text-gray-600">{user?.phone}</p>
            <p className="text-gray-600">{user?.designation}</p>
            <button
              className="mt-4 px-4 py-2 bg-purple-400 text-white rounded hover:bg-purple-500"
              onClick={editProfile}
            >
              Edit Profile
            </button>
          </div>
        </div>

        {editChange ? (
          <>
            <hr className="border-gray-300" />

            <div className="mt-8">
              <form className="space-y-4" encType="multipart/form-data">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Name"
                      name="name"
                      value={formData?.name}
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                      onChange={handleChange}
                      onBlur={onblurHandle}
                      ref={inputField}
                    />
                    <div className="text-danger">
                      {dirty["name"] && errors["name"][0] ? errors["name"] : ""}
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Designation
                    </label>
                    <select
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                      defaultValue={
                        formData?.designation
                          ? formData?.designation
                          : "Designation"
                      }
                      onChange={handleChange}
                      onBlur={onblurHandle}
                      ref={inputField}
                      name="designation"
                    >
                      <option disabled>Designation</option>
                      {designation.map((item, index) => (
                        <option key={index} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                    <div className="text-danger">
                      {dirty["designation"] && errors["designation"][0]
                        ? errors["designation"]
                        : ""}
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Gender
                    </label>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="male"
                        name="gender"
                        value="male"
                        className="mr-2"
                        checked={formData?.gender === "male"}
                        onChange={handleChange}
                        onBlur={onblurHandle}
                        ref={inputField}
                      />
                      <label htmlFor="male" className="mr-4">
                        Male
                      </label>
                      <input
                        type="radio"
                        id="female"
                        name="gender"
                        value="female"
                        className="mr-2"
                        checked={formData?.gender === "female"}
                        onChange={handleChange}
                        onBlur={onblurHandle}
                        ref={inputField}
                      />
                      <label htmlFor="female">Female</label>
                    </div>
                    <div className="text-danger">
                      {dirty["gender"] && errors["gender"][0]
                        ? errors["gender"]
                        : ""}
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Date Of Birth
                    </label>
                    <input
                      type="date"
                      name="dob"
                      value={formData?.dob || ""}
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                      onChange={handleChange}
                      onBlur={onblurHandle}
                      ref={inputField}
                    />
                    <div className="text-danger">
                      {dirty["dob"] && errors["dob"][0] ? errors["dob"] : ""}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-semibold mb-2">
                      Profile Picture
                    </label>
                    <input
                      type="file"
                      accept="image/jpg,image/png,image/jpeg"
                      onChange={handleImageChange}
                      name="profile_image"
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                      onBlur={onblurHandle}
                      ref={inputField}
                    />
                    <div className="text-danger">
                      {dirty["profile_image"] && errors["profile_image"][0]
                        ? errors["profile_image"]
                        : ""}
                    </div>
                  </div>
                </div>

                <button
                  className="mt-8 px-4 py-2 bg-purple-400 text-white rounded hover:bg-purple-500 w-full md:w-auto"
                  onClick={updateProfile}
                >
                  Update Profile
                </button>

                {message}
              </form>
            </div>
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default Profile;
