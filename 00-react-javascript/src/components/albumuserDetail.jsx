import React, { useState, useEffect, useRef } from "react";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import {
  CaretRightOutlined,
  LeftOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { notification } from "antd";
import "../assets/styles/albumDetail.css";
import axios from "../services/axios.customize";
import {
  getAlbumsApi,
  getMusicInAlbumApi,
  removeMusicFromAlbumApi,
} from "../services/apiService";
import FollowButton from "./followButton";
import AlbumLogo from "../assets/images/albumlogo.png";
import SongLogo from "../assets/images/songlogo.png";

const AlbumUserDetail = () => {
  const { title } = useParams();
  const navigate = useNavigate();
  const [album, setAlbum] = useState(null);
  const [songs, setSongs] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [itemsToShow, setItemsToShow] = useState(5);
  const [durations, setDurations] = useState({});
  const { setCurrentSong, setSongList } = useOutletContext();
  const hasNotified = useRef(false);


  useEffect(() => {

    const fetchAlbumData = async () => {
      try {
        // Fetch all albums and find the one that matches the title
        const albumsResponse = await getAlbumsApi();
        const matchedAlbum = albumsResponse.find(
          (album) => album.name.replace(/\s+/g, "-").toLowerCase() === title
        );

        if (matchedAlbum) {
          setAlbum(matchedAlbum);

          // Fetch songs for the album
          const songsResponse = await getMusicInAlbumApi({
            albumId: matchedAlbum.albumId,
          });
          setSongs(songsResponse);

          if (songsResponse.length === 0 && !hasNotified.current) {
            notification.info({
              message: "Notification",
              description: "This album is empty.",
            });
            hasNotified.current = true; // Mark as notified
          }
        }
      } catch (error) {
        console.error("Error fetching album data:", error);
        navigate("/"); // Redirect to home if the album is not found
      }
    };

    fetchAlbumData();
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

  const handleRemoveSong = async (musicId) => {
    try {
      await removeMusicFromAlbumApi({ albumId: album.albumId, musicId });
      setSongs((prevSongs) => prevSongs.filter((song) => song.musicId !== musicId));
    } catch (error) {
      console.error("Error removing song from album:", error);
    }
  };

  const handleBackClick = () => {
    navigate(-1); // Navigate back to the previous page
  };

  const handleArtistClick = () => {
    const artistName = album.artist.replace(/\s+/g, "-").toLowerCase();
    navigate(`/artist/${artistName}`);
  };

  return (
    <div className="albumdetail-overlay">
      <div className="albumdetail-background">
        <div className="logo-back">
          <LeftOutlined className="back-icon" onClick={handleBackClick} />
        </div>
        <img
          src={
            album?.thumbnailPath
              ? `${axios.defaults.baseURL}/${album.thumbnailPath.replace(
                  /^src[\\/]/,
                  ""
                )}`
              : AlbumLogo
          }
          alt="Album thumbnail"
          className="hidden-image"
        />
        <div className="albumdetail-header">
          <h1 className="albumdetail-title">{album?.name}</h1>
          <div className="albumdetail-artist-role">
            <div
              className="albumdetail-artist"
              onClick={() => handleArtistClick(album.artist)}>
              <h2>{album?.artist}</h2>
            </div>
            <FollowButton followType="Album" followId={album?.albumId} />
          </div>
        </div>
      </div>
      <div className="albumdetail-content">
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
                  <img src={SongLogo} alt="Song Logo" className="albumsong-placeholder-icon" />
                </div>
              )}
            </div>
            <div className="albumsong-info">
              <div className="albumsong-name">{song.title}</div>
            </div>
            <div className="albumsong-description">{song.description}</div>
            <div className="albumsong-actions">
              <MinusCircleOutlined
                className="remove-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveSong(song.musicId);
                }}
              />
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

export default AlbumUserDetail;
