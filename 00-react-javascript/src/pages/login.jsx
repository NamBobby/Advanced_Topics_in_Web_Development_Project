
import React, { useContext } from 'react';
import { Button, Col, Divider, Form, Input, notification, Row } from 'antd';
import { LoginApi } from '../util/api';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/layout/context/auth.context';
import { ArrowLeftOutlined } from '@ant-design/icons';

const LoginPage = () => {

    const navigate = useNavigate();
    const {setAuth} = useContext(AuthContext);

    const onFinish = async (values) => {
        const {name, email, password} = values;

        const res = await LoginApi(email, password); 

        if(res && res.EC === 0){
            localStorage.setItem("access_token", res.access_token)
            notification.success({
                message: "LOGIN USER",
                description: "Success"
            });

            setAuth({
                isAuthenticated: true,
                user: {
                email: res?.user?.email ?? "",
                name: res?.user?.name ?? ""
                }
            })
            navigate("/");
        }else {
            notification.error({
                message: "LOGIN USER",
                description: res?.EM ?? "error"
            })
        }


        console.log('>> Success:', res);
      };

    return (
        <Row justify={"center"} style={{ marginTop: "30px" }}>
            <Col xs={24} md={16} lg={8}>
                <fieldset style={{
                    padding: "15px",
                    margin: "5px",
                    border: "1px solid #ccc",
                    borderRadius: "5px"
                }}>
                    <legend>Login</legend>
                    <Form
                        name="basic"
                        onFinish={onFinish}
                        autoComplete="off"
                        layout='vertical'
                    >
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your email!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                {
                                required: true,
                                message: 'Please input your password!',
                                },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                        >
                            <Button type="primary" htmlType="submit">
                                Login
                            </Button>
                        </Form.Item>
                    </Form>
                    <Link to={"/"}><ArrowLeftOutlined /> Back to HomePage</Link>
                    <Divider />
                    <div style={{ textAlign: "center" }}>
                        Not have an account? <Link to={"/register"}>Register here</Link>
                    </div>
                </fieldset>
            </Col>
        </Row>
    )
}

export default LoginPage;