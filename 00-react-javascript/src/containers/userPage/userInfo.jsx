import React, { useEffect, useState, useCallback } from "react";
import {
  Link,
  useLocation,
  useOutletContext,
  useNavigate,
} from "react-router-dom";
import SongUser from "../../components/songuser";
import AlbumUser from "../../components/albumuser";
import PlaylistUser from "../../components/playlistuser";
import { LeftOutlined, PlusCircleOutlined } from "@ant-design/icons";
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

  
  const fetchUserData = useCallback(async () => {
    try {
      if (user?.id) {
        const songsResponse = await getMusicsApi();
        const userSongs = songsResponse.filter(
          (song) => song.accountId === user.id
        );
        setSongs(userSongs);

        const albumsResponse = await getAlbumsApi();
        const userAlbums = albumsResponse.filter(
          (album) => album.accountId === user.id
        );
        setAlbums(userAlbums);

        const playlistsResponse = await getPlaylistsApi();
        const userPlaylists = playlistsResponse.filter(
          (playlist) => playlist.accountId === user.id
        );
        setPlaylists(userPlaylists);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } 
  }, [user?.id]);

    useEffect(() => {
      fetchUserData();
  
      const handleAuthUpdate = () => {
        fetchUserData(); 
      };
  
      window.addEventListener("authUpdate", handleAuthUpdate);
  
      return () => {
        window.removeEventListener("authUpdate", handleAuthUpdate);
      };
    }, [fetchUserData]);

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
        <div className="userinfo-header-background">
          <p className="user-role">{user.role}</p>
          <h3 className="user-name">{user.name}</h3>
        </div>
      </div>
      <div className="userinfo-content">
        {user.role === "Artist" && (
          <>
            <div className="userinfo-header">
              <h2 className="title">Music</h2>
              <div className="userinfo-logo">
                <Link to="/uploadmusic" state={{ user }}>
                  <PlusCircleOutlined className="userinfo-upload-icon" />
                </Link>
              </div>
            </div>
            <SongUser
              songs={songs}
              handleSongClick={(song) => {
                setCurrentSong(song);
                setSongList(songs);
              }}
            />
            <div className="userinfo-header">
              <h2 className="title">Albums</h2>
              <div className="userinfo-logo">
                <Link to="/createalbum" state={{ user }}>
                  <PlusCircleOutlined className="userinfo-upload-icon" />
                </Link>
              </div>
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
        <div className="userinfo-header">
          <h2 className="title">Playlists</h2>
          <div className="userinfo-logo">
            <Link to="/createplaylist" state={{ user }}>
              <PlusCircleOutlined className="userinfo-upload-icon" />
            </Link>
          </div>
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
        <PlaylistUser
          itemsToShow={itemsToShow.playlists}
          playlists={playlists}
        />
      </div>
    </div>
  );
};

export default UserInfo;
