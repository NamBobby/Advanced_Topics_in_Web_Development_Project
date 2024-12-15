import React from "react";
import { Link } from 'react-router-dom';
import SongUser from "../../components/songuser";
import AlbumUser from "../../components/albumuser";
import PlaylistUser from "../../components/playlistuser";
import "../../assets/styles/userInfo.css";

const UserInfo = () => {
  return (
    
      <div className="userinfo-overlay">
        <div className="userinfo-background">
          <div className="userinfo-header">
            <p className="user-role">Artist</p>
            <h3 className="user-name">John Doe</h3>
          </div>
        <div className="userinfo-content">
          <div className="title-header">
            <h2 className="title">Music</h2>
          </div>
          <SongUser />
          <div className="title-header">
            <h2 className="title">Albums</h2>
            <Link to="/userAlbum">See more</Link>
          </div>
          <AlbumUser />
          <div className="title-header">
            <h2 className="title">Playlists</h2>
            <Link to="/userPlaylist">See more</Link>
          </div>
          <PlaylistUser />
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
