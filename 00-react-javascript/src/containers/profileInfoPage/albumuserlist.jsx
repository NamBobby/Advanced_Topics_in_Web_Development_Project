import React, { useState } from "react";
import { CaretRightOutlined, PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "../../assets/styles/albumuserlist.css";

const albums = [
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
  // Thêm các album khác...
];

const AlbumUserList = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="album-user-list">
      {/* Header với tên người dùng */}
      <div className="album-user-header">
        <h2>
          <Link to="/userInfo">Sơn Tùng M-TP</Link>
        </h2>
      </div>

      {/* Danh sách album */}
      <div className="album-list">
        {albums.map((album, albumid) => (
          <div
            className="album-item"
            key={albumid}
            onMouseEnter={() => setHoveredIndex(albumid)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="album-item-content">
              {album.img ? (
                <img src={album.img} alt={album.title} className="albumitem-image" />
              ) : (
                <div className="albumitem-placeholder">
                  <CaretRightOutlined className="albumitem-placeholder-icon" />
                </div>
              )}

              {/* Thông tin album */}
              <div className="albumitem-info">
                <h3>{album.title}</h3>
                <p>
                  {album.created} • {album.songcount} songs
                </p>
                <p className="albumitem-description">{album.description}</p>
              </div>
            </div>

            {/* Hover icons */}
            {hoveredIndex === albumid && (
              <div className="album-item-hover-icons">
                <div className="album-item-icon">
                  <CaretRightOutlined className="play-icon" />
                </div>
                <div className="album-item-icon">
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

export default AlbumUserList;
