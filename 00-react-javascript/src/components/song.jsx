import React, { useState } from "react";
import { CaretRightOutlined } from "@ant-design/icons";
import '../assets/styles/song.css';

const Song = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const songs = [
    { img: "", title: "Only Girl (In the World)", artist: "Rihanna" },
    { img: "https://upload.wikimedia.org/wikipedia/vi/3/39/Umbrella-rihanna.jpg", title: "Umbrella", artist: "Rihanna" },
    { img: "https://upload.wikimedia.org/wikipedia/en/c/c2/Rude_Boy_cover.png", title: "Rude Boy", artist: "Rihanna" },
    { img: "https://upload.wikimedia.org/wikipedia/en/a/a8/Hey_Daddy_%28Daddy%27s_Home%29.jpg", title: "Hey Daddy (Daddy's Home)", artist: "Usher" },
    { img: "https://upload.wikimedia.org/wikipedia/en/3/3e/Thinking_Out_Loud_cover.png", title: "Thinking Out Loud", artist: "Ed Sheeran" },
    { img: "https://upload.wikimedia.org/wikipedia/en/9/91/WDKYSingleCover.jpg", title: "Stronger", artist: "Kelly Clarkson" },
    { img: "https://upload.wikimedia.org/wikipedia/en/f/fc/Mockingbird_%28Eminem_song%29_cover.jpg", title: "Mockingbird", artist: "Eminem" },
    { img: "https://upload.wikimedia.org/wikipedia/en/b/b9/Taylor_Swift_-_Anti-Hero.png", title: "Anti-Hero", artist: "Taylor Swift" },
  ];

  const handleTitleClick = () => {
    window.location.href = '/login';  // Redirects to /login page
  };  

  return (
    <div className="song-wrapper">
      {songs.map((song, index) => (
        <div
          key={index}
          className="song"
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          onClick={() => handleTitleClick(song.title)}>
          {song.img ? (
            <img src={song.img} alt={song.title} className="song-image" />
          ) : (
            <div className="song-placeholder">
              <CaretRightOutlined className="song-placeholder-icon" />
            </div>
          )}
          <div className="song-info">
            <div className="song-name">{song.title}</div>
            <div className="song-artist">{song.artist}</div>
          </div>
          {hoveredIndex === index && (
            <div className="song-icon">
              <div className="song-hover-icon">
                <CaretRightOutlined />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Song;
