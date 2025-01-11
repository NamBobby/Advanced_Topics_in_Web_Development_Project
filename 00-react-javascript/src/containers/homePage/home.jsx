import React, { useState, useEffect } from "react";
import { useOutletContext, useLocation } from "react-router-dom";
import Song from "../../components/song";
import Artist from "../../components/artist";
import Album from "../../components/album";
import {
  getUserApi,
  getMusicsApi,
  getAlbumsApi,
} from "../../services/apiService";
import "../../assets/styles/home.css";
import { shuffleArray } from "../../utils/shuffle";

const getItemsToShow = (width) => {
  if (width < 1200) {
    return { songs: 4, artists: 2, albums: 2 };
  } else if (width < 1330) {
    return { songs: 4, artists: 3, albums: 3 };
  } else if (width < 1430) {
    return { songs: 6, artists: 3, albums: 3 };
  } else if (width < 1800) {
    return { songs: 6, artists: 4, albums: 4 };
  } else if (width < 1820) {
    return { songs: 8, artists: 5, albums: 5 };
  } else if (width < 2100) {
    return { songs: 8, artists: 5, albums: 5 };
  } else {
    return { songs: 10, artists: 6, albums: 6 };
  }
};

const HomePage = () => {
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [songs, setSongs] = useState([]);
  const { setCurrentSong, setSongList } = useOutletContext();
  const location = useLocation();

  const [itemsToShow, setItemsToShow] = useState(() => {
    const mainContent = document.querySelector(".main-content");
    return mainContent
      ? getItemsToShow(mainContent.offsetWidth)
      : { songs: 6, artists: 4, albums: 4 };
  });

  const [searchMode, setSearchMode] = useState(false);
  const [searchResults, setSearchResults] = useState({
    music: [],
    albums: [],
    artists: [],
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

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await getUserApi();
        const data = response?.data || response;
        const filteredArtists = shuffleArray(data.filter(
          (user) => user.role && user.role === "Artist"
        ));
        setArtists(filteredArtists);
      } catch (error) {
        console.error("Error fetching artists:", error);
        setArtists([]);
      }
    };

    const fetchMusics = async () => {
      try {
        const response = await getMusicsApi();
        setSongs(shuffleArray(response || []));
        setSongList(shuffleArray(response || []));
      } catch (error) {
        console.error("Error fetching musics:", error);
        setSongs([]);
      }
    };

    const fetchAlbums = async () => {
      try {
        const response = await getAlbumsApi();
        setAlbums(shuffleArray(response || []));
      } catch (error) {
        console.error("Error fetching albums:", error);
        setAlbums([]);
      }
    };

    if (!searchMode) {
      fetchArtists();
      fetchMusics();
      fetchAlbums();
    }
  }, [searchMode, setSongList]);

  useEffect(() => {
    if (location.state) {
      setSearchResults(location.state);
      setSearchMode(true);
    } else {
      setSearchMode(false);
    }
  }, [location.state]);

  return (
    <div className="home-content">
      <div className="title-header">
        <h2 className="title">Popular Music</h2>
        <div className="see-more-less-control">
          {itemsToShow.songs < songs.length && (
            <div
              className="see-more-less"
              onClick={() => handleSeeMore("songs", songs.length)}
            >
              See More
            </div>
          )}
          {itemsToShow.songs >
            getItemsToShow(
              document.querySelector(".main-content")?.offsetWidth || 0
            ).songs && (
            <div
              className="see-more-less"
              onClick={() => handleSeeLess("songs")}
            >
              See Less
            </div>
          )}
        </div>
      </div>
      <Song
        itemsToShow={itemsToShow.songs}
        songs={searchMode ? searchResults.music : songs}
        handleSongClick={(song) => {
          setCurrentSong(song);
          setSongList(searchMode ? searchResults.music : songs);
        }}
      />

      <div className="title-header">
        <h2 className="title">Popular Artists</h2>
        <div className="see-more-less-control">
          {itemsToShow.artists < artists.length && (
            <div
              className="see-more-less"
              onClick={() => handleSeeMore("artists", artists.length)}
            >
              See More
            </div>
          )}
          {itemsToShow.artists >
            getItemsToShow(
              document.querySelector(".main-content")?.offsetWidth || 0
            ).artists && (
            <div
              className="see-more-less"
              onClick={() => handleSeeLess("artists")}
            >
              See Less
            </div>
          )}
        </div>
      </div>
      <Artist
        itemsToShow={itemsToShow.artists}
        artists={searchMode ? searchResults.artists : artists}
      />

      <div className="title-header">
        <h2 className="title">Popular Albums</h2>
        <div className="see-more-less-control">
          {itemsToShow.albums < albums.length && (
            <div
              className="see-more-less"
              onClick={() => handleSeeMore("albums", albums.length)}
            >
              See More
            </div>
          )}
          {itemsToShow.albums >
            getItemsToShow(
              document.querySelector(".main-content")?.offsetWidth || 0
            ).albums && (
            <div
              className="see-more-less"
              onClick={() => handleSeeLess("albums")}
            >
              See Less
            </div>
          )}
        </div>
      </div>
      <Album
        itemsToShow={itemsToShow.albums}
        albums={searchMode ? searchResults.albums : albums}
      />
    </div>
  );
};

export default HomePage;
