import React, { useState, useRef } from 'react';
import './sider.css';

const SiderBar = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [width, setWidth] = useState(250); // Set default width state
  const sidebarRef = useRef(null); // Ref to sidebar for resizing
  console.log('>>> Chech selected', selectedItem);

  const playlists = ['Liked Songs', 'My Playlist #1', 'New Folder'];
  const artists = ['Justin Bieber', 'Maroon 5', 'Ed Sheeran'];

  const handleClick = (item) => {
    setSelectedItem(item);
  };

  // Resize handler function
  const handleMouseDown = (e) => {
    const startX = e.clientX;
    const startWidth = sidebarRef.current.offsetWidth;

    const handleMouseMove = (e) => {
      const newWidth = startWidth + (e.clientX - startX);
      setWidth(newWidth); // Update width state
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      className="slider-bar"
      style={{ width: `${width}px` }}
      ref={sidebarRef}
    >
      <div className="slider-bar-header">
        <h3>Your Library</h3>
        <div className="slider-bar-tabs">
          <button className="tab">Playlists</button>
          <button className="tab">Artists</button>
        </div>
      </div>
      <div className="slider-bar-content">
        <div className="playlists">
          {playlists.map((playlist, index) => (
            <div
              key={index}
              className="playlist-item"
              onClick={() => handleClick(playlist)}
            >
              {playlist}
            </div>
          ))}
        </div>
        <div className="artists">
          {artists.map((artist, index) => (
            <div
              key={index}
              className="artist-item"
              onClick={() => handleClick(artist)}
            >
              {artist}
            </div>
          ))}
        </div>
      </div>
      {selectedItem && (
        <div className="selected-item">{`Selected: ${selectedItem}`}</div>
      )}
      <div className="resize-handle" onMouseDown={handleMouseDown}></div>{' '}
      {/* Resize handle */}
    </div>
  );
};

export default SiderBar;
