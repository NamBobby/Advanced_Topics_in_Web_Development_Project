import React, { useState } from "react";
import { CaretRightOutlined} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "../assets/styles/artist.css";
import axios from "../services/axios.customize";
import ArtistLogo from "../assets/images/artistlogo.png";


const Artist = ({ artists, itemsToShow }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const navigate = useNavigate();

  const handleArtistClick = (artist) => {
    const artistName = artist.name.replace(/\s+/g, "-").toLowerCase();
    navigate(`artist/${artistName}`, { state: { artist } });
  };


  return (
    <div className="artist-wrapper">
      {artists.length > 0 ? (
        artists.slice(0, itemsToShow).map((artist, artistid) => (
          <div
            key={artistid}
            className="artist"
            onClick={() => handleArtistClick(artist)}
            onMouseEnter={() => setHoveredIndex(artistid)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {artist.avatarPath ? (
              <img
                src={`${axios.defaults.baseURL}/uploads/${artist.avatarPath.replace(/^src[\\/]/, "")}`}
                alt={artist.name}
                className="artist-image"
              />
            ) : (
              <div className="artist-placeholder">
                <img src={ArtistLogo} alt="Artist Logo" className="artist-placeholder-icon" />
              </div>
            )}
            <div className="artist-info">
              <div className="artist-name">{artist.name}</div>
              <div className="artist-role">Artist</div>
            </div>
            {hoveredIndex === artistid && (
              <div className="artist-icon">
                <div className="artist-hover-icon">
                  <CaretRightOutlined />
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <div>No artists found</div>
      )}
    </div>
  );
};

export default Artist;
