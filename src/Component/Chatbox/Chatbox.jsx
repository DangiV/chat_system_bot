import React, { useEffect, useState } from 'react'
import './Chatbox.css'
import { userlocalStorageData } from '../helper/localStorage';
import { Tabs, Tab, Typography, Box } from '@mui/material';
import UserRequest from './UserRequest';
import io from "socket.io-client";
import { makeApi } from '../helper/MakeApi';
const ENDPOINT = "http://192.168.0.202:8000";
var socket;

const Chatbox = () => {
  const UserId = userlocalStorageData()
  const [sendMessage, setSendMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [friendList, setFriendList] = useState([])
  const [socketConnected, setSocketConnected] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userId, setUserId] = useState('')
  const [userChatId, setUserChatId] = useState('')
  const [value, setValue] = useState(0);

  console.log("UserId", UserId.response.id)
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  //function to set selected user
  const handleSelectedUser = (user) => {
    setSelectedUser(user)
    setUserChatId(user.chatId)
    setUserId(user.data[0].id)
  }

  //function to send message at onclick
  const handleSendMessage = async (e) => {
    e.preventDefault();
    console.log("sendMessage", sendMessage);
    try {
      const data = { content: sendMessage, userId: userId, chatId: userChatId }
      socket.emit("send_message", data);
      setSendMessage('')
      setMessages(prevMessages => [...prevMessages, data]);
    } catch (error) {
      console.log(error)
    }
  }

  //function to get friend list 
  const ListData = async () => {
    try {
      const response = await makeApi('get', '/myFriendList')
      // console.log('response', response)
      setFriendList(response.response)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    ListData();
  }, []);

  //socket logic start here
  useEffect(() => {
    if (selectedUser) {
      socket = io(ENDPOINT);
      socket.emit("setup", { userId: userId, chatId: userChatId });
      socket.on("Connected", () => setSocketConnected(true));

      socket.on("recieve_old_message", (dataa) => {
        console.log("these data is hit ")
        console.log("old data", dataa)
      });

      socket.on('recieve_message', (data) => {
        console.log("recieve_chat", data);
        // setMessages([...messages, data]);
        setMessages(prevMessages => [...prevMessages, data]);
      });

      socket.on('old_message', (data) => {
        console.log("recieve_chat", data);
        setMessages([...messages, data]);
      });

    }
  }, [selectedUser]);


  return (
    <>
      <div className="container-fluid main-chatbox">
        <div className="row">

          <div className="col-lg-3 col-md-3 col-sm-3  col-12 chatleftbox border p-0 pt-3" >
            <Box sx={{ width: '100%' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }} className="d-flex justify-content-center">
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                  <Tab label="Friend List" />
                  <Tab label="User Request" />
                </Tabs>
              </Box>
              <div role="tabpanel" hidden={value !== 0}>
                <Typography>Friends List </Typography>
                <div className='listchats'>
                  {friendList.map((item, index) => (
                    <div className='listchats-under' key={index} onClick={() => handleSelectedUser(item)}>
                      <div className='listchatsudr-data'>
                        <div className="" data-bs-toggle="tooltip" data-bs-placement="right" title="Tooltip on top">
                          <img src="https://img.freepik.com/premium-vector/brunette-man-avatar-portrait-young-guy-vector-illustration-face_217290-1549.jpg?w=740" alt="not found" />
                        </div>
                        <div>
                          <h1 className='chlstname'>{item.data && item.data.length > 0 && `${item.data[0].firstName} ${item.data[0].lastName}`}   </h1>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div role="tabpanel" hidden={value !== 1}>
                <UserRequest />
              </div>
            </Box>
          </div>

          <div className="col-lg-9 col-md-9 col-sm-9 col-12 pt-2 pb-3 h-100 chatrightbox border">
            {selectedUser ? (<div className="row">
              <div className="col-12 border-bottom pb-3 pt-2">
                <div className="d-flex justify-content-between flex-wrap">
                  <div className="d-flex justify-content-start flex-wrap gap-2">
                    <div>
                      <img src="https://img.freepik.com/premium-vector/brunette-man-avatar-portrait-young-guy-vector-illustration-face_217290-1549.jpg?w=740" alt="not found" />
                    </div>
                    <div>
                      <h1 className='m-0 mt-2 ms-0 fw-bold' style={{ fontSize: "14px" }}>{selectedUser && selectedUser.data[0] && `${selectedUser.data[0].firstName} ${selectedUser.data[0].lastName}`}</h1>
                      <p className='m-0 ms-0 text-success' style={{ fontSize: "14px" }}>Last seen 2 min ago</p>
                    </div>
                  </div>
                  <div className="d-flex justify-content-end align-items-center gap-4">
                    <i className="fa-solid fa-circle-plus"></i>
                    <i className="fa-solid fa-video"></i>
                    <i className="fa-solid fa-expand me-3"></i>
                  </div>
                </div>
              </div>

              <div className="col-12 mt-3 p-0">

                <div className="message-container">
                  {Array.isArray(messages) ? (
                    messages
                      .filter(message => message.chatId === userChatId)
                      .map((message, index) => (
                        <div key={index} className={`message ${message.userId === UserId.response.id ? 'received-message' : 'sent-message'} `}>
                          {message.content}
                        </div>
                      ))
                  ) : (
                    <div>No messages are available </div>
                  )}
                </div>

                <div className="col-12 border-top m-0">
                  <form onSubmit={handleSendMessage}>
                    <div className='sendmessage border-0 mt-3 d-flex align-items-center justify-content-between  '>
                      <div className='d-flex gap-2 ms-3'>
                        <div className="pulsicon">
                          <i className="fa-solid fa-plus"></i>
                        </div>
                        <input type="text" placeholder='Type a message here' className='' value={sendMessage} onChange={(e) => setSendMessage(e.target.value)} />
                      </div>

                      <div className='d-flex gap-3 align-items-center me-3'>
                        <i className="fa-regular fa-face-smile"></i>
                        <div className="pulsicon">
                          <button type='submit' className='submitBtn'><i className="fa-solid fa-paper-plane"></i></button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>) : (<h1>Plz select User to chat</h1>)}

          </div>
        </div>
      </div>
    </>
  )
}

export default Chatbox  