import React from "react";
import { Button, Form, Input, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import "../../assets/styles/uploadmusic.css";

const UploadMusic = () => {
  const onFinish = (values) => {
    console.log("Form values:", values);
    // Add logic to handle the upload
  };

  return (
    <div className="upload-overlay">
      <div className="upload-background">
        <div className="userinfo-header">
          <p className="user-role">Artist</p>
          <h3 className="user-name">John Doe</h3>
        </div>
        <div className="upload-content">
        <div className="title-header">
            <h2 className="title">Upload Music</h2>
        </div>
          <Form
            name="uploadForm"
            className="custom-upload-form"
            onFinish={onFinish}
            layout="vertical"
            autoComplete="off"
          >
            {/* Title */}
            <Form.Item
              label="Title"
              name="title"
              rules={[
                {
                  required: true,
                  message: "Please input the music title!",
                },
              ]}
            >
              <Input placeholder="Enter music title" />
            </Form.Item>

            {/* Artist */}
            <Form.Item
              label="Artist"
              name="artist"
              rules={[
                {
                  required: true,
                  message: "Please input the artist name!",
                },
              ]}
            >
              <Input placeholder="Enter artist name" />
            </Form.Item>

            {/* Genre */}
            <Form.Item
              label="Genre"
              name="genre"
              rules={[
                {
                  required: true,
                  message: "Please input the genre!",
                },
              ]}
            >
              <Input placeholder="Enter genre" />
            </Form.Item>

            {/* Upload File */}
            <Form.Item
              label="Upload File"
              name="file"
              valuePropName="fileList"
              getValueFromEvent={(e) => e.fileList}
              rules={[
                {
                  required: true,
                  message: "Please upload a music file!",
                },
              ]}
            >
              <Upload beforeUpload={() => false} listType="text">
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>

            {/* Submit Button */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="upload-submit-button"
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default UploadMusic;
