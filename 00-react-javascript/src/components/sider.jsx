import React, { useState, useEffect, useContext } from "react";
import {
  ArrowLeftOutlined,
  UnorderedListOutlined,
  PlusOutlined,
  CaretRightOutlined,
} from "@ant-design/icons";
import "../assets/styles/sider.css";
import { useNavigate } from "react-router-dom";
import { getFollowedItemsApi, getPlaylistsApi } from "../services/apiService";
import { AuthContext } from "../components/auth.context";
import axios from "../services/axios.customize";
import ArtistLogo from "../assets/images/artistlogo.png";
import AlbumLogo from "../assets/images/albumlogo.png";
import PlaylistLogo from "../assets/images/playlistlogo.png";

const SiderBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const sidebarWidth = isExpanded ? 300 : 110;
  const [playlists, setPlaylists] = useState([]);
  const [followedArtists, setFollowedArtists] = useState([]);
  const [followedAlbums, setFollowedAlbums] = useState([]);
  const [hoveredItem, setHoveredItem] = useState({ list: null, index: null });
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  // Fetch playlists and followed items
  useEffect(() => {
    const fetchSidebarData = async () => {
      if (!auth.isAuthenticated) {
        setPlaylists([]);
        setFollowedArtists([]);
        setFollowedAlbums([]);
        return;
      }

      try {
        const playlistsResponse = await getPlaylistsApi();
        setPlaylists(playlistsResponse || []);

        const followedItemsResponse = await getFollowedItemsApi();
        const followedItems = followedItemsResponse.followedItems || [];

        setFollowedArtists(
          followedItems.filter((item) => item.followType === "Artist").map((item) => ({
            id: item.artistId, 
            name: item.name,
            thumbnailPath: item.thumbnailPath,
          }))
        );
        setFollowedAlbums(
          followedItems.filter((item) => item.followType === "Album").map((item) => ({
            id: item.albumId, 
            name: item.name,
            thumbnailPath: item.thumbnailPath,
          }))
        );
      } catch (error) {
        console.error("Error fetching sidebar data:", error);
      }
    };

    fetchSidebarData(); // Initial fetch on component mount

    const handleAuthUpdate = () => {
      fetchSidebarData();
    };

    // Listen to the custom event
    window.addEventListener("authUpdate", handleAuthUpdate);

    return () => {
      window.removeEventListener("authUpdate", handleAuthUpdate);
    };
  }, [auth.isAuthenticated]);

  const handleMouseEnter = (listName, index) => {
    setHoveredItem({ list: listName, index });
  };

  const handleMouseLeave = () => {
    setHoveredItem({ list: null, index: null });
  };

  const isHovered = (listName, index) =>
    hoveredItem.list === listName && hoveredItem.index === index;

  const handleItemClick = (type, item) => {
    if (type === "Album") {
      const albumName = item.name.replace(/\s+/g, "-").toLowerCase();
      navigate(`/album/${albumName}`, { state: { album: item } });
    } else if (type === "Artist") {
      const artistName = item.name.replace(/\s+/g, "-").toLowerCase();
      navigate(`/artist/${artistName}`, { state: { artist: item } });
    } else if (type === "Playlist") {
      const playlistName = item.name.replace(/\s+/g, "-").toLowerCase();
      navigate(`/playlist/${playlistName}`, { state: { playlist: item } });
    }
  };

  const handlePlusClick = () => {
    navigate("/createplaylist", { state: { user: auth.user } });
  };

  return (
    <div className="slider-bar" style={{ width: `${sidebarWidth}px` }}>
      {isExpanded ? (
        <div className="slider-bar-wrapper">
          <div className="library" onClick={handleToggle}>
            <div className="library-content">Your Library</div>
            {/* Show PlusOutlined only when the user is authenticated */}
            <div
              className="slider-bar-toggle-button"
              onClick={auth.isAuthenticated ? handlePlusClick : null}>
              <div className="slider-bar-toggle-icon">
                {auth.isAuthenticated && <PlusOutlined />}
              </div>
            </div>
            <div className="slider-bar-toggle-button" onClick={handleToggle}>
              <div className="slider-bar-toggle-icon">
                <ArrowLeftOutlined />
              </div>
            </div>
          </div>
          {/* Sidebar Content */}
          <div className="slider-bar-content">
            {auth.isAuthenticated ? (
              <>
                <div className="slider-bar-lists">
                  {playlists.map((playlist) => (
                    <div
                      key={`playlist-${playlist.playlistId}`}
                      className="slider-bar-list"
                      onMouseEnter={() =>
                        handleMouseEnter("playlists", playlist.playlistId)
                      }
                      onMouseLeave={handleMouseLeave}
                      onClick={() => handleItemClick("Playlist", playlist)}>
                      <img
                        src={
                          playlist.thumbnailPath
                            ? `${
                                axios.defaults.baseURL
                              }/${playlist.thumbnailPath.replace(
                                /^src[\\/]/,
                                ""
                              )}`
                            : PlaylistLogo
                        }
                        alt="PLaylist thumbnail"
                        className="slider-bar-image"
                      />
                      <div className="slider-bar-info">
                        <div className="slider-bar-name">{playlist.name}</div>
                        <div className="slider-bar-role">Playlist</div>
                      </div>
                      {isHovered("playlists", playlist.playlistId) && (
                        <div className="slider-bar-icon">
                          <div className="slider-bar-hover-icon">
                            <CaretRightOutlined />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="slider-bar-lists">
                  {followedArtists.map((artist) => (
                    <div
                      key={`artist-${artist.id || artist.name}`}
                      className="slider-bar-list"
                      onMouseEnter={() =>
                        handleMouseEnter("followedArtists", artist.id)
                      }
                      onMouseLeave={handleMouseLeave}
                      onClick={() => handleItemClick("Artist", artist)}>
                      <img
                        src={
                          artist.thumbnailPath
                            ? `${
                                axios.defaults.baseURL
                              }/uploads/${artist.thumbnailPath.replace(
                                /^src[\\/]/,
                                ""
                              )}`
                            : ArtistLogo
                        }
                        alt={artist.name}
                        className="slider-bar-artist-image"
                      />
                      <div className="slider-bar-artist-info">
                        <div className="slider-bar-artist-name">
                          {artist.name}
                        </div>
                        <div className="slider-bar-artist-role">Artist</div>
                      </div>
                      {isHovered("followedArtists", artist.id) && (
                        <div className="slider-bar-artist-icon">
                          <div className="slider-bar-artist-hover-icon">
                            <CaretRightOutlined />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="slider-bar-lists">
                  {followedAlbums.map((album) => (
                    <div
                      key={`album-${album.id || album.name}`}
                      className="slider-bar-list"
                      onMouseEnter={() =>
                        handleMouseEnter("followedItems", album.id)
                      }
                      onMouseLeave={handleMouseLeave}
                      onClick={() => handleItemClick("Album", album)}>
                      <img
                        src={
                          album.thumbnailPath
                            ? `${
                                axios.defaults.baseURL
                              }/${album.thumbnailPath.replace(/^src[\\/]/, "")}`
                            : AlbumLogo
                        }
                        alt="Album thumbnail"
                        className="slider-bar-image"
                      />
                      <div className="slider-bar-info">
                        <div className="slider-bar-name">{album.name}</div>
                        <div className="slider-bar-role">Album</div>
                      </div>
                      {isHovered("followedAlbums", album.id) && (
                        <div className="slider-bar-icon">
                          <div className="slider-bar-hover-icon">
                            <CaretRightOutlined />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="slider-bar-placeholder-message">
                Please log in to see your library.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="slider-bar-wrapper">
          <div className="library" onClick={handleToggle}>
            {/* Toggle Button */}
            <div
              className="slider-bar-toggle-button"
              onMouseEnter={() => setHoveredItem({ list: "toggle", index: 0 })}
              onMouseLeave={handleMouseLeave}
              style={{
                width: "60px",
                height: "60px",
                backgroundColor: isHovered("toggle", 0)
                  ? "rgba(255, 255, 255, 0.3)"
                  : "rgba(74, 74, 74, 0.3)",
                transform: "translate(-50%, -50%)",
                borderRadius: "10px",
                transition: "background-color 0.3s ease",
                marginLeft: "30px",
                marginTop: "45px",
              }}>
              <div
                className="slider-bar-toggle-icon"
                style={{
                  fontSize: "36px",
                  margin: "12px 12px auto",
                }}>
                <UnorderedListOutlined />
              </div>
            </div>
          </div>
          {/* Collapsed Sidebar Content */}
          <div className="slider-bar-content">
            <div className="slider-bar-lists">
              {playlists.map((playlist) => (
                <div
                  key={`playlist-${playlist.playlistId}`}
                  className="slider-bar-list"
                  style={{ width: "70px" }}
                  onMouseEnter={() =>
                    handleMouseEnter("playlists", playlist.playlistId)
                  }
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleItemClick("Playlist", playlist)}>
                  <img
                    src={
                      playlist.thumbnailPath
                        ? `${
                            axios.defaults.baseURL
                          }/${playlist.thumbnailPath.replace(/^src[\\/]/, "")}`
                        : PlaylistLogo
                    }
                    alt="PLaylist thumbnail"
                    className="slider-bar-image"
                  />
                  {isHovered("playlists", playlist.playlistId) && (
                    <div className="slider-bar-icon" style={{ left: "50%" }}>
                      <div className="slider-bar-hover-icon">
                        <CaretRightOutlined />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="slider-bar-lists">
              {followedArtists.map((artist) => (
                <div
                  key={`artist-${artist.id}`}
                  className="slider-bar-list"
                  style={{ width: "70px" }}
                  onMouseEnter={() =>
                    handleMouseEnter("followedArtists", artist.id)
                  }
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleItemClick("Artist", artist)}>
                  <img
                    src={
                      artist.thumbnailPath
                        ? `${
                            axios.defaults.baseURL
                          }/uploads/${artist.thumbnailPath.replace(
                            /^src[\\/]/,
                            ""
                          )}`
                        : ArtistLogo
                    }
                    alt={artist.name}
                    className="slider-bar-artist-image"
                  />
                  {isHovered("followedArtists", artist.id) && (
                    <div
                      className="slider-bar-artist-icon"
                      style={{ left: "50%" }}>
                      <div className="slider-bar-artist-hover-icon">
                        <CaretRightOutlined />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="slider-bar-lists">
              {followedAlbums.map((album) => (
                <div
                  key={`album-${album.id}`}
                  className="slider-bar-list"
                  style={{ width: "70px" }}
                  onMouseEnter={() =>
                    handleMouseEnter("followedAlbums", album.id)
                  }
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleItemClick("Album", album)}>
                  <img
                    src={
                      album.thumbnailPath
                        ? `${
                            axios.defaults.baseURL
                          }/${album.thumbnailPath.replace(/^src[\\/]/, "")}`
                        : AlbumLogo
                    }
                    alt="Album thumbnail"
                    className="slider-bar-image"
                  />
                  {isHovered("followedAlbums", album.id) && (
                    <div className="slider-bar-icon" style={{ left: "50%" }}>
                      <div className="slider-bar-hover-icon">
                        <CaretRightOutlined />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SiderBar;
