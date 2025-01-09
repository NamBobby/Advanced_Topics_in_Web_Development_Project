import React, { useEffect, useState } from "react";
import "../assets/styles/songuser.css";
import axios from "../services/axios.customize";
import {
  PlusCircleOutlined,
  CaretRightOutlined,
  MinusCircleOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import {
  deleteMusicApi,
  addMusicToAlbumApi,
  addMusicToPlaylistApi,
  getMusicInPlaylistApi,
} from "../services/apiService";
import { Dropdown } from "antd";
import SongLogo from "../assets/images/songlogo.png";

const SongUser = ({ songs, handleSongClick, onDelete, albums, playlists }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [itemsToShow, setItemsToShow] = useState(5);
  const [durations, setDurations] = useState({});
  const [filteredPlaylists, setFilteredPlaylists] = useState([]);
  const [playlistSongs, setPlaylistSongs] = useState({});

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

  const handleDelete = async (id) => {
    try {
      await deleteMusicApi(id);
      if (onDelete) {
        onDelete(id);
      }
      window.dispatchEvent(new CustomEvent("authUpdate"));
    } catch (error) {
      console.error("Error deleting music:", error);
    }
  };

  const handleAddToAlbum = async (musicId, albumId) => {
    try {
      await addMusicToAlbumApi({ musicId, albumId });
      window.dispatchEvent(new CustomEvent("authUpdate"));
    } catch (error) {
      console.error("Error adding music to album:", error);
    }
  };

  const handleAddToPlaylist = async (musicId, playlistId) => {
    try {
      await addMusicToPlaylistApi({ musicId, playlistId });
      window.dispatchEvent(new CustomEvent("authUpdate"));
    } catch (error) {
      console.error("Error adding music to playlist:", error);
    }
  };

  useEffect(() => {
    const preloadPlaylistData = async () => {
      try {
        const results = await Promise.all(
          playlists.map(async (playlist) => {
            const musicInPlaylist = await getMusicInPlaylistApi({
              playlistId: playlist.playlistId,
            });
            return { playlistId: playlist.playlistId, musics: musicInPlaylist };
          })
        );

        const cache = results.reduce((acc, { playlistId, musics }) => {
          acc[playlistId] = musics;
          return acc;
        }, {});
        setPlaylistSongs(cache);
      } catch (error) {
        console.error("Error preloading playlist data:", error);
      }
    };

    if (playlists.length > 0) {
      preloadPlaylistData();
    }
  }, [playlists]);

  // Filter playlists when dropdown opens
  const handleDropdownClick = (musicId) => {
    const result = playlists.filter((playlist) => {
      const musics = playlistSongs[playlist.playlistId] || [];
      return !musics.some((music) => music.musicId === musicId);
    });

    setFilteredPlaylists(result);
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
                <img src={SongLogo} alt="Song Logo" className="songuser-placeholder-icon" />
              </div>
            )}
          </div>
          <div className="songuser-info">
            <div className="songuser-name">{song.title}</div>
          </div>
          <div className="songuser-description">{song.description}</div>
          <div className="songuser-actions">
            <Dropdown
              menu={{
                items: filteredPlaylists.map((playlist) => ({
                  key: playlist.playlistId,
                  label: (
                    <div
                      onClick={() => handleAddToPlaylist(song.musicId, playlist.playlistId)}>
                      {playlist.name}
                    </div>
                  ),
                })),
              }}
              trigger={["click"]}
              onOpenChange={() => handleDropdownClick(song.musicId)}>
              <HeartOutlined
                className="add-to-playlist-icon"
                onClick={(e) => {
                  e.stopPropagation(); 
                }}
              />
            </Dropdown>

            {!song.albumId && (
              <Dropdown
                menu={{
                  items: albums.map((album) => ({
                    key: album.albumId,
                    label: (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToAlbum(song.musicId, album.albumId);
                        }}>
                        {album.name}
                      </div>
                    ),
                  })),
                }}
                trigger={["click"]}>
                <PlusCircleOutlined
                  className="add-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                />
              </Dropdown>
            )}

            <MinusCircleOutlined
              className="delete-icon"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(song.musicId);
              }}
            />
          </div>
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
