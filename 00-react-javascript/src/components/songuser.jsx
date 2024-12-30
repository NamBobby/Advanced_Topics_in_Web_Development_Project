import React, { useState } from "react";
import { CaretRightOutlined } from "@ant-design/icons";
import "../assets/styles/songuser.css";
import axios from "../services/axios.customize";

const SongUser = ({ songs, handleSongClick }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [itemsToShow, setItemsToShow] = useState(5);
  const [durations, setDurations] = useState({});

  const handleSeeMore = () => {
    setItemsToShow((prev) => Math.min(prev + 5, songs.length));
  };

  const handleSeeLess = () => {
    setItemsToShow(5);
  };

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

  return (
    <div className="songuser-wrapper">
      {songs.slice(0, itemsToShow).map((song, songid) => (
        <div
          key={songid}
          className="songuser"
          onMouseEnter={() => setHoveredIndex(songid)}
          onMouseLeave={() => setHoveredIndex(null)}
          onClick={() => handleSongClick(song)}>
          <div className="songuser-number">
            {hoveredIndex === songid ? <CaretRightOutlined /> : songid + 1}
          </div>
          <div className="songuser-image-container">
            {song.thumbnailPath ? (
              <img
                src={`${axios.defaults.baseURL}/${song.thumbnailPath.replace(
                  /^src[\\/]/,
                  ""
                )}`}
                alt={song.title}
                className="songuser-image"
              />
            ) : (
              <div className="songuser-placeholder">
                <CaretRightOutlined className="songuser-placeholder-icon" />
              </div>
            )}
          </div>
          <div className="songuser-info">
            <div className="songuser-name">{song.title}</div>
          </div>
          <div className="songuser-description">{song.description}</div>
          <div className="songuser-duration">
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
        <div className="songuser-controls">
          {itemsToShow < songs.length && (
            <div className="songuser-see-more" onClick={handleSeeMore}>
              See More
            </div>
          )}
          {itemsToShow > 5 && (
            <div className="songuser-see-less" onClick={handleSeeLess}>
              See Less
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SongUser;
