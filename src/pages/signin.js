
import { Button, Checkbox, Form, Input } from 'antd';
import {
    MDBContainer,
    MDBNavbar,
    MDBNavbarBrand,

} from "mdb-react-ui-kit";

const onFinish = (values) => {
    console.log('Success:', values);
    localStorage.setItem("agentId",values.username);
    window.location.href = "/agent";
};
const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
};
export  default function Signin() {
    return (
        <div>
            <MDBContainer fluid>
                <header>
                    <MDBNavbar  expand='lg' light bgColor='light'>
                        <MDBContainer fluid>
                            <MDBNavbarBrand href='#'>Branch International</MDBNavbarBrand>
                        </MDBContainer>
                    </MDBNavbar>

                    <div className='text-center' style={{
                        padding:"2%"
                    }}>
                        {/*<h2 className='mb-3'>Welcome Back!</h2>*/}
                    </div>
                </header>

            <div style={{textAlign:"center",margin:"auto", width: "50%", paddingTop: "5%"}}>
                <h1>Agent Login</h1>
                <br/>
                <br/>
                <Form
                    name="basic"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    style={{
                        maxWidth: 600,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your userid!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>


                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>

            </div>

            </MDBContainer>
        </div>
    )
}
