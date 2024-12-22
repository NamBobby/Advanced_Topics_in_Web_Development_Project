import React, { useEffect, useState } from "react";
import { Link, useLocation, useOutletContext, useNavigate } from "react-router-dom";
import SongUser from "../../components/songuser";
import AlbumUser from "../../components/albumuser";
import PlaylistUser from "../../components/playlistuser";
import { LeftOutlined } from "@ant-design/icons";
import { getMusicsApi, getAlbumsApi, getPlaylistsApi } from "../../services/apiService";
import "../../assets/styles/userInfo.css";
import axios from "../../services/axios.customize";

const UserInfo = () => {
  const location = useLocation();
  const user = location.state?.user;
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setCurrentSong, setSongList } = useOutletContext();
  const navigate = useNavigate();

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
              ? `${axios.defaults.baseURL}/uploads/${user.avatarPath.replace(/^src[\\/]/, "")}`
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
              <Link to="/userAlbum">See more</Link>
            </div>
            <AlbumUser albums={albums} />
          </>
        )}
        <div className="title-header">
          <h2 className="title">Playlists</h2>
          <Link to="/userAlbum">See more</Link>
        </div>
        <PlaylistUser playlists={playlists} />
      </div>
    </div>
  );
};

export default UserInfo;
