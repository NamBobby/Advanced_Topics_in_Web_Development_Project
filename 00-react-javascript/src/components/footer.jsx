import React, { useState } from 'react';
import '../assets/styles/footer.css';

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
        <div className="song-info">
          <h4 className="song-title">Ngày Mai Em Đi</h4>
          <p className="song-artist">Lê Hiếu, SOOBIN, Touliver</p>
        </div>
      </div>

      {/* Phần chính giữa */}
      <div className="footer-center">
        <button className="control-btn shuffle">🔀</button>
        <button className="control-btn prev">⏮️</button>
        <button className="control-btn play-pause" onClick={togglePlayPause}>
          {isPlaying ? '⏸️' : '▶️'}
        </button>
        <button className="control-btn next">⏭️</button>
        <button className="control-btn repeat">🔁</button>
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
        <button className="control-btn queue">📋</button>
        <button className="control-btn devices">🖥️</button>
        <button className="control-btn volume">🔊</button>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          className="volume-slider"
          onChange={handleVolumeChange}
        />
        <button className="control-btn fullscreen">⛶</button>
      </div>
    </footer>
  );
};

export default Footer;
