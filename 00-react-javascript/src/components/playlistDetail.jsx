import React, { useState } from "react";
import { useLocation, useOutletContext, useNavigate } from "react-router-dom";
import { CaretRightOutlined, LeftOutlined } from "@ant-design/icons";
import "../assets/styles/playlistDetail.css";
import axios from "../services/axios.customize";

const PlaylistDetail = () => {
  const location = useLocation();
  const { playlist, songs } = location.state || {};
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [itemsToShow, setItemsToShow] = useState(5);
  const [expanded, setExpanded] = useState(false);
  const [durations, setDurations] = useState({});
  const { setCurrentSong, setSongList } = useOutletContext();
  const navigate = useNavigate();

  if (!playlist) {
    return <div>Playlist not found!</div>;
  }

  const loadSongDuration = (filePath, index) => {
    const audio = new Audio(
      `${axios.defaults.baseURL}/${filePath.replace(/^src[\\/]/, "")}`
    );
    audio.onloadedmetadata = () => {
      setDurations((prevDurations) => ({
        ...prevDurations,
        [index]: Math.floor(audio.duration),
      }));
    };
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

  const handleBackClick = () => {
    navigate(-1); 
  };

  return (
    <div className="playlistdetail-overlay">
      <div className="playlistdetail-background">
        <div className="logo-back">
          <LeftOutlined className="back-icon" onClick={handleBackClick} />
        </div>
        <img
          src={
            playlist.thumbnailPath
              ? `${axios.defaults.baseURL}/${playlist.thumbnailPath.replace(
                  /^src[\\/]/,
                  ""
                )}`
              : "https://via.placeholder.com/400"
          }
          alt="PLaylist thumbnail"
          className="hidden-image"
        />
        <div className="playlistdetail-header">
          <h1>{playlist.name}</h1>
          <p>{playlist.creationDate}</p>
        </div>
      </div>

      <div className="playlistdetail-content">
        <h2>Playlist {playlist.name} List</h2>
        {songs.slice(0, itemsToShow).map((song, songid) => (
          <div
            key={songid}
            className="playlistsong"
            onClick={() => {
              setCurrentSong(song);
              setSongList(songs);
            }}
            onMouseEnter={() => setHoveredIndex(songid)}
            onMouseLeave={() => setHoveredIndex(null)}>
            <div className="playlistsong-number">
              {hoveredIndex === songid ? <CaretRightOutlined /> : songid + 1}
            </div>
            <div className="playlistsong-image-container">
              {song.thumbnailPath ? (
                <img
                  src={`${axios.defaults.baseURL}/${song.thumbnailPath.replace(
                    /^src[\\/]/,
                    ""
                  )}`}
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
            <div className="playlistsong-description">{song.description}</div>
            <div className="playlistsong-duration">
              {durations[songid]
                ? `${Math.floor(durations[songid] / 60)}:${String(
                    durations[songid] % 60
                  ).padStart(2, "0")}`
                : "Loading..."}
            </div>
            {song.filePath &&
              !durations[songid] &&
              loadSongDuration(song.filePath, songid)}
          </div>
        ))}
        {songs.length > 5 && (
          <div onClick={handleSeeMore}>
            {expanded ? "See Less" : "See More"}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistDetail;
