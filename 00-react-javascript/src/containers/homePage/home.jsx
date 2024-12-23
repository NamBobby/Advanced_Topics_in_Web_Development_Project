import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import Song from "../../components/song";
import Artist from "../../components/artist";
import Album from "../../components/album";
import { getUserApi, getMusicsApi, getAlbumsApi } from "../../services/apiService"; 
import "../../assets/styles/home.css";

const HomePage = () => {
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setCurrentSong, setSongList } = useOutletContext();
  const [itemsToShow, setItemsToShow] = useState({
    songs: 10,
    artists: 6,
    albums: 6,
  });

  // Hàm xử lý thay đổi kích thước màn hình
  useEffect(() => {
    const mainContent = document.querySelector(".main-content");
    const handleResize = () => {
      if (mainContent) {
        const width = mainContent.offsetWidth;

        if (width < 1400) {
          setItemsToShow({ songs: 4, artists: 3, albums: 3 });
        } else if (width < 1700) {
          setItemsToShow({ songs: 6, artists: 4, albums: 4 });
        } else if (width < 1800) {
          setItemsToShow({ songs: 6, artists: 5, albums: 5 });
        } else if (width < 2050) {
          setItemsToShow({ songs: 8, artists: 5, albums: 5 });
        } else if (width < 2230) {
          setItemsToShow({ songs: 8, artists: 6, albums: 6 });
        } else {
          setItemsToShow({ songs: 10, artists: 6, albums: 6 });
        }
      }
    };
    

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

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
    const fetchArtists = async () => {
      try {
        const response = await getUserApi();
        console.log("API Response:", response); 

        
        const data = response?.data || response; 
        console.log("Data fetched: ", data); 

        const filteredArtists = data.filter(
          (user) => user.role && user.role === "Artist"
        );
        console.log("Filtered artists:", filteredArtists); 

        setArtists(filteredArtists);
      } catch (error) {
        console.error("Error fetching data:", error);
        setArtists([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, []);

  useEffect(() => {
    const fetchMusics = async () => {
      try {
        const response = await getMusicsApi();
        console.log("Music API Response:", response);
        setSongs(response || []);
        setSongList(response || []); 
      } catch (error) {
        console.error("Error fetching musics:", error);
        setSongs([]);
      }
    };
  
    fetchMusics();
  }, [setSongList]); 

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await getAlbumsApi();
        console.log("Album API Response:", response);
        setAlbums(response || []);
      } catch (error) {
        console.error("Error fetching albums:", error);
        setAlbums([]);
      }
    };

    fetchAlbums();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="home-content">
      <div className="title-header">
        <h2 className="title">Popular Music</h2>
        <Link to="/">See more</Link>
      </div>
      <Song 
      itemsToShow={itemsToShow.songs} 
      songs={songs}
      handleSongClick={(song) => {
        setCurrentSong(song);
        setSongList(songs); 
      }} />

      <div className="title-header">
        <h2 className="title">Popular Artists</h2>
        <Link to="/">See more</Link>
      </div>
      <Artist itemsToShow={itemsToShow.artists} artists={artists} />
      <div className="title-header">
        <h2 className="title">Popular Albums</h2>
        <Link to="/">See more</Link>
      </div>
      <Album itemsToShow={itemsToShow.albums} albums={albums} />
    </div>
  );
};

export default HomePage;
