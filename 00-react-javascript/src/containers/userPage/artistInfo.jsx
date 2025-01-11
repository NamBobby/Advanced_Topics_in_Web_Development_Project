import React, { useEffect, useState, useContext } from "react";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import AlbumArtist from "../../components/albumartist";
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
import { AuthContext } from "../../components/auth.context";

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
    return { albums: 5 };
  } else {
    return { albums: 6 };
  }
};

const ArtistInfo = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
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
        const usersResponse = await getUserApi();
        //console.log("Users Response:", usersResponse);
  
      const formattedName = name.replace(/\s+/g, "-").toLowerCase();
      const foundArtist = usersResponse.find(
        (user) => user.name.replace(/\s+/g, "-").toLowerCase() === formattedName && user.role === "Artist"
      );
  
        if (!foundArtist) {
          console.error(`Artist with name ${name} not found. Response:`, usersResponse);
          throw new Error("Artist not found");
        }
  
        setArtist(foundArtist);
  
        const songsResponse = await getMusicsApi();
        //console.log("Songs Response:", songsResponse);
  
        const artistSongs = songsResponse.filter(
          (song) => song.artist === foundArtist.name
        );
        setSongs(artistSongs);
  
        const albumsResponse = await getAlbumsApi();
        //console.log("Albums Response:", albumsResponse);
  
        const artistAlbums = albumsResponse.filter(
          (album) => album.artist === foundArtist.name
        );
        setAlbums(artistAlbums);
      } catch (error) {
        console.error("Error fetching artist data:", error);
        navigate("/"); 
      }
    };
  
    fetchArtistData();
  }, [name, navigate]);  

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
            {auth.isAuthenticated && (
              <FollowButton followType="Artist" followId={artist?.accountId} />
            )}
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
        <AlbumArtist itemsToShow={itemsToShow.albums} albums={albums} />
      </div>
    </div>
  );
};

export default ArtistInfo;
