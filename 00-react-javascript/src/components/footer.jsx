import React, { useState } from "react";
import "../assets/styles/footer.css";
import {
  StepBackwardOutlined,
  PlayCircleOutlined,
  PauseOutlined,
  StepForwardOutlined,
  ReloadOutlined,
  SoundOutlined,
} from "@ant-design/icons";

const Footer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50); // Mặc định 50%
  const [progress, setProgress] = useState(0); // Tiến trình bài hát

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e) => {
    setVolume(e.target.value);
  };

  const handleProgressChange = (e) => {
    setProgress(e.target.value);
  };

  return (
    <footer className="footer">
      {/* Phần bên trái */}
      <div className="footer-left">
        <img
          src="https://via.placeholder.com/50" // Ảnh bìa tạm thời
          alt="Album cover"
          className="album-cover"
        />
        <div className="song-info-play">
          <h4 className="song-title-play">Ngày Mai Em Đi</h4>
          <p className="song-artist-play">Lê Hiếu, SOOBIN, Touliver</p>
        </div>
      </div>

      {/* Phần chính giữa */}
      <div className="footer-center">
        <div className="footer-control">
          <button className="control-btn prev">
            <StepBackwardOutlined />
          </button>
          <button className="control-btn play-pause" onClick={togglePlayPause}>
            {isPlaying ? <PauseOutlined /> : <PlayCircleOutlined />}
          </button>
          <button className="control-btn next">
            <StepForwardOutlined />
          </button>
        </div>
        <div className="progress-bar">
          <span className="current-time">0:08</span>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            className="progress-slider"
            onChange={handleProgressChange}
          />
          <span className="total-time">3:38</span>
        </div>
      </div>

      {/* Phần bên phải */}
      <div className="footer-right">
        <button className="control-btn volume">
          <SoundOutlined />
        </button>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          className="volume-slider"
          onChange={handleVolumeChange}
        />
      </div>
    </footer>
  );
};

export default Footer;
