import React from 'react';
import '../assets/styles/content.css';

const Content = () => {
  const songs = [
    { img: "https://upload.wikimedia.org/wikipedia/vi/a/ab/Only_Girl_%28In_the_World%29.png", title: "Only Girl (In the World)", artist: "Rihanna" },
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
    <div>
      <h2 className="welcome-message">Welcome! Select a song you would like to play.</h2>
      <div className="content-wrapper">
        {songs.map((song, index) => (
          <div key={index} className="song" onClick={() => handleTitleClick(song.title)}>
            <img src={song.img} alt={song.title} />
            <div className="song-info">
              <div className="songname">{song.title}</div>
              <div className="artist">{song.artist}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Content;
