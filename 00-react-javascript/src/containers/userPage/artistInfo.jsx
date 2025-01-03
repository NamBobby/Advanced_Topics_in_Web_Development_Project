import React, { useEffect, useState } from "react";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import Album from "../../components/album";
import "../../assets/styles/userInfo.css";
import {
  getMusicsApi,
  getAlbumsApi,
  getUserApi,
} from "../../services/apiService";
import axios from "../../services/axios.customize";
import { LeftOutlined } from "@ant-design/icons";
import FollowButton from "../../components/followButton";
import SongArtist from "../../components/songartist";
import ArtistLogo from "../../assets/images/artistlogo.png";

const getItemsToShow = (width) => {
  if (width < 1100) {
    return { albums: 2 };
  } else if (width < 1407) {
    return { albums: 3 };   
  } else if (width < 1430) {
    return { albums: 4 };
  } else if (width < 1630) {
    return { albums: 4 };
  } else if (width < 2100) {
    return {  albums: 5 };
  } else {
    return { albums: 6 };
  }
};

const ArtistInfo = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [artist, setArtist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const { setCurrentSong, setSongList } = useOutletContext();
  const [itemsToShow, setItemsToShow] = useState(() => {
      const mainContent = document.querySelector(".main-content");
      return mainContent ? getItemsToShow(mainContent.offsetWidth) : { songs: 6, artists: 4, albums: 4 };
    });

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
      } 
    };

    fetchArtistData();
  }, [id, navigate]);


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
            artist?.avatarPath
              ? `${axios.defaults.baseURL}/uploads/${artist.avatarPath.replace(
                  /^src[\\/]/,
                  ""
                )}`
              : ArtistLogo
          }
          alt={artist?.name}
          className="avatar-image"
        />
        <div className="userinfo-header-background">
          <p className="user-role">Artist</p>
          <div className="user-artist-role">
            <h3 className="user-name">{artist?.name}</h3>
            <FollowButton followType="Artist" followId={artist?.id} />
          </div>   
        </div>
      </div>
      <div className="userinfo-content">
        <div className="userinfo-header">
          <h2 className="title">Music</h2>
        </div>
        <SongArtist
          songs={songs}
          handleSongClick={(song) => {
            setCurrentSong(song);
            setSongList(songs);
          }}
        />
        <div className="userinfo-header">
          <h2 className="title">Albums</h2>
          <div className="see-more-less-control">
            {itemsToShow.albums < albums.length && (
              <div
                className="see-more-less"
                onClick={() => handleSeeMore("albums", albums.length)}>
                See More
              </div>
            )}
            {itemsToShow.albums > getItemsToShow(document.querySelector(".main-content")?.offsetWidth || 0).albums && (
              <div
                className="see-more-less"
                onClick={() => handleSeeLess("albums")}>
                See Less
              </div>
            )}
          </div>
        </div>
        <Album itemsToShow={itemsToShow.albums} albums={albums} />
      </div>
    </div>
  );
};

export default ArtistInfo;
