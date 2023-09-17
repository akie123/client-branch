
import React from "react"
import io from 'socket.io-client';
import axios from 'axios';

const socket = io.connect('http://localhost:5000');
import { useState, useEffect } from 'react';

import {
    MDBNavbar,
    MDBNavbarNav,
    MDBNavbarItem,
    MDBContainer,
    MDBNavbarLink,
    MDBNavbarBrand,
    MDBIcon,
    MDBInput,MDBBtn
} from 'mdb-react-ui-kit';
import { Table } from 'antd';
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



const data = [{
    id: "1",
    message: `Edward ${1}`,
    priority: "High",
},{
    id: "1",
    message: `Edward ${1}`,
    priority: "High",
}]
const Client = () => {
   
    const [message,setmessage] = useState([]);
    useEffect(() =>{

        axios.get('http://localhost:5000/getMessages/1').then((res) => {
            console.log(res.data.messages);
            setmessage(res.data.messages);
        }).catch((err) => { 
            console.error('Error fetching messages:', err);
        })
        socket.emit('agentOnline', 1);
        socket.on('messageAssigned', (msg) => {
            setmessage([...message,msg]);
        })
       
    },[])
    return (
        <div >
            <MDBContainer fluid>
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
                    {/*<h2 className='mb-3'>Welcome Back!</h2>*/}
                </div>
            </header>
            <div style={{padding:"0 5% 0 5%"}}>
                <div style={{width :"50%"}}>
                    <MDBInput label='Search' id='typeText' type='text' />
                </div>

                <Table
                    columns={columns}
                    dataSource={message}
                    style={{paddingTop:"25px"}}
                />

            </div>

            </MDBContainer>

        </div>
    )
}

export default Client