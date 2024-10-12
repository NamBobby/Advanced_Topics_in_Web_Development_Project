import React from 'react';
import { Button, Form, Input, notification } from 'antd';
import { createUserApi, LoginApi } from '../util/api';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {

    const navigate = useNavigate();
    const onFinish = async (values) => {
        const {name, email, password} = values;

        const res = await LoginApi(email, password); 

        if(res && res.EC === 0){
            localStorage.setItem("access_token", res.access_token)
            notification.success({
                message: "LOGIN USER",
                description: "Success"
            });
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
        <div style={{margin: 50}}>
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
                onFinish={onFinish}
                autoComplete="off"
                layout = 'vertical'
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

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Login
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default LoginPage;