import React from 'react';
import './content.css';

const SongContent = () => {
  const handleTitleClick = (title) => {
    alert(`You clicked on ${title}`);
  };
  return (
    <div className="header-content-1">
      <div className="content-1">
        <h1 onClick={() => handleTitleClick('Top Songs')}>Top Songs</h1>
      </div>
      <div className="content-1">
        <h1 onClick={() => handleTitleClick('Top Songs')}>New Songs</h1>
      </div>
      <div className="content-1">
        <h1 onClick={() => handleTitleClick('Top Songs')}>New Songs 1</h1>
      </div>
    </div>
  );
};

export default SongContent;
