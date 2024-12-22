import React, { useEffect, useState } from "react";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import SongUser from "../../components/songuser";
import AlbumUser from "../../components/albumuser";
import "../../assets/styles/userInfo.css";
import { getMusicsApi, getAlbumsApi, getUserApi } from "../../services/apiService";
import axios from "../../services/axios.customize";
import { LeftOutlined } from "@ant-design/icons";

const ArtistInfo = () => {
  const { id } = useParams(); // Get artist ID from URL
  const navigate = useNavigate();

  const [artist, setArtist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setCurrentSong, setSongList } = useOutletContext();

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        // Fetch artist details
        const usersResponse = await getUserApi();
        const foundArtist = usersResponse.find(
          (user) => user.id.toString() === id && user.role === "Artist"
        );

        if (foundArtist) {
          setArtist(foundArtist);
        } else {
          throw new Error("Artist not found");
        }

        // Fetch songs and albums for the artist
        const songsResponse = await getMusicsApi();
        const artistSongs = songsResponse.filter(
          (song) => song.accountId.toString() === id
        );
        setSongs(artistSongs);

        const albumsResponse = await getAlbumsApi();
        const artistAlbums = albumsResponse.filter(
          (album) => album.accountId.toString() === id
        );
        setAlbums(artistAlbums);
      } catch (error) {
        console.error("Error fetching artist data:", error);
        navigate("/"); // Redirect to home if artist not found
      } finally {
        setLoading(false);
      }
    };

    fetchArtistData();
  }, [id, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!artist) {
    return <div>Artist not found</div>;
  }

  const handleBackClick = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div className="userinfo-overlay">
      <div className="userinfo-background">
        <div className="logo-back">
          <LeftOutlined className="back-icon" onClick={handleBackClick} />
        </div>
        <img
          src={
            artist.avatarPath
              ? `${axios.defaults.baseURL}/uploads/${artist.avatarPath.replace(/^src[\\/]/, "")}`
              : "https://via.placeholder.com/400"
          }
          alt={artist.name}
          className="avatar-image"
        />
        <div className="userinfo-header">
          <p className="user-role">Artist</p>
          <h3 className="user-name">{artist.name}</h3>
        </div>
      </div>
      <div className="userinfo-content">
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
        </div>
        <AlbumUser albums={albums} />
      </div>
    </div>
  );
};

export default ArtistInfo;