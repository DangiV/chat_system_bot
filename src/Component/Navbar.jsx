import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { userlocalStorageData } from "./helper/localStorage";

const Navbar = () => {
  const navigate = useNavigate();
  const userData = userlocalStorageData();

  const logoutUser = () => {
    localStorage.clear('userDetails')
    toast.success('user logout successfully')
  }
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        {userData ? (
          <>
            <Link className="navbar-brand" to="/">
              Chat
            </Link>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav mr-auto">
                <li className="nav-item active">
                  <Link className="nav-link" to="/chat">
                    Chat
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" onClick={() => logoutUser()} to="/login">
                    Logout
                  </Link>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/register">
                  Registerd
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Login
                </Link>
              </li>
            </ul>
          </div>
        )}

        <button>  <h4>{userData && userData.response && `${userData.response.firstName} ${userData.response.lastName}`}</h4> </button>
      </nav>
    </div>
  );
};

export default Navbar;
