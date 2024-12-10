import React from "react";
import Song from "../../components/song";
import Album from "../../components/album";
import "../../assets/styles/userInfo.css";

const UserInfo = () => {
  return (
    
      <div className="user-info-overlay">
        <div className="background-container">
          <div className="user-detail">
            <p className="user-role">Artist</p>
            <h3 className="user-name">John Doe</h3>
          </div>
        <div className="userinfo-content">
          <div className="title-header">
            <h2 className="title">Music</h2>
          </div>
          <Song />
          <div className="title-header">
            <h2 className="title">Albums</h2>
          </div>
          <Album />
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
