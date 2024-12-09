import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Song from '../../components/song';
import Artist from '../../components/artist';
import Album from '../../components/album';
import '../../assets/styles/home.css';

const HomePage = () => {

  const [itemsToShow, setItemsToShow] = useState({
    songs: 10,
    artists: 6,
    albums: 6,
  });

  useEffect(() => {
    const mainContent = document.querySelector('.main-content');

    const handleResize = () => {
      if (mainContent) {
        const width = mainContent.offsetWidth;

        console.log("Main content width:", width); // Debug log

        if (width < 1400) {
          setItemsToShow({ songs: 4, artists: 3, albums: 3 });
        } else if (width < 1700) {
          setItemsToShow({ songs: 6, artists: 4, albums: 4 });
        } else if (width < 1800) {
          setItemsToShow({ songs: 6, artists: 5, albums: 5 });
        } else if (width < 2050){
          setItemsToShow({ songs: 8, artists: 5, albums: 5 });
        } else if (width < 2230){
          setItemsToShow({ songs: 8, artists: 6, albums: 6 });
        } else {
          setItemsToShow({ songs: 10, artists: 6, albums: 6 });
        }
      }
    };

    // Khởi tạo ResizeObserver
    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    if (mainContent) {
      resizeObserver.observe(mainContent); // Theo dõi kích thước của main-content
    }

    handleResize(); // Gọi để thiết lập ban đầu

    return () => {
      if (mainContent) {
        resizeObserver.unobserve(mainContent); // Dừng theo dõi khi component unmount
      }
      resizeObserver.disconnect(); // Dọn dẹp observer
    };
  }, []);

  return (
    <div className="home-content">
      <div className="title-header">
        <h2 className="title">Popular Music</h2>
        <Link to="/">See more</Link>
      </div>
      <Song itemsToShow={itemsToShow.songs} />

      <div className="title-header">
        <h2 className="title">Popular Artists</h2>
        <Link to="/">See more</Link>
      </div>
      <Artist itemsToShow={itemsToShow.artists} />

      <div className="title-header">
        <h2 className="title">Popular Albums</h2>
        <Link to="/">See more</Link>
      </div>
      <Album itemsToShow={itemsToShow.albums} />
    </div>
  );
};

export default HomePage;
