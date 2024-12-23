import React, { useState, useEffect } from "react";
import Header from "./components/header";
import Footer from "./components/footer";
import SiderBar from "./components/sider";
import { Outlet } from "react-router-dom";
import "./global.css";

const MainLayout = () => {
  const [currentSong, setCurrentSong] = useState(null);
  const [songList, setSongList] = useState([]); 

  return (
    <div className="main-layout">
      <Header />
      <div className="app-container">
        <SiderBar />
        <div className="main-content">
          <Outlet context={{ setCurrentSong, setSongList }} />
        </div>
      </div>
      <Footer
        currentSong={currentSong}
        songList={songList}
        setCurrentSong={setCurrentSong}
      />
    </div>
  );
};

export default MainLayout;
