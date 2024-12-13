import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { CaretRightOutlined } from "@ant-design/icons";
import "../assets/styles/playlistDetail.css";

const PlaylistDetail = () => {
  const location = useLocation();
  const { playlist } = location.state || {};
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [itemsToShow, setItemsToShow] = useState(5);
  const [expanded, setExpanded] = useState(false);

  if (!playlist) {
    return <div>Playlist not found!</div>;
  }

  const backgroundStyle = {
    backgroundImage: playlist.img ? `url(${playlist.img})` : "",
    backgroundColor: playlist.img ? "transparent" : "#1e1e1e", 
  };

  const handleSeeMore = () => {
    if (expanded) {
      setItemsToShow(5);
      setExpanded(false);
    } else {
      setItemsToShow(playlist.songs.length);
      setExpanded(true);
    }
  };

  return (
      <div className="playlist-detail">
        <div className="playlist-header" style={backgroundStyle}>
        <div className="playlist-detail-info">
          <h1>{playlist.title}</h1>
          <p>{playlist.description}</p>
          <h2>
            <Link to="/userInfo">Sơn Tùng M-TP</Link>
          </h2>
        </div>
      </div>
      <div className="playlistsong-wrapper">
        <h2>playlist List</h2>
        {playlist.songs.slice(0, itemsToShow).map((song, index) => (
          <div
            key={index}
            className="playlistsong"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}>
            <div className="playlistsong-number">
              {hoveredIndex === index ? <CaretRightOutlined /> : index + 1}
            </div>
            <div className="playlistsong-image-container">
              {song.img ? (
                <img
                  src={song.img}
                  alt={song.title}
                  className="playlistsong-image"
                />
              ) : (
                <div className="playlistsong-placeholder">
                  <CaretRightOutlined className="playlistsong-placeholder-icon" />
                </div>
              )}
            </div>
            <div className="playlistsong-info">
              <div className="playlistsong-name">{song.title}</div>
            </div>
            <div className="playlistsong-duration">{song.duration}</div>
          </div>
        ))}
        {playlist.songs.length > 5 && (
          <div className="playlistsong-see-more" onClick={handleSeeMore}>
            {expanded ? "See Less" : "See More"}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistDetail;