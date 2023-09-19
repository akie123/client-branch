
import React from "react"
import io from 'socket.io-client';
import axios from 'axios';
import Swal from 'sweetalert2'
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
import {Table, Modal, Button, Form, Input ,Tag} from 'antd';
const { TextArea } = Input;


const Client = () => {
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
            render:(text, record) => <>
                {record.priority === '3' ? <Tag color="success">Low</Tag> : record.priority === '2' ? <Tag color="warning">Medium</Tag> : <Tag color="error">High</Tag>}
            </>
        },
        {
            title: 'Action',
            key: 'operation',
            fixed: 'right',
            width: 100,
            render: (text, record) =>  <><MDBBtn color='link' rounded size='sm' onClick={()=>{
                showModal1(record);}
            }>
                View Message/Query
            </MDBBtn><MDBBtn color='link' rounded size='sm' onClick={()=>{
                showModal2(record);}
            }>
                Send/FullFill Response
            </MDBBtn></>,
        },
    ];

    const [agentId,setagentId] = useState(localStorage.getItem("agentId"));
    const [message,setmessage] = useState([]);
    const [originalMessages, setOriginalMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen1, setIsModalOpen1] = useState(false);
    const [isModalOpen2, setIsModalOpen2] = useState(false);
    const [msg, setMsg] = useState('');
    const [response, setResponse] = useState('');
    const [msgId,setMsgId] = useState('');


    const showModal1 = (msg) => {
        console.log(msg);
        setMsg(msg.message)
        setIsModalOpen1(true);
    };


    const handleCancel1 = () => {
        setIsModalOpen1(false);
        setIsModalOpen2(false);
    };


    const showModal2 = (msg) => {
        setMsgId(msg._id)
        setIsModalOpen2(true);
    };

    // Function to send response to the server
    const sendResponse = () => {
        if (msgId && response) {

            axios.post('http://localhost:5000/response', {
                messageId: msgId,
                response: response,
            })
                .then((response) => {
                    console.log('Response sent successfully', response);
                    handleDelete(msgId);
                    Swal.fire({
                        title: 'Success!',
                        icon: 'success',
                        confirmButtonText: 'Okay'
                    })
                })
                .catch((error) => {
                    console.error('Error sending response', error);
                    Swal.fire({
                        title: 'Failed!',
                        icon: 'error',
                        confirmButtonText: 'Okay'
                    })
                });
            setResponse('');
            setMsgId('');
            setIsModalOpen2(false);
        }
    };

    const handleDelete = (messageId) => {
        // Filter out the deleted message from both message and originalMessages states
        const updatedMessages = message.filter((msg) => msg._id!== messageId);
        const updatedOriginalMessages = originalMessages.filter((msg) => msg._id !== messageId);

        setmessage(updatedMessages);
        setOriginalMessages(updatedOriginalMessages);
    };


    useEffect(() =>{
        const socket = io.connect('http://localhost:5000');
        axios.get(`http://localhost:5000/getMessages/${agentId}`).then((res) => {
            setmessage(res.data.messages);
            setOriginalMessages(res.data.messages);
            setLoading(false);
        }).catch((err) => { 
            console.error('Error fetching messages:', err);
        })
        socket.emit('agentOnline', agentId);
        socket.on('messageAssigned', (msg) => {
            if(message.find((message) => message._id === msg._id)) return;
            setmessage((prevMessages) => [...prevMessages, msg]);
            setOriginalMessages((prevMessages) => [...prevMessages, msg]);
        })
        return () => {
            socket.disconnect()
        };

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
            <Modal title="Message/Query" open={isModalOpen1}  okButtonProps={{hidden:true}} cancelButtonProps={{hidden:true}}   onCancel={handleCancel1} width={1000} bodyStyle={{height:"250px"}}>
                <p style={{paddingTop:"10px"}}>{msg}</p>
            </Modal>
            <Modal title="Message/Query" open={isModalOpen2}  okButtonProps={{hidden:true}} cancelButtonProps={{hidden:true}}   onCancel={handleCancel1} width={700} bodyStyle={{height:"250px"}}>
               <br/>
                <Form
                    name="basic"

                    style={{
                        maxWidth: 600,
                    }}
                    initialValues={{
                        remember: true,
                    }}

                    autoComplete="off"
                >
                    <Form.Item>
                        <TextArea rows={5} value={response} onChange={(e) => setResponse(e.target.value)} />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" onClick={sendResponse}>
                            Send
                        </Button>
                    </Form.Item>
                </Form>

            </Modal>
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
                                <MDBNavbarLink href='/'>
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