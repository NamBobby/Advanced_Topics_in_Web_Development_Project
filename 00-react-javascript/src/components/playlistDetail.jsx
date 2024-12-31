import React, { useState, useEffect } from "react";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import { CaretRightOutlined, LeftOutlined } from "@ant-design/icons";
import "../assets/styles/playlistDetail.css";
import axios from "../services/axios.customize";
import { getPlaylistsApi, getMusicInPlaylistApi } from "../services/apiService";

const PlaylistDetail = () => {
  const { title } = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [itemsToShow, setItemsToShow] = useState(5);
  const [durations, setDurations] = useState({});
  const { setCurrentSong, setSongList } = useOutletContext();

  useEffect(() => {
    const fetchPlaylistData = async () => {
      try {
        const playlistsResponse = await getPlaylistsApi();
        const matchedPlaylist = playlistsResponse.find(
          (pl) => pl.name.replace(/\s+/g, "-").toLowerCase() === title
        );

        if (matchedPlaylist) {
          setPlaylist(matchedPlaylist);

          const songsResponse = await getMusicInPlaylistApi({
            playlistId: matchedPlaylist.id,
          });
          setSongs(songsResponse);
        } else {
          throw new Error("Playlist not found");
        }
      } catch (error) {
        console.error("Error fetching playlist data:", error);
        navigate("/");
      }
    };

    fetchPlaylistData();
  }, [title, navigate]);

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
            playlist?.thumbnailPath
              ? `${axios.defaults.baseURL}/${playlist.thumbnailPath.replace(
                  /^src[\\/]/,
                  ""
                )}`
              : "https://via.placeholder.com/400"
          }
          alt="Playlist thumbnail"
          className="hidden-image"
        />
        <div className="playlistdetail-header">
          <h1 className="playlistdetail-title">{playlist?.name}</h1>
        </div>
      </div>
      <div className="playlistdetail-content">
        <h2>Playlist {playlist?.name} List</h2>
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
    </div>
  );
};

export default PlaylistDetail;