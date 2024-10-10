import React from 'react';
import { Button, Form, Input, notification } from 'antd';
import { createUserApi } from '../util/api';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {

    const navigate = useNavigate();
    const onFinish = async (values) => {
        const {name, email, password} = values;

        const res = await createUserApi(name, email, password); 

        if(res){
            notification.success({
                message: "CREATE USER",
                description: "Success"
            });
            navigate("/login");
        }else {
            notification.error({
                message: "CREATE USER",
                description: "error"
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

                <Form.Item
                    label="Name"
                    name="name"
                    rules={[
                        {
                        required: true,
                        message: 'Please input your name!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default RegisterPage