import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CaretRightOutlined } from "@ant-design/icons";
import "../assets/styles/playlistuser.css";

const PlaylistUser = ({ itemsToShow }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const navigate = useNavigate();

  const playlists = [
    {
      img: "https://i1.sndcdn.com/artworks-JriKS1DyZJ5jOzOn-1NCPkg-t500x500.jpg",
      title: "B Ray Mix",
      description: "RHYDER, Lê Hiếu and Sơn Tùng M-TP",
      songs: [
        { title: "Sky Tour (Intro)", duration: "2:29" },
        { title: "Chạy Ngay Đi", duration: "5:09" },
        { title: "Chúng Ta Không Thuộc Về Nhau", duration: "4:07" },
      ],
    },
    {
      img: "https://i.ytimg.com/vi/7u4g483WTzw/maxresdefault.jpg",
      title: "Upbeat Mix",
      description: "Chappell Roan, Sabrina Carpenter, Eminem and more",
      songs: [
        { title: "Sky Tour (Intro)", duration: "2:29" },
        { title: "Chạy Ngay Đi", duration: "5:09" },
        { title: "Chúng Ta Không Thuộc Về Nhau", duration: "4:07" },
      ],
    },
    {
      img: "",
      title: "Pop Mix",
      description: "Taylor Swift, Lady Gaga, Sabrina Carpenter and more",
      songs: [
        { title: "Sky Tour (Intro)", duration: "2:29" },
        { title: "Chạy Ngay Đi", duration: "5:09" },
        { title: "Chúng Ta Không Thuộc Về Nhau", duration: "4:07" },
      ],
    },
    {
      img: "https://i.ytimg.com/vi/5_ozB0ImkYA/maxresdefault.jpg",
      title: "Indie Mix",
      description: "52Hz, Ngọt, Vũ. and more",
      songs: [
        { title: "Sky Tour (Intro)", duration: "2:29" },
        { title: "Chạy Ngay Đi", duration: "5:09" },
        { title: "Chúng Ta Không Thuộc Về Nhau", duration: "4:07" },
      ],
    },
    {
      img: "https://cdn-images.dzcdn.net/images/cover/7947fa2b4981370977e39f0fd645d4b0/0x1900-000000-80-0-0.jpg",
      title: "Chill Mix",
      description: "RAP VIỆT, SOOBIN, ANH TRAI 'SAY HI' and more",
      songs: [
        { title: "Sky Tour (Intro)", duration: "2:29" },
        { title: "Chạy Ngay Đi", duration: "5:09" },
        { title: "Chúng Ta Không Thuộc Về Nhau", duration: "4:07" },
      ],
    },
  ];

  const handlePlaylistClick = (playlist) => {
    navigate(`/playlist/${playlist.title}`, { state: { playlist } });
  };

  return (
    <div className="playlistuser-wrapper">
      {playlists.slice(0, itemsToShow).map((playlist, playlistid) => (
        <div
          key={playlistid}
          className="playlistuser"
          onClick={() => handlePlaylistClick(playlist)}
          onMouseEnter={() => setHoveredIndex(playlistid)}
          onMouseLeave={() => setHoveredIndex(null)}>
          {playlist.img ? (
            <img src={playlist.img} alt={playlist.title} className="playlistuser-image" />
          ) : (
            <div className="playlistuser-placeholder">
              <CaretRightOutlined className="playlistuser-placeholder-icon" />
            </div>
          )}
          <div className="playlistuser-info">
            <div className="playlistuser-title">{playlist.title}</div>
            <div className="playlistuser-description">{playlist.description}</div>
          </div>
          {hoveredIndex === playlistid && (
            <div className="playlistuser-icon">
              <div className="playlistuser-hover-icon">
                <CaretRightOutlined />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PlaylistUser;
