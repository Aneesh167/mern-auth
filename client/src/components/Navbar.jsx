import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContex";
import { toast } from "react-toastify";
import axios from "axios";
import { useState } from "react";

const Navbar = () => {
  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClick = (e) => {
      if (
        !e.target.closest(".user-menu-icon") &&
        !e.target.closest(".user-menu-list")
      ) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [showMenu]);
  const [state, setState] = useState("Sign Up");
  const [showMenu, setShowMenu] = useState(false);

  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedIn } =
    useContext(AppContent);

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        backendUrl + "/api/auth/send-verify-otp"
      );
      if (data.success) {
        navigate("/email-verify");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/api/auth/logout");
      if (data.success) {
        setIsLoggedIn(false);
        setUserData(null);
        navigate("/");
        toast.success("Logged out successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0 left-0">
      <img src={assets.logo} alt="" className="w-20 sm:w-32" />

      {userData ? (
        <div className="w-8 h-8 flex justify-center items-center bg-gray-200 rounded-full text-gray-800 font-medium cursor-pointer relative user-menu-icon">
          <span
            onClick={() => setShowMenu((prev) => !prev)}
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {userData.name && userData.name[0]
              ? userData.name[0].toUpperCase()
              : "U"}
          </span>
          {showMenu && (
            <div className="absolute top-0 right-0 z-10 text-black rounded pt-10 user-menu-list">
              <ul className="list-none m-0 p-2 bg-gray-100 ">
                {userData && !userData.isAccountVerified && (
                  <li
                    onClick={() => {
                      sendVerificationOtp();
                      setShowMenu(false);
                    }}
                    className="py-1 px-2 hover:bg-gray-300 cursor-pointer transition-all whitespace-nowrap"
                  >
                    Verify email
                  </li>
                )}
                <li
                  onClick={() => {
                    logout();
                    setShowMenu(false);
                  }}
                  className="py-1 px-2 hover:bg-gray-300 cursor-pointer transition-all"
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div>
          <button
            onClick={() => navigate("/login", { state: "Login" })}
            className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all"
          >
            Login <img src={assets.arrow_icon} alt="" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
