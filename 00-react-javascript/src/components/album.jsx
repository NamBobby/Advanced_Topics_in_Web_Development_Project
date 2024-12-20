import React, { useState } from "react";
import { useNavigate, useOutletContext  } from "react-router-dom";
import { CaretRightOutlined } from "@ant-design/icons";
import { getMusicInAlbumApi } from "../services/apiService";
import "../assets/styles/album.css";
import axios from "../services/axios.customize";


const Album = ({ itemsToShow, albums }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const navigate = useNavigate();
  
  const handleAlbumClick = async (album) => {
    try {
      console.log("Album data:", album); // Debug album data
      const response = await getMusicInAlbumApi({ albumId: album.id });
      console.log("Songs in album:", response); // Debug songs data
      navigate(`/album/${album.name}`, { state: { album, songs: response } });
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
              <CaretRightOutlined className="album-placeholder-icon" />
            </div>
          )}
          <div className="album-info">
            <div className="album-title">{album.name}</div>
            <div className="album-artist">{album.artist}</div>
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

export default Album;
