import React from 'react';
import { Link } from 'react-router-dom';
import Content from '../../components/content';
import Artist from '../../components/artist';
import Album from '../../components/album';
import '../../assets/styles/home.css';

const HomePage = () => {
  return (
    <div>
      <div className="title-header">
        <h2 className="title">Popular Music</h2>
        <Link to="/">See more</Link>
      </div>
      <Content />

      <div className="title-header">
        <h2 className="title">Popular Artists</h2>
        <Link to="/">See more</Link>
      </div>
      <Artist />

      <div className="title-header">
        <h2 className="title">Popular Albums</h2>
        <Link to="/">See more</Link>
      </div>
      <Album />
    </div>
  );
};

export default HomePage;
