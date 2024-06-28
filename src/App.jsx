import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Chatbox from "./Component/Chatbox/Chatbox";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Component/Navbar";
import Login from "./Component/Auth/Login";
import Registerd from "./Component/Auth/Registerd";
import Home from "./Component/Home";
import { userlocalStorageData } from "./Component/helper/localStorage";

function App() {
  // Define a custom function to check if the user is authenticated
  const isAuthenticated = () => {
    const userData = userlocalStorageData();
    return userData && userData.token;
  };

  // Create a custom ProtectedRoute component
  const ProtectedRoute = ({ element, ...props }) => {
    return isAuthenticated() ? (
      element
    ) : (
      <Navigate to="/login" replace state={{ from: props.location }} />
    );
  };

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Registerd />}></Route>

        <Route path="/" element={<ProtectedRoute element={<Home />} />} />
        <Route path="/chat" element={<ProtectedRoute element={<Chatbox />} />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <ToastContainer />
    </>
  );
}

export default App;
