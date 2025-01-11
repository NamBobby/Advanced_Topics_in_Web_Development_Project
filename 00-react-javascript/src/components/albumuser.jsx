import React, { useState } from "react";
import { CaretRightOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { deleteAlbumApi } from "../services/apiService";
import "../assets/styles/albumuser.css";
import axios from "../services/axios.customize";
import AlbumLogo from "../assets/images/albumlogo.png";

const AlbumUser = ({ itemsToShow, albums, onDelete }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const navigate = useNavigate();

  const handleAlbumClick = async (album) => {
    try {
      const albumName = album.name.replace(/\s+/g, "-").toLowerCase();
      navigate(`/albumuser/${albumName}`, { state: { album } });
    } catch (error) {
      console.error("Error fetching songs for the album:", error);
    }
  };

  const handleDelete = async (albumId, event) => {
    event.stopPropagation(); 
    try {
      await deleteAlbumApi(albumId);
      if (onDelete) {
        onDelete(albumId);
      }
      window.dispatchEvent(new CustomEvent("authUpdate"));
    } catch (error) {
      console.error("Error deleting album:", error);
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
              className="albumuser-image"
            />
          ) : (
            <div className="albumuser-placeholder">
              <img src={AlbumLogo} alt="Album Logo" className="albumuser-placeholder-icon" />
            </div>
          )}
          <div className="albumuser-info">
            <div className="albumuser-title">{album.name}</div>
            <div className="albumuser-artist">{album.publishedYear}</div>
          </div>
          {hoveredIndex === albumid && (
            <>
              <div className="albumuser-icon">
                <div className="albumuser-hover-icon">
                  <CaretRightOutlined />
                </div>
              </div>
              <MinusCircleOutlined
                className="albumuser-delete-icon"
                onClick={(event) => handleDelete(album.albumId, event)}
              />
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default AlbumUser;
