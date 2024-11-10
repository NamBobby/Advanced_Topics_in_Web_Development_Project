import React from 'react';
import { Button, Col, Divider, Form, Input, notification, Row, Upload } from 'antd';
import { UploadApi } from '../services/apiService'; 
import { Link } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';

const UploadMusicPage = () => {
    const onFinish = async (values) => {
        try {
            const { title, artist, genre, album, publishedYear, musicFile } = values;
    
            const formData = new FormData();
            formData.append('musicFile', musicFile[0].originFileObj);
            formData.append('title', title);
            formData.append('artist', artist);
            formData.append('genre', genre);
            formData.append('album', album);
            formData.append('publishedYear', publishedYear);
    
            const res = await UploadApi(formData); // Call the upload API
    
            if (res && res.EC === 0) {
                notification.success({
                    message: "UPLOAD MUSIC",
                    description: "Music uploaded successfully!"
                });
            } else {
                notification.error({
                    message: "UPLOAD MUSIC",
                    description: res?.EM ?? "Error uploading music"
                });
            }
    
            console.log('>> Upload Result:', res);
        } catch (error) {
            console.error('Error during upload:', error);
            notification.error({
                message: "UPLOAD MUSIC",
                description: "An error occurred during upload."
            });
        }
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
                    <legend>Upload Music</legend>
                    <Form
                        name="uploadMusic"
                        onFinish={onFinish}
                        autoComplete="off"
                        layout='vertical'
                    >
                        <Form.Item
                            label="Title"
                            name="title"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input the title!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Artist"
                            name="artist"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input the artist!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Genre"
                            name="genre"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input the genre!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Album"
                            name="album"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Published Year"
                            name="publishedYear"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input the published year!',
                                },
                            ]}
                        >
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item
                            label="Music File"
                            name="musicFile"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please upload a music file!',
                                },
                            ]}
                        >
                            <Upload
                                accept="audio/*"
                                beforeUpload={() => false} 
                            >
                                <Button>Click to Upload</Button>
                            </Upload>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Upload Music
                            </Button>
                        </Form.Item>
                    </Form>
                    <Link to={"/"}><ArrowLeftOutlined /> Back to HomePage</Link>
                    <Divider />
                </fieldset>
            </Col>
        </Row>
    );
};

export default UploadMusicPage;