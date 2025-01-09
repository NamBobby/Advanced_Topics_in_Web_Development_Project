import React, { useState, useEffect } from "react";
import { Button, Divider, Form, Input, Upload, Select, notification } from "antd";
import {
  UploadOutlined,
  LeftOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { uploadMusicApi, getAlbumsApi } from "../../services/apiService";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../../assets/styles/uploadmusic.css";
import EmptyImage from "../../assets/images/blackimage.png";

const UploadMusic = () => {
  const [albums, setAlbums] = useState([]);
  const [form] = Form.useForm();
  const location = useLocation();
  const { user } = location.state || {};
  const navigate = useNavigate();
  const [musicFile, setMusicFile] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const albumData = await getAlbumsApi();
        if (albumData) {
          const userAlbums = albumData.filter(
            (album) => album.artist === user.name
          );
          setAlbums(userAlbums);
        }
      } catch (error) {
        console.error("Error fetching albums:", error);
      }
    };
    fetchAlbums();
  }, [user]);

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

  const handleFileChange = (info) => {
    if (info.fileList.length > 0) {
      const file = info.fileList[0];
      setMusicFile(file.originFileObj);
      setFileList(info.fileList);
    }
  };

  const handleFileRemove = () => {
    setMusicFile(null);
    setFileList([]);
  };

  const handleUploadMusic = async () => {
    try {
      const values = form.getFieldsValue();

      if (!values.albumId) {
        values.albumId = ""; 
      }

      if (!values.description) {
        values.description = "";
      }

      if (!musicFile) {
        notification.error({ message: "Please upload a music file." });
        return;
      }

      const formData = new FormData();
      formData.append("musicFile", musicFile);
      if (thumbnailFile) formData.append("thumbnail", thumbnailFile);
      Object.keys(values).forEach((key) => formData.append(key, values[key]));
      formData.append("accountId", user.id);

      const response = await uploadMusicApi(formData);
      //console.log("Response from uploadMusicApi:", response);

      notification.success({ message: "Music uploaded successfully!" });
      window.dispatchEvent(new CustomEvent("authUpdate"));
      navigate("/userInfo", { state: { user } });
    } catch (error) {
      console.error("Error uploading music:", error);
      notification.error({ message: "Failed to upload music." });
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
          <h1 className="upload-title">Upload Music</h1>

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
            <Form.Item
              name="title"
              label="Title"
              rules={[
                {
                  required: true,
                  message: "Please input music title!",
                },
              ]}>
              <Input placeholder="Enter music title" />
            </Form.Item>
            <Form.Item
              name="genre"
              label="Genre"
              rules={[
                {
                  required: true,
                  message: "Please input genre!",
                },
              ]}>
              <Input placeholder="Enter music genre" />
            </Form.Item>
            <Form.Item
              name="albumId"
              label="Album"
            >
              <Select placeholder="Select an album">
                {albums.map((album) => (
                  <Select.Option key={album.albumId} value={album.albumId}>
                    {album.name}
                  </Select.Option>
                ))}
              </Select>
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
            <Form.Item name="description" label="Description">
              <Input.TextArea placeholder="Enter description" />
            </Form.Item>

            <Form.Item name="musicFile" label="Music File">
              <Upload
                beforeUpload={() => false}
                fileList={fileList}
                onChange={handleFileChange}
                onRemove={handleFileRemove}
                showUploadList={{
                  showRemoveIcon: true,
                  removeIcon: <DeleteOutlined />,
                }}>
                {!musicFile && (
                  <Button icon={<UploadOutlined />}>Choose File</Button>
                )}
              </Upload>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                className="upload-button"
                onClick={handleUploadMusic}>
                Upload Music
              </Button>
            </Form.Item>
          </Form>
          <Divider />
        </div>
      </div>
    </div>
  );
};

export default UploadMusic;
