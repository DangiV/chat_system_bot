import React, { useEffect, useState } from 'react';
import '../../assets/Css/Login.css';
import { Link } from 'react-router-dom';
import { makeApi } from '../helper/MakeApi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Icons from '@mui/icons-material';
const { Clear: ClearIcon, Chat: ChatIcon, Send: SendIcon } = Icons;
import { io } from 'socket.io-client';

const Login = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: '',
    password: '',
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((oldVal) => ({
      ...oldVal,
      [name]: value,
    }));
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const userlogin = await makeApi('post', '/login', userData);
      toast.success('login successfully');
      localStorage.setItem('userDetails', JSON.stringify(userlogin));
      navigate('/');
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.msg);
    }
  };

  const [open, setOpen] = useState(false);
  const [message, setmessage] = useState('');
  const [allMessages, setAllMessages] = useState([]);
  const [messageId, setMessageId] = useState('');
  const [guestSocketId, setGuestSocketId] = useState('');
  const [socket, setSocket] = useState(null);

  const handleToggle = () => {
    setOpen(!open);
    if (!socket && !open) {
      const newSocket = io('http://192.168.0.202:8000');
      newSocket.on('connect', () => {
        console.log('socket id', newSocket.id);
        setGuestSocketId(newSocket.id);
      });
      setSocket(newSocket);
    } else if (socket && open) {
      socket.disconnect();
      setSocket(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() === '') return;
    const messageData = {
      value: message,
      guestSocketId: guestSocketId,
      id: messageId,
    };

    socket.emit('user-message', messageData);
    setAllMessages([...allMessages, { textMessage: message, type: 'outgoing' }]);
    setmessage('');
  };

  useEffect(() => {
    if (socket) {
      socket.on('chat message', (data) => {
        const parseData = JSON.parse(data);
        console.log('Welcome message from backend', parseData);
        setAllMessages((data) => [...data, parseData]);
      });

      socket.on('botMessage', (botMessage) => {
        const parseMessage = JSON.parse(botMessage);
        console.log('after sending message', parseMessage);
        setAllMessages((data) => [...data, parseMessage]);
        setMessageId(parseMessage.id);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [socket]);

  return (
    <>
      <div className="login">
        <div className="loginunder">
          <form onSubmit={onSubmit}>
            <div className="login-container shadow-lg">
              <h4 className="text-center text-white mt-3">Login</h4>
              <div className="login-under">
                <i className="fa-solid fa-user"></i>
              </div>
              <div className="inputdata mb-4">
                <i className="fa-solid fa-envelope"></i>
                <input
                  type="text"
                  className="text-white"
                  placeholder="Email ID"
                  id="email"
                  name="email"
                  onChange={handleChange}
                  value={userData.email}
                />
              </div>
              <div className="inputdata mb-4">
                <i className="fa-solid fa-eye"></i>
                <input
                  type="text"
                  className="text-white"
                  placeholder="Password"
                  id="password"
                  name="password"
                  onChange={handleChange}
                  value={userData.password}
                />
              </div>
              <div className="d-flex justify-content-between flex-wrap inputtext">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" defaultValue="" id="defaultCheck1" />
                  <label className="form-check-label text-white" htmlFor="defaultCheck1">
                    Remember me
                  </label>
                </div>
                <a href="" className="text-white text-decoration-none">
                  Forgot password
                </a>
              </div>
              <div className="d-flex justify-content-center mt-4">
                <button className="Sumbitbtn" type="submit">
                  Login
                </button>
              </div>
              <div className="inputtext mt-3">
                <p className="text-white text-center">
                  Don't have an account yet?<Link to="/register">Registered</Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="RobotParent">
        {!open && <ChatIcon onClick={handleToggle} className="RobotIcon text-white mb-3" />}
        {open && (
          <div className="chat_box">
            <div className="head">
              <div className="user">
                <div className="avatar">
                  <img src="https://picsum.photos/g/40/40" alt="avatar" />
                </div>
                <div className="name fw-bold ms-2">Helper-Bot</div>
              </div>

              <div>
                <ClearIcon onClick={handleToggle} />
              </div>
            </div>

            <div className="body">
              {allMessages.map((item, index) => (
                <div className={`message ${item.sender}`} key={index}>
                  <div className="bubble">
                    {console.log('=====all Messages=====', item)}
                    <p>{item && item.textMessage}</p>
                  </div>
                </div>
              ))}
            </div>  

            <div className="foot">
              <form onSubmit={handleSubmit}>
                <input type="text" className="msg" placeholder="Type a message..." value={message} onChange={(e) => setmessage(e.target.value)} />
                <button type="submit">
                  <SendIcon />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default Login;
