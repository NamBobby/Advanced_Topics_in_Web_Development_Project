import React, { useEffect, useState } from "react";
import { Link, useLocation, useOutletContext } from "react-router-dom";
import SongUser from "../../components/songuser";
import "../../assets/styles/userInfo.css";
import { getMusicsApi, getAlbumsApi } from "../../services/apiService";
import axios from "../../services/axios.customize";
import AlbumUser from "../../components/albumuser";

const ArtistInfo = () => {
  const location = useLocation();
  const artist = location.state?.artist;
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setCurrentSong, setSongList } = useOutletContext();

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        if (artist?.id) {
          const songsResponse = await getMusicsApi();
          const artistSongs = songsResponse.filter(
            (song) => song.accountId === artist.id
          );
          setSongs(artistSongs);

          const albumsResponse = await getAlbumsApi();
          console.log("Fetched Albums:", albumsResponse);
          const albumsSongs = albumsResponse.filter(
            (album) => album.accountId === artist.id
          );
          setAlbums(albumsSongs);
        }
      } catch (error) {
        console.error("Error fetching artist data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtistData();
  }, [artist]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="userinfo-overlay">
      <div className="userinfo-background">
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
          <Link to="/userAlbum">See more</Link>
        </div>
        <AlbumUser albums={albums}/>
      </div>
    </div>
  );
};

export default ArtistInfo;
