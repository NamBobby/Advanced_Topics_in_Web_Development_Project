import React, { useContext } from 'react';
import { Button, Col, Divider, Form, Input, notification, Row } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, ArrowLeftOutlined } from '@ant-design/icons';
import { LoginApi } from '../services/apiService';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/auth.context';

const LoginPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);

  const onFinish = async (values) => {
    console.log('Form submitted:', values);
    const { email, password } = values;

    const res = await LoginApi(email, password);

    if (res && res.EC === 0) {
      localStorage.setItem('access_token', res.access_token);
      notification.success({
        message: 'LOGIN USER',
        description: 'Success',
      });

      setAuth({
        isAuthenticated: true,
        user: {
          email: res?.user?.email ?? '',
          name: res?.user?.name ?? '',
        },
      });
      navigate('/');
    } else {
      notification.error({
        message: 'LOGIN USER',
        description: res?.EM ?? 'error',
      });
    }

    console.log('>> Success:', res);
  };

  return (
    <Row justify={'center'} style={{ marginTop: '30px', fontFamily: 'Arial, sans-serif' }}>
      <Col xs={24} md={16} lg={8}>
        <fieldset
          style={{
            padding: '15px',
            margin: '5px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            color: 'white',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          <legend style={{ color: 'white', fontFamily: 'Arial, sans-serif' }}>Login</legend>
          <Form
            name="basic"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            style={{ fontFamily: 'Arial, sans-serif' }}
          >
            <Form.Item
              label={<span style={{ color: 'white', fontFamily: 'Arial, sans-serif' }}>Email</span>}
              name="email"
              required={false}
              rules={[
                {
                  required: true,
                  message: 'Please input your email!',
                },
              ]}
            >
              <Input style={{ backgroundColor: 'black', border: '1px solid grey', color: 'white' }} />
            </Form.Item>
            <Form.Item
              label={<span style={{ color: 'white', fontFamily: 'Arial, sans-serif' }}>Password</span>}
              name="password"
              required={false}
              rules={[
                {
                  required: true,
                  message: 'Please input your password!',
                },
              ]}
            >
              <Input.Password
                style={{ backgroundColor: 'black', border: '1px solid grey', color: 'white' }}
                iconRender={(visible) =>
                  visible ? <EyeTwoTone twoToneColor="#ffffff" /> : <EyeInvisibleOutlined style={{ color: 'white' }} />
                }
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  width: '100%', // Makes the button width match the text fields
                  borderRadius: '5px',
                  backgroundColor: 'white',
                  color: 'black',
                  border: '1px solid black', // Adds a black border for consistency
                }}
              >
                Login
              </Button>
            </Form.Item>
          </Form>
          <Link to={'/'} style={{ color: 'white', fontFamily: 'Arial, sans-serif' }}>
            <ArrowLeftOutlined /> Back to Homepage
          </Link>
          <Divider style={{ borderColor: 'white' }} />
          <div style={{ textAlign: 'center', color: 'white', fontFamily: 'Arial, sans-serif' }}>
            Not have an account? <Link to={'/register'} style={{ color: 'white', fontFamily: 'Arial, sans-serif' }}>Register here</Link>
          </div>
        </fieldset>
      </Col>
    </Row>
  );
};

export default LoginPage;
