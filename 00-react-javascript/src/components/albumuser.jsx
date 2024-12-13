import React, { useState } from "react";
import { CaretRightOutlined } from "@ant-design/icons";
import "../assets/styles/albumuser.css";

const AlbumUser = ({ itemsToShow }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const albums = [
    {
      img: "https://i1.sndcdn.com/artworks-JriKS1DyZJ5jOzOn-1NCPkg-t500x500.jpg",
      title: "B Ray Mix",
      description: "RHYDER, Lê Hiếu and Sơn Tùng M-TP",
    },
    {
      img: "https://i.ytimg.com/vi/7u4g483WTzw/maxresdefault.jpg",
      title: "Upbeat Mix",
      description: "Chappell Roan, Sabrina Carpenter, Eminem and more",
    },
    {
      img: "",
      title: "Pop Mix",
      description: "Taylor Swift, Lady Gaga, Sabrina Carpenter and more",
    },
    {
      img: "https://i.ytimg.com/vi/5_ozB0ImkYA/maxresdefault.jpg",
      title: "Indie Mix",
      description: "52Hz, Ngọt, Vũ. and more",
    },
    {
      img: "https://cdn-images.dzcdn.net/images/cover/7947fa2b4981370977e39f0fd645d4b0/0x1900-000000-80-0-0.jpg",
      title: "Chill Mix",
      description: "RAP VIỆT, SOOBIN, ANH TRAI 'SAY HI' and more",
    }
  ];

  return (
    <div className="albumuser-wrapper">
      {albums.slice(0, itemsToShow).map((album, albumid) => (
        <div
          key={albumid}
          className="albumuser"
          onMouseEnter={() => setHoveredIndex(albumid)}
          onMouseLeave={() => setHoveredIndex(null)}>
          {album.img ? (
            <img
              src={album.img}
              alt={album.title}
              className="albumuser-image"
            />
          ) : (
            <div className="albumuser-placeholder">
              <CaretRightOutlined className="albumuser-placeholder-icon" />
            </div>
          )}
          <div className="albumuser-info">
            <div className="albumuser-title">{album.title}</div>
            <div className="albumuser-description">{album.description}</div>
          </div>
          {hoveredIndex === albumid && (
            <div className="albumuser-icon">
              <div className="albumuser-hover-icon">
                <CaretRightOutlined />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AlbumUser;
