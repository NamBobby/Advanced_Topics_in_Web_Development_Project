import React, { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useOutletContext,
  useNavigate,
} from "react-router-dom";
import SongUser from "../../components/songuser";
import AlbumUser from "../../components/albumuser";
import PlaylistUser from "../../components/playlistuser";
import { LeftOutlined } from "@ant-design/icons";
import {
  getMusicsApi,
  getAlbumsApi,
  getPlaylistsApi,
} from "../../services/apiService";
import "../../assets/styles/userInfo.css";
import axios from "../../services/axios.customize";

const getItemsToShow = (width) => {
  if (width < 1100) {
    return { playlists: 2, albums: 2 };
  } else if (width < 1407) {
    return { playlists: 3, albums: 3 };
  } else if (width < 1430) {
    return { playlists: 4, albums: 4 };
  } else if (width < 1630) {
    return { playlists: 4, albums: 4 };
  } else if (width < 2100) {
    return { playlists: 5, albums: 5 };
  } else {
    return { playlists: 5, albums: 6 };
  }
};

const UserInfo = () => {
  const location = useLocation();
  const user = location.state?.user;
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setCurrentSong, setSongList } = useOutletContext();
  const [itemsToShow, setItemsToShow] = useState(() => {
    const mainContent = document.querySelector(".main-content");
    return mainContent
      ? getItemsToShow(mainContent.offsetWidth)
      : { songs: 6, artists: 4, albums: 4 };
  });
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const mainContent = document.querySelector(".main-content");
      if (mainContent) {
        const width = mainContent.offsetWidth;
        setItemsToShow(getItemsToShow(width));
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    const mainContent = document.querySelector(".main-content");

    if (mainContent) {
      resizeObserver.observe(mainContent);
    }

    handleResize();

    return () => {
      if (mainContent) {
        resizeObserver.unobserve(mainContent);
      }
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (user?.id) {
          // Fetch and filter songs for the logged-in user
          const songsResponse = await getMusicsApi();
          console.log("Songs API Response:", songsResponse);
          if (songsResponse) {
            const userSongs = songsResponse.filter(
              (song) => song.accountId === user.id
            );
            setSongs(userSongs);
          } else {
            console.error("Songs data not found");
          }

          // Fetch and filter albums for the logged-in user
          const albumsResponse = await getAlbumsApi();
          console.log("Albums API Response:", albumsResponse);
          if (albumsResponse) {
            const userAlbums = albumsResponse.filter(
              (album) => album.accountId === user.id
            );
            setAlbums(userAlbums);
          } else {
            console.error("Albums data not found");
          }

          // Fetch and filter playlists for the logged-in user
          const playlistsResponse = await getPlaylistsApi();
          console.log("Playlists API Response:", playlistsResponse);
          if (playlistsResponse) {
            const userPlaylists = playlistsResponse.filter(
              (playlist) => playlist.accountId === user.id
            );
            setPlaylists(userPlaylists);
          } else {
            console.error("Playlists data not found");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleSeeMore = (type, totalItems) => {
    const mainContent = document.querySelector(".main-content");
    const width = mainContent ? mainContent.offsetWidth : 0;

    setItemsToShow((prev) => ({
      ...prev,
      [type]: Math.min(prev[type] + getItemsToShow(width)[type], totalItems),
    }));
  };

  const handleSeeLess = (type) => {
    const mainContent = document.querySelector(".main-content");
    const width = mainContent ? mainContent.offsetWidth : 0;

    setItemsToShow((prev) => ({
      ...prev,
      [type]: getItemsToShow(width)[type],
    }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="userinfo-overlay">
      <div className="userinfo-background">
        <div className="logo-back">
          <LeftOutlined className="back-icon" onClick={handleBackClick} />
        </div>
        <img
          src={
            user.avatarPath
              ? `${axios.defaults.baseURL}/uploads/${user.avatarPath.replace(
                  /^src[\\/]/,
                  ""
                )}`
              : "https://via.placeholder.com/400"
          }
          alt={user.name}
          className="avatar-image"
        />
        <div className="userinfo-header">
          <p className="user-role">{user.role}</p>
          <h3 className="user-name">{user.name}</h3>
        </div>
      </div>
      <div className="userinfo-content">
        {user.role === "Artist" && (
          <>
            <div className="title-header">
              <h2 className="title">Music</h2>
            </div>
            <SongUser
              songs={songs}
              handleSongClick={(song) => {
                setCurrentSong(song);
                setSongList(songs);
              }}
            />
            <div className="title-header">
              <h2 className="title">Albums</h2>
              <div className="see-more-less-control">
                {itemsToShow.albums < albums.length && (
                  <div
                    className="see-more-less"
                    onClick={() => handleSeeMore("albums", albums.length)}>
                    See More
                  </div>
                )}
                {itemsToShow.albums >
                  getItemsToShow(
                    document.querySelector(".main-content")?.offsetWidth || 0
                  ).albums && (
                  <div
                    className="see-more-less"
                    onClick={() => handleSeeLess("albums")}>
                    See Less
                  </div>
                )}
              </div>
            </div>
            <AlbumUser itemsToShow={itemsToShow.albums} albums={albums} />
          </>
        )}
        <div className="title-header">
          <h2 className="title">Playlists</h2>
          <div className="see-more-less-control">
            {itemsToShow.playlists < playlists.length && (
              <div
                className="see-more-less"
                onClick={() => handleSeeMore("playlists", playlists.length)}>
                See More
              </div>
            )}
            {itemsToShow.playlists >
              getItemsToShow(
                document.querySelector(".main-content")?.offsetWidth || 0
              ).playlists && (
              <div
                className="see-more-less"
                onClick={() => handleSeeLess("playlists")}>
                See Less
              </div>
            )}
          </div>
        </div>
        <PlaylistUser itemsToShow={itemsToShow.playlists} playlists={playlists} />
      </div>
    </div>
  );
};

export default UserInfo;
