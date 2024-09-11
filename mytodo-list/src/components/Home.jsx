import React, { useEffect } from "react";
import main_icon from "../assets/main_icon.png";
import { Link } from "react-router-dom";

function Home() {
  useEffect(() => {
    document.body.style.background = "rgb(242, 147, 227)";

    document.body.style.background =
      "linear-gradient(90deg,rgba(242, 147, 227, 0.47) 100%,rgba(140, 85, 131, 0.74) 100%)";

    return () => {
      document.body.style.background = "";
      document.body.style.background = "";
    };
  }, []);

  return (
    <div>
      <div className="text-[80px] mt-5 flex justify-center common_colour">
        Welcome To
      </div>
      <div className="flex justify-center">
        <img className="w-60 -rotate-6" src={main_icon} alt="logo.png" />
      </div>
      <div className="text-[40px] flex justify-center common_colour">Mfit</div>
      <div className="text-[40px] flex justify-center common_colour">
        Your Own Platform for Creating
      </div>
      <div className="text-[40px] flex justify-center common_colour">
        Tasks and Play with it
      </div>
      <div className="flex justify-center mt-7 mb-4">
        <Link
          to="/login"
          className="text-center button_shadow md:shadow-lg text-[50px] w-80 h-24 px-4 py-2 bg-[#C86ACD] font-semibold rounded-full hover:bg-[#8867F3] focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
        >
          Login
        </Link>
      </div>
    </div>
  );
}

export default Home;
