import React, { useState } from "react";
import { Button, Form, Input, Upload, notification } from "antd";
import {
  UploadOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import {
    createPlaylistApi,
} from "../../services/apiService";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../../assets/styles/uploadmusic.css";
import EmptyImage from "../../assets/images/blackimage.png";

const CreatePlaylist = () => {
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

  const handleCreatePlaylist = async () => {
    try {
      const values = form.getFieldsValue();
  
      const formData = new FormData();
      if (thumbnailFile) formData.append("playlistThumbnail", thumbnailFile);
      Object.keys(values).forEach((key) => formData.append(key, values[key]));
      formData.append("accountId", user.id);
  
      const response = await createPlaylistApi(formData);
      //console.log("Response from createPlaylistApi:", response);
  
      notification.success({ message: "Playlist created successfully!" });
      window.dispatchEvent(new CustomEvent("authUpdate"));
      navigate("/userInfo", { state: { user } });
    } catch (error) {
      console.error("Error creating playlist:", error);
      notification.error({ message: "Failed to create playlist." });
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
          <h1 className="upload-title">Create Playlist</h1>

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
              <Input placeholder="Enter Playlist Name" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                className="upload-button"
                onClick={handleCreatePlaylist}>
                Create Playlist
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default CreatePlaylist;
