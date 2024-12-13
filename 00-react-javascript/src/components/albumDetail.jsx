import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { CaretRightOutlined } from "@ant-design/icons";
import "../assets/styles/albumDetail.css";

const AlbumDetail = () => {
  const location = useLocation();
  const { album } = location.state || {};
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [itemsToShow, setItemsToShow] = useState(5);
  const [expanded, setExpanded] = useState(false);

  if (!album) {
    return <div>Album not found!</div>;
  }

  const backgroundStyle = {
    backgroundImage: album.img ? `url(${album.img})` : "",
    backgroundColor: album.img ? "transparent" : "#1e1e1e", 
  };

  const handleSeeMore = () => {
    if (expanded) {
      setItemsToShow(5);
      setExpanded(false);
    } else {
      setItemsToShow(album.songs.length);
      setExpanded(true);
    }
  };

  return (
      <div className="album-detail">
        <div className="album-header" style={backgroundStyle}>
        <div className="album-detail-info">
          <h1>{album.title}</h1>
          <p>{album.description}</p>
          <h2>
            <Link to="/userInfo">Sơn Tùng M-TP</Link>
          </h2>
        </div>
      </div>
      <div className="albumsong-wrapper">
        <h2>Album List</h2>
        {album.songs.slice(0, itemsToShow).map((song, index) => (
          <div
            key={index}
            className="albumsong"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}>
            <div className="albumsong-number">
              {hoveredIndex === index ? <CaretRightOutlined /> : index + 1}
            </div>
            <div className="albumsong-image-container">
              {song.img ? (
                <img
                  src={song.img}
                  alt={song.title}
                  className="albumsong-image"
                />
              ) : (
                <div className="albumsong-placeholder">
                  <CaretRightOutlined className="albumsong-placeholder-icon" />
                </div>
              )}
            </div>
            <div className="albumsong-info">
              <div className="albumsong-name">{song.title}</div>
            </div>
            <div className="albumsong-duration">{song.duration}</div>
          </div>
        ))}
        {album.songs.length > 5 && (
          <div className="albumsong-see-more" onClick={handleSeeMore}>
            {expanded ? "See Less" : "See More"}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlbumDetail;
