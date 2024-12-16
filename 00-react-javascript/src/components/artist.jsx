import React, { useState, useEffect } from "react";
import { CaretRightOutlined } from "@ant-design/icons";
import "../assets/styles/artist.css";
import axios from "../services/axios.customize";

const Artist = ({ artists, itemsToShow }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    console.log("Artists received in Artist component:", artists);
  }, [artists]);

  return (
    <div className="artist-wrapper">
      {artists.length > 0 ? (
        artists.slice(0, itemsToShow).map((artist, artistid) => (
          <div
            key={artistid}
            className="artist"
            onMouseEnter={() => setHoveredIndex(artistid)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {artist.avatarPath ? (
              // Sửa đường dẫn avatarPath để loại bỏ tiền tố 'src\\'
              <img
                src={`${axios.defaults.baseURL}/uploads/${artist.avatarPath.replace(/^src[\\/]/, "")}`}
                alt={artist.name}
                className="artist-image"
              />
            ) : (
              <div className="artist-placeholder">
                <CaretRightOutlined className="artist-placeholder-icon" />
              </div>
            )}
            <div className="artist-info">
              <div className="artist-name">{artist.name}</div>
              <div className="artist-role">Artist</div>
            </div>
            {hoveredIndex === artistid && (
              <div className="artist-icon">
                <div className="artist-hover-icon">
                  <CaretRightOutlined />
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <div>No artists found</div>
      )}
    </div>
  );
};

export default Artist;
