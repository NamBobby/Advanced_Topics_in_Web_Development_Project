import React, { useState } from "react";
import { useLocation, useOutletContext, useNavigate } from "react-router-dom";
import { CaretRightOutlined } from "@ant-design/icons";
import "../assets/styles/albumDetail.css";
import axios from "../services/axios.customize";

const AlbumDetail = () => {
  const location = useLocation();
  const { album, songs } = location.state || {};
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [itemsToShow, setItemsToShow] = useState(5);
  const [expanded, setExpanded] = useState(false);
  const [durations, setDurations] = useState({});
  const { setCurrentSong, setSongList } = useOutletContext();
  const navigate = useNavigate();

  const handleSeeMore = () => {
    setItemsToShow(expanded ? 5 : songs.length);
    setExpanded(!expanded);
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

  const handleArtistClick = (artist) => {
    const artistName = artist.name.replace(/\s+/g, "-").toLowerCase();
    navigate(`artist/${artistName}`, { state: { artist } });
  };

  return (
    <div className="albumdetail-overlay">
      <div className="albumdetail-background">
        <img
          src={
            album.thumbnailPath
              ? `${axios.defaults.baseURL}/${album.thumbnailPath.replace(
                  /^src[\\/]/,
                  ""
                )}`
              : "https://via.placeholder.com/400"
          }
          alt="Album thumbnail"
          className="hidden-image"
        />

        <div className="albumdetail-header">
          <h1>{album.name}</h1>
          <div 
            className="albumdetail-artist" 
            onClick={() => handleArtistClick(album.artist)}>
            <h2>{album.artist}</h2>
          </div>
        </div>
      </div>
      <div className="albumdetail-content">
        <h2>Album {album.name} List</h2>
        {songs.slice(0, itemsToShow).map((song, songid) => (
          <div
            key={songid}
            className="albumsong"
            onClick={() => {
              setCurrentSong(song);
              setSongList(songs);
            }}
            onMouseEnter={() => setHoveredIndex(songid)}
            onMouseLeave={() => setHoveredIndex(null)}>
            <div className="albumsong-number">
              {hoveredIndex === songid ? <CaretRightOutlined /> : songid + 1}
            </div>
            <div className="albumsong-image-container">
              {song.thumbnailPath ? (
                <img
                  src={`${axios.defaults.baseURL}/${song.thumbnailPath.replace(
                    /^src[\\/]/,
                    ""
                  )}`}
                  alt={song.title}
                  className="albumsong-image"
                />
              ) : (
                <div className="albumsong-placeholder">
                  <CaretRightOutlined className="albumsong-placeholder-icon" />
                </div>
              )}
            </div>
            <div className="albumsong-info">
              <div className="albumsong-name">{song.title}</div>
            </div>
            <div className="albumsong-duration">
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

export default AlbumDetail;
