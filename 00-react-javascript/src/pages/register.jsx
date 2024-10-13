import React from 'react';
import { Button, Col, Divider, Form, Input, notification, Radio, Row, Select } from 'antd';
import { createUserApi } from '../util/api';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';

const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  
const days = Array.from({length: 31}, (_, i) => i + 1);

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
        <Row justify={"center"} style={{ marginTop: "30px" }}>
            <Col xs={24} md={16} lg={8}>
                <fieldset style={{
                    padding: "15px",
                    margin: "5px",
                    border: "1px solid #ccc",
                    borderRadius: "5px"
                }}>
                    <legend>Register Account</legend>
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
                            label="Username"
                            name="name"
                            rules={[
                                {
                                required: true,
                                message: 'Please input your username!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Date of Birth"
                            name="dateOfBirth"
                            rules={[
                                {
                                required: true,
                                message: 'Please select your date of birth!',
                                },
                            ]}
                        >
                            <Row>
                                <Col span={8}>
                                    <Select>
                                        {months.map((month, index) => (
                                            <Select.Option key={index} value={month}>{month}</Select.Option>
                                        ))}
                                    </Select>
                                </Col>
                                <Col span={8}>
                                    <Select>
                                        {days.map((day, index) => (
                                            <Select.Option key={index} value={day}>{day}</Select.Option>
                                        ))}
                                    </Select>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        name="year"
                                        rules={[
                                        {
                                            required: true,
                                            message: 'Please input your year of birth!',
                                        },
                                        {
                                            validator: (_, value) => {
                                            if (value < 1900 || value > 2024) {
                                                return Promise.reject('Year must be between 1900 and 2024');
                                            }
                                            return Promise.resolve();
                                            },
                                        },
                                        ]}
                                    >
                                        <Input type="number" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form.Item>
                        <Form.Item
                            label="Gender"
                            name="gender"
                            rules={[
                                {
                                required: true,
                                message: 'Please select your gender!',
                                },
                            ]}
                        >
                            <Radio.Group>
                                <Radio value="Man">Man</Radio>
                                <Radio value="Woman">Woman</Radio>
                                <Radio value="Non-Binary">Non-Binary</Radio>
                                <Radio value="Something else">Something else</Radio>
                                <Radio value="Prefer not to say">Prefer not to say</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item
                        >
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                    <Link to={"/"}><ArrowLeftOutlined /> Back to Homepage</Link>
                    <Divider />
                    <div style={{ textAlign: "center" }}>
                        Already have account? <Link to={"/login"}>Login</Link>
                    </div>

                </fieldset>
            </Col>
        </Row>
    )
}

export default RegisterPage