import React, { useState, useEffect } from "react";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import { CaretRightOutlined, LeftOutlined } from "@ant-design/icons";
import "../assets/styles/albumDetail.css";
import axios from "../services/axios.customize";
import { getAlbumsApi, getMusicInAlbumApi } from "../services/apiService";

const AlbumDetail = () => {
  const { title } = useParams(); // Extract album name from URL
  const navigate = useNavigate();
  const [album, setAlbum] = useState(null);
  const [songs, setSongs] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [itemsToShow, setItemsToShow] = useState(5);
  const [expanded, setExpanded] = useState(false);
  const [durations, setDurations] = useState({});
  const [loading, setLoading] = useState(true);
  const { setCurrentSong, setSongList } = useOutletContext();

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
            albumId: matchedAlbum.id,
          });
          setSongs(songsResponse);
        } else {
          throw new Error("Album not found");
        }
      } catch (error) {
        console.error("Error fetching album data:", error);
        navigate("/"); // Redirect to home if the album is not found
      } finally {
        setLoading(false);
      }
    };

    fetchAlbumData();
  }, [title, navigate]);

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

  const handleBackClick = () => {
    navigate(-1); // Navigate back to the previous page
  };

  const handleArtistClick = () => {
    navigate(`/artist/${album.accountId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!album) {
    return <div>Album not found</div>;
  }

  return (
    <div className="albumdetail-overlay">
      <div className="albumdetail-background">
        <div className="logo-back">
          <LeftOutlined className="back-icon" onClick={handleBackClick} />
        </div>
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
            <div className="albumsong-description">{song.description}</div>
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
