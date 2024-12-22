import React, { useState } from "react";
import { getMusicInPlaylistApi } from "../services/apiService";
import { useNavigate } from "react-router-dom";
import { CaretRightOutlined } from "@ant-design/icons";
import "../assets/styles/playlistuser.css";
import axios from "../services/axios.customize";

const PlaylistUser = ({ itemsToShow, playlists }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const navigate = useNavigate();

  const handlePlaylistClick = async (playlist) => {
    try {
      const response = await getMusicInPlaylistApi({ playlistId: playlist.id });
      const playlistName = playlist.name.replace(/\s+/g, "-").toLowerCase();
      navigate(`/playlist/${playlistName}`, { state: { playlist, songs: response } });
    } catch (error) {
      console.error("Error fetching songs for the playlist:", error);
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
              <CaretRightOutlined className="playlistuser-placeholder-icon" />
            </div>
          )}
          <div className="playlistuser-info">
            <div className="playlistuser-title">{playlist.name}</div>
            <div className="playlistuser-description">{playlist.creationDate}</div>
          </div>
          {hoveredIndex === playlistid && (
            <div className="playlistuser-icon">
              <div className="playlistuser-hover-icon">
                <CaretRightOutlined />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PlaylistUser;
