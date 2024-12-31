import React, { useState } from "react";
import { Button, Form, Input, Upload, notification } from "antd";
import {
  UploadOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import {
    createAlbumApi,
} from "../../services/apiService";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../../assets/styles/uploadmusic.css";
import EmptyImage from "../../assets/images/blackimage.png";

const CreateAlbum = () => {
  const [form] = Form.useForm();
  const location = useLocation();
  const { user } = location.state || {};
  const navigate = useNavigate();
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);


  const handleThumbnailChange = (info) => {
    const file = info.file;

    if (file) {
      if (file.type.startsWith("image/")) {
        setThumbnailFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setThumbnailPreview(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        notification.error({
          message: "Invalid File",
          description: "Please select a valid image file.",
        });
      }
    }
  };

  const handleCreateAlbum = async () => {
    try {
      const values = form.getFieldsValue();
  
      const formData = new FormData();
      if (thumbnailFile) formData.append("albumThumbnail", thumbnailFile);
      Object.keys(values).forEach((key) => formData.append(key, values[key]));
      formData.append("accountId", user.id);
  
      const response = await createAlbumApi(formData);
      //console.log("Response from createAlbumApi:", response);
  
      notification.success({ message: "Album created successfully!" });
      navigate("/userInfo", { state: { user } });
    } catch (error) {
      console.error("Error creating album:", error);
      notification.error({ message: "Failed to create album." });
    }
  };
  

  return (
    <div className="upload-container">
      <div className="upload-navigation">
        <div className="upload-logo">
          <Link to="/userInfo" state={{ user }}>
            <LeftOutlined className="back-icon" />
          </Link>
        </div>
      </div>
      <div className="upload-box">
        <div className="upload-form">
          <h1 className="upload-title">Create Album</h1>

          <div className="thumbnail-wrapper">
            <div className="thumbnail-frame">
              <img
                src={thumbnailPreview || EmptyImage}
                alt="Thumbnail"
                className="thumbnail-image"
              />
              <Upload
                beforeUpload={() => false}
                onChange={handleThumbnailChange}
                showUploadList={false}>
                <Button
                  icon={<UploadOutlined />}
                  className="thumbnail-upload-button">
                  Upload Thumbnail
                </Button>
              </Upload>
            </div>
          </div>

          <Form
            name="uploadForm"
            className="upload-custom-form"
            layout="vertical"
            autoComplete="off"
            form={form}>
            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
              <Input placeholder="Enter Album Name" />
            </Form.Item>
            
            <Form.Item
              name="publishedYear"
              label="Published Year"
              rules={[
                { required: true, message: "Please enter a valid year!" },
                {
                  pattern: /^(19\d{2}|20(0\d|1\d|2[0-5]))$/,
                  message: "Year must be between 1900 and 2025!",
                },
              ]}>
              <Input type="number" placeholder="Enter year" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                className="upload-button"
                onClick={handleCreateAlbum}>
                Create Album
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default CreateAlbum;
