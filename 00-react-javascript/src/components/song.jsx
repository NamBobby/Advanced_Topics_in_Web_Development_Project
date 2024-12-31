import React, { useState } from "react";
import { CaretRightOutlined } from "@ant-design/icons";
import '../assets/styles/song.css';
import axios from "../services/axios.customize";
import SongLogo from "../assets/images/songlogo.png";


const Song = ({ itemsToShow, songs, handleSongClick }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="song-wrapper">
      {songs.slice(0, itemsToShow).map((song,  songid) => (
        <div
          key={songid}
          className="song"
          onMouseEnter={() => setHoveredIndex(songid)}
          onMouseLeave={() => setHoveredIndex(null)}
          onClick={() => handleSongClick(song)}
        >
          {song.thumbnailPath ? (
            <img 
            src={`${axios.defaults.baseURL}/${song.thumbnailPath.replace(/^src[\\/]/, "")}`} 
            alt={song.title} 
            className="song-image" />
          ) : (
            <div className="song-placeholder">
              <img src={SongLogo} alt="Song Logo" className="song-placeholder-icon" />
            </div>
          )}
          <div className="song-info">
            <div className="song-name">{song.title}</div>
            <div className="song-artist">{song.artist}</div>
          </div>
          {hoveredIndex === songid && (
            <div className="song-icon">
              <div className="song-hover-icon">
                <CaretRightOutlined />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Song;
