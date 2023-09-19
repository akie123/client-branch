
import React from "react"
import io from 'socket.io-client';
import axios from 'axios';
import { useState, useEffect } from 'react';

import {
    MDBNavbar,
    MDBNavbarNav,
    MDBNavbarItem,
    MDBContainer,
    MDBNavbarLink,
    MDBNavbarBrand,
    MDBIcon,
    MDBInput,MDBBtn,MDBSpinner
} from 'mdb-react-ui-kit';
import { Table } from 'antd';

const socket = io.connect('http://localhost:5000');
const columns = [
    {
        title: 'Id',
        width: 100,
        dataIndex: 'senderId',
        key: 'senderId',
    },
    {
        title: 'Message',
        width: 200,
        dataIndex: 'message',
        key: 'message',

    },
    {
        title: 'Priority',
        dataIndex: 'priority',
        key: 'priority',
        width: 100,
    },
    {
        title: 'Action',
        key: 'operation',
        fixed: 'right',
        width: 100,
        render: () =>  <><MDBBtn color='link' rounded size='sm'>
            View Message
        </MDBBtn><MDBBtn color='link' rounded size='sm'>
            Send/FullFill Response
        </MDBBtn></>,
    },
];

const Client = () => {
    const [agentId,setagentId] = useState(localStorage.getItem("agentId"));
    const [message,setmessage] = useState([]);
    const [originalMessages, setOriginalMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() =>{

        axios.get(`http://localhost:5000/getMessages/${agentId}`).then((res) => {
            setmessage(res.data.messages);
            setOriginalMessages(res.data.messages);
            setLoading(false);
        }).catch((err) => { 
            console.error('Error fetching messages:', err);
        })
        socket.emit('agentOnline', agentId);
        socket.on('messageAssigned', (msg) => {
            setmessage((prevMessages) => [...prevMessages, msg]);
            setOriginalMessages((prevMessages) => [...prevMessages, msg]);
        })
       
    },[])
    const handleSearch = (value) => {
        const searchText = value.toLowerCase();
        const filteredMessages = originalMessages.filter((msg) => {
            const idMatch = msg.senderId.toLowerCase().includes(searchText);
            const messageMatch = msg.message.toLowerCase().includes(searchText);
            return idMatch || messageMatch;
        });
        setmessage(filteredMessages);
    };
    return (
        <div >
            <MDBContainer fluid>
                {loading ? ( // Conditionally render the loader spinner
                    <div className='text-center' style={{ paddingTop: "25px" }}>
                        <MDBSpinner grow color='primary' />
                    </div>
                ) : (
                    <>
            <header>
                <MDBNavbar  expand='lg' light bgColor='light'>
                    <MDBContainer fluid>
                        <MDBNavbarBrand href='#'>Branch International</MDBNavbarBrand>
                        <MDBNavbarNav right fullWidth={false} className='mb-2 mb-lg-0'>
                            <MDBNavbarItem right className='me-3 me-lg-0'>
                                <MDBNavbarLink href='#'>
                                    <MDBIcon fas icon="sign-out-alt" />
                                </MDBNavbarLink>
                            </MDBNavbarItem>

                        </MDBNavbarNav>
                    </MDBContainer>
                </MDBNavbar>

                <div className='text-center' style={{
                    padding:"2%"
                }}>

                </div>
            </header>
            <div style={{padding:"0 5% 0 5%"}}>
                <div style={{width :"50%"}}>
                    <MDBInput label='Search' id='typeText' type='text' onChange={(e) => handleSearch(e.target.value)}/>
                </div>
                    <Table
                        columns={columns}
                        dataSource={[...message]}
                        style={{ paddingTop: "25px" }}
                    />
            </div>
                    </>
                    )}
            </MDBContainer>

        </div>
    )
}

export default Client