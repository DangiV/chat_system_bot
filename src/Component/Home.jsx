import React, { useEffect, useState } from 'react'
import '../assets/Css/Home.css'
import { makeApi } from './helper/MakeApi'
import { userlocalStorageData } from './helper/localStorage'
import { toast } from 'react-toastify';

const Home = () => {
  const [userList, setUserList] = useState([]);
  const [friendList, setFriendList] = useState([]);
  const [requestList, setRequestList] = useState([]);
  const userDetailsLocalStorage = userlocalStorageData();

  const getAllUserList = async () => {
    try {
      const userDetails = await makeApi("get", "/getAllUserDetails")
      // console.log("user details", userDetails)
      setUserList(userDetails.response)

      const response = await makeApi('get', '/requestedList')
      setRequestList(response.response)

      const dataa = await makeApi('get', '/myFriendList')
      setFriendList(dataa.response);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getAllUserList()
  }, [])

  const isFriend = (userId) => {
    return friendList.some(friend => friend.id === userId);
  };


  const isRequestSent = (userId) => {
    return requestList.some(request => request.reciever_id === userId);
  };

  const sendRequest = async (id) => {
    try {
      const user = [userDetailsLocalStorage.response.id, id]
      const response = await makeApi('post', '/requestMessage', { user: user, sender_id: userDetailsLocalStorage.response.id, reciever_id: id });
      toast.success("request send successfully")
      console.log("response of send request", response)
    } catch (error) {
      console.log(error)
    }

  }
  return (
    <>
      <div className="container">
        <h2 className='text-center mt-5'>Welcome to User List</h2>
        <div className="card p-5 mt-5 shadow-lg border-0 chartboardlist">
          <div className="row ">
            <div className="col-lg-12 col-12  ">
              {userList.map((item) => (
                <div className="card  list-user p-3 mb-3 bg-light" key={item.id}>
                  <div className='d-flex justify-content-between'>
                    <div>
                      <h4>{item.firstName}</h4>
                    </div>
                    <div className='d-flex gap-5'>


                    {isFriend(item.id) ? (
                      <button className='btn btn-info'>Friend</button>
                    
                      ) : isRequestSent(item.id) ? (
                        <button className='btn btn-warning'>Request Sent</button>
                      ) : (
                        <button className='btn btn-success' onClick={() => sendRequest(item.id)}>Send</button>
                      )}

                      {/* <button className='btn btn-danger'>Cancel</button> */}
                      {/* <button className='btn btn-success' onClick={() => sendRequest(item.id)}>Send</button> */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
