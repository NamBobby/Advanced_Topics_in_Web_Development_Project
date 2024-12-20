import React, { useState } from "react";
import { CaretRightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getMusicInAlbumApi } from "../services/apiService";
import "../assets/styles/albumuser.css";
import axios from "../services/axios.customize";

const AlbumUser = ({ itemsToShow, albums }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const navigate = useNavigate();

  const handleAlbumClick = async (album) => {
    try {
      const response = await getMusicInAlbumApi({ albumId: album.id });
      const albumName = album.name.replace(/\s+/g, "-").toLowerCase();
      navigate(`/album/${albumName}`, { state: { album, songs: response } });
    } catch (error) {
      console.error("Error fetching songs for the album:", error);
    }
  };

  return (
    <div className="albumuser-wrapper">
      {albums.slice(0, itemsToShow).map((album, albumid) => (
        <div
          key={albumid}
          className="albumuser"
          onClick={() => handleAlbumClick(album)}
          onMouseEnter={() => setHoveredIndex(albumid)}
          onMouseLeave={() => setHoveredIndex(null)}>
          {album.thumbnailPath ? (
            <img
              src={`${axios.defaults.baseURL}/${album.thumbnailPath.replace(
                /^src[\\/]/,
                ""
              )}`}
              alt={album.name}
              className="album-image"
            />
          ) : (
            <div className="album-placeholder">
              <CaretRightOutlined className="album-placeholder-icon" />
            </div>
          )}
          <div className="albumuser-info">
            <div className="albumuser-title">{album.name}</div>
            <div className="albumuser-artist">{album.artist}</div>
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
