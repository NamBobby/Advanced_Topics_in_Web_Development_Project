import React, { useState } from "react";
import { CaretRightOutlined, PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "../../assets/styles/playlistuserlist.css";

const playlists = [
  {
    img: "https://i1.sndcdn.com/artworks-JriKS1DyZJ5jOzOn-1NCPkg-t500x500.jpg",
    title: "B Ray Mix",
    created: 2017,
    songcount: 4,
    description: "RHYDER, Lê Hiếu and Sơn Tùng M-TP",
  },
  {
    img: "",
    title: "B Ray Mix",
    created: 2017,
    songcount: 4,
    description: "RHYDER, Lê Hiếu and Sơn Tùng M-TP",
  },
  // Thêm các playlist khác...
];

const PlayListUserList = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="playlist-user-list">
      {/* Header với tên người dùng */}
      <div className="playlist-user-header">
        <h2>
          <Link to="/userInfo">Sơn Tùng M-TP</Link>
        </h2>
      </div>

      {/* Danh sách playlist */}
      <div className="playlist-list">
        {playlists.map((playlist, playlistid) => (
          <div
            className="playlist-item"
            key={playlistid}
            onMouseEnter={() => setHoveredIndex(playlistid)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="playlist-item-content">
              {playlist.img ? (
                <img src={playlist.img} alt={playlist.title} className="playlistitem-image" />
              ) : (
                <div className="playlistitem-placeholder">
                  <CaretRightOutlined className="playlistitem-placeholder-icon" />
                </div>
              )}

              {/* Thông tin playlist */}
              <div className="playlistitem-info">
                <h3>{playlist.title}</h3>
                <p>
                  {playlist.created} • {playlist.songcount} songs
                </p>
                <p className="playlistitem-description">{playlist.description}</p>
              </div>
            </div>

            {/* Hover icons */}
            {hoveredIndex === playlistid && (
              <div className="playlist-item-hover-icons">
                <div className="playlist-item-icon">
                  <CaretRightOutlined className="play-icon" />
                </div>
                <div className="playlist-item-icon">
                  <PlusOutlined className="add-icon" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayListUserList;
