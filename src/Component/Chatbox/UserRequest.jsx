import { Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { makeApi } from '../helper/MakeApi';
import { toast } from 'react-toastify';

const UserRequest = () => {
    const [requestList, setRequestList] = useState([])

    const AcceptRequest = async (chatId) => {
        try {
            const data = {
                chat_id: chatId,
                request_type: "accepted"
            }
            const response = await makeApi('put', "/updateRequestType", data)
            console.log("response", response);
            ListOfRequest();
            toast.success("user request accepted")
        } catch (error) {
            console.log(error)
        }
    }

    const RejectRequest = async (chatId) => {
        console.log('user request rejected');
        try {
            const data = {
                chat_id: chatId,
                request_type: "rejected"
            }
            const response = await makeApi('put', "/updateRequestType", data)
            console.log("response", response);
            toast.error("user request rejected")
            ListOfRequest();
        } catch (error) {
            console.log(error)
        }
    }

    const ListOfRequest = async () => {
        try {
            const response = await makeApi('get', '/requestedList')
            // console.log('get request list', response.response);
            setRequestList(response.response)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        ListOfRequest();
    }, []);

    return (
        <>
            <Typography>User Request </Typography>
            <div className='listchats'>
                {
                    requestList.map((item,index) => (
                        <div className='listchats-under' key={index} >
                            {/* {console.log("item of friend list", item)} */}
                            <div className='listchatsudr-data'>
                                <div className="" data-bs-toggle="tooltip" data-bs-placement="right" title="Tooltip on top">
                                    <img src='https://img.freepik.com/premium-vector/brunette-man-avatar-portrait-young-guy-vector-illustration-face_217290-1549.jpg?w=740' alt="" data-toggle="tooltip" data-placement="top" title="Tooltip on top" />
                                </div>
                                <div>
                                    <div className='d-flex gap-1'>
                                        <h1 className='chlstname'>{item.data[0].firstName + " " + item.data[0].lastName} </h1>
                                    </div>
                                </div>
                            </div>
                            <div className='d-flex gap-3 justify-content-center'>
                                <button className='btn btn-success btn-sm pt-0 pb-0 h-50' onClick={() => AcceptRequest(item.chatId)}>Accept</button>
                                <button className='btn btn-warning btn-sm pt-0 pb-0 h-50' onClick={() => RejectRequest(item.chatId)}>Reject</button>
                            </div>
                        </div>
                    ))
                }
            </div>
        </>
    )
}

export default UserRequest