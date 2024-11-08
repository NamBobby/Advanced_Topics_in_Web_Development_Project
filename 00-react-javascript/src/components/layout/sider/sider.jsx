import React, { useState, useRef } from 'react';
import './sider.css';

const SiderBar = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [width, setWidth] = useState(250); // Set default width state
  const sidebarRef = useRef(null); // Ref to sidebar for resizing
  console.log('>>> Check selected', selectedItem);

  const playlists = ['Liked Songs', 'My Playlist #1', 'New Folder'];

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
      
      {/* Navigation Buttons */}
      <div className="sidebar-navigation">
        <button className="nav-button" onClick={() => handleClick('Home')}>Home</button>
        <button className="nav-button" onClick={() => handleClick('Explore')}>Explore</button>
        <button className="nav-button" onClick={() => handleClick('Library')}>Library</button>
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
      </div>
      <div className="resize-handle" onMouseDown={handleMouseDown}></div>{' '}
      {/* Resize handle */}
    </div>
  );
};

export default SiderBar;
