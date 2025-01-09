import React, { useState } from "react";
import { deletePlaylistApi } from "../services/apiService";
import { useNavigate } from "react-router-dom";
import { CaretRightOutlined, MinusCircleOutlined } from "@ant-design/icons";
import "../assets/styles/playlistuser.css";
import axios from "../services/axios.customize";
import PlaylistLogo from "../assets/images/playlistlogo.png";

const PlaylistUser = ({ itemsToShow, playlists, onDelete }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const navigate = useNavigate();

  const handlePlaylistClick = async (playlist) => {
    try {
      const playlistName = playlist.name.replace(/\s+/g, "-").toLowerCase();
      navigate(`/playlist/${playlistName}`, { state: { playlist } });
    } catch (error) {
      console.error("Error fetching songs for the playlist:", error);
    }
  };

  const handleDelete = async (playlistId, event) => {
    event.stopPropagation(); 
    try {
      await deletePlaylistApi(playlistId);
      if (onDelete) {
        onDelete(playlistId);
      }
      window.dispatchEvent(new CustomEvent("authUpdate"));
    } catch (error) {
      console.error("Error deleting playlist:", error);
    }
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
          {playlist.thumbnailPath ? (
            <img 
            src={`${axios.defaults.baseURL}/${playlist.thumbnailPath.replace(
              /^src[\\/]/,
              ""
            )}`} 
            alt={playlist.name} 
            className="playlistuser-image" />
          ) : (
            <div className="playlistuser-placeholder">
              <img src={PlaylistLogo} alt="Playlist Logo" className="playlistuser-placeholder-icon" />
            </div>
          )}
          <div className="playlistuser-info">
            <div className="playlistuser-title">{playlist.name}</div>
          </div>
          {hoveredIndex === playlistid && (
            <>
              <div className="playlistuser-icon">
                <div className="playlistuser-hover-icon">
                  <CaretRightOutlined />
                </div>
              </div>
              <MinusCircleOutlined
                className="playlistuser-delete-icon"
                onClick={(event) => handleDelete(playlist.playlistId, event)}
              />
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default PlaylistUser;
