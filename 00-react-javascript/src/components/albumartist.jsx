import React, { useState } from "react";
import { useNavigate  } from "react-router-dom";
import { CaretRightOutlined } from "@ant-design/icons";
import "../assets/styles/album.css";
import axios from "../services/axios.customize";
import AlbumLogo from "../assets/images/albumlogo.png";

const AlbumArtist = ({ itemsToShow, albums }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const navigate = useNavigate();
  
  const handleAlbumClick = async (album) => {
    try {
      const albumName = album.name.replace(/\s+/g, "-").toLowerCase();
      navigate(`/album/${albumName}`, { state: { album }});
    } catch (error) {
      console.error("Error fetching songs for the album:", error);
    }
  };
  

  return (
    <div className="album-wrapper">
      {albums.slice(0, itemsToShow).map((album, albumid) => (
        <div
          key={albumid}
          className="album"
          onClick={() => handleAlbumClick(album)}
          onMouseEnter={() => setHoveredIndex(albumid)}
          onMouseLeave={() => setHoveredIndex(null)}>
          {album.thumbnailPath ? (
            <img 
            src={`${axios.defaults.baseURL}/${album.thumbnailPath.replace(/^src[\\/]/, "")}`} 
            alt={album.name} 
            className="album-image" />
          ) : (
            <div className="album-placeholder">
              <img src={AlbumLogo} alt="Album Logo" className="album-placeholder-icon" />
            </div>
          )}
          <div className="album-info">
            <div className="album-title">{album.name}</div>
            <div className="album-artist">{album.publishedYear}</div>
          </div>
          {hoveredIndex === albumid && (
            <div className="album-icon">
              <div className="album-hover-icon">
                <CaretRightOutlined />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AlbumArtist;
