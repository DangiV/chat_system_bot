import { Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { makeApi } from '../helper/MakeApi'

const FriendsList = ({ handleUserSelect }) => {

    const [friendList, setFriendList] = useState([])

    const handleUserClick = (item) => {
        // console.log('user selected to chat', item);
        handleUserSelect(item)
    }

    //user friend list 
    const ListData = async () => {
        try {
            const response = await makeApi('get', '/myFriendList')
            // console.log('Your friend  list', response.response);
            setFriendList(response.response)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        ListData();
    }, []);

    return (
        <>
            <Typography>Friends List </Typography>
            <div className='listchats'>
                {
                    friendList.map((item) => (
                        <div className='listchats-under' key={item.id} onClick={() => handleUserClick(item)}>
                            <div className='listchatsudr-data'>
                                <div className="" data-bs-toggle="tooltip" data-bs-placement="right" title="Tooltip on top">
                                    <img src="https://img.freepik.com/premium-vector/brunette-man-avatar-portrait-young-guy-vector-illustration-face_217290-1549.jpg?w=740" alt="not found" />
                                </div>
                                <div>
                                    <div className='d-flex gap-1'>
                                        <h1 className='chlstname'>{item.firstName + " " + item.lastName} </h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </>
    )
}

export default FriendsList