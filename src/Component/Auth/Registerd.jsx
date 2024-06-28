import React, { useState } from 'react'
import '../../assets/Css/Registerd.css'
import { Link } from 'react-router-dom'
import { makeApi } from '../helper/MakeApi';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const Registerd = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  })
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((oldVal) => ({
      ...oldVal,
      [name]: value
    }))
  }
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const userRegister = await makeApi('post', '/register', userData)
      toast.success('registered successfully')
      console.log("userRegister", userRegister);
      navigate('/login')
    } catch (error) {
      console.log(error);
      toast.error(error.response);
    }
  }
  return (
    <>
      <div className='registerd'>
        <div className="registerdunder">
          <form onSubmit={onSubmit}>
            <div className="registerd-container">
              <h4 className='text-center text-white mt-3'>Registraion</h4>
              <div className="registerd-under">
                <i className="fa-solid fa-user"></i>
              </div>
              <div className="row">
                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                  <div className='Rinputdata mb-4'>
                    <i className="fa-solid fa-user"></i>
                    <input
                      type="text"
                      className='text-white'
                      placeholder='First Name'
                      name='firstName'
                      id='firstName'
                      value={userData.firstName}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                  <div className='Rinputdata mb-4'>
                    <i className="fa-solid fa-user"></i>
                    <input type="text"
                      className='text-white'
                      placeholder='Last Name'
                      name='lastName'
                      id='lastName'
                      value={userData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                  <div className='Rinputdata mb-4'>
                    <i className="fa-solid fa-envelope"></i>
                    <input
                      type="text"
                      className='text-white'
                      placeholder='Email ID'
                      name='email'
                      id='email'
                      value={userData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                  <div className='Rinputdata mb-4'>
                    <i className="fa-solid fa-lock"></i>
                    <input
                      type="password"
                      className='text-white'
                      placeholder='Password'
                      name='password'
                      id='password'
                      value={userData.password}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className='d-flex justify-content-center mt-2 mb-3'>
                  <button className='registertbtn' type='submit'>Registerd</button>
                </div>
              </div>

              <div className="Rinputtext ">
                <p className='text-white text-center'>Alreay your account exists?<Link to="/login">Login</Link></p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default Registerd