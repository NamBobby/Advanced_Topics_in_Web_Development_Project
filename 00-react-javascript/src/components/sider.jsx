import React, { useState } from "react";
import {
  ArrowLeftOutlined,
  UnorderedListOutlined,
  PlusOutlined,
  CaretRightOutlined,
} from "@ant-design/icons";
import "../assets/styles/sider.css";

const SiderBar = () => {
  const [isExpanded, setIsExpanded] = useState(true); // Trạng thái mở rộng/thu nhỏ
  const sidebarWidth = isExpanded ? 300 : 110; // Độ rộng cố định

  const handleToggle = () => {
    setIsExpanded(!isExpanded); // Đổi trạng thái
  };

  const [hoveredItem, setHoveredItem] = useState({ list: null, index: null });
  

  const handleMouseEnter = (listName, index) => {
    setHoveredItem({ list: listName, index });
  };

  const handleMouseLeave = () => {
    setHoveredItem({ list: null, index: null });
  };

  const isHovered = (listName, index) =>
    hoveredItem.list === listName && hoveredItem.index === index;

  

  const albums = [
    {
      img: "",
      title: "B Ray Mix",
    },
    {
      img: "https://i.ytimg.com/vi/7u4g483WTzw/maxresdefault.jpg",
      title: "Upbeat Mix",
    },
  ];

  const playlists = [
    {
      img: "https://i1.sndcdn.com/artworks-JriKS1DyZJ5jOzOn-1NCPkg-t500x500.jpg",
      title: "B Ray Mix",
    },
    {
      img: "https://i.ytimg.com/vi/7u4g483WTzw/maxresdefault.jpg",
      title: "Upbeat Mix",
    },
  ];

  const artists = [
    {
      img: "",
      name: "Vũ Cát Tường",
    },
    {
      img: "https://vcdn1-giaitri.vnecdn.net/2024/07/13/mck2-6299-1720843087-172084518-4401-4174-1720845590.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=ttvHeCbAZ-Cj2wkxTz416Q",
      name: "RPT MCK",
    },
  ];

  return (
    <div className="slider-bar" style={{ width: `${sidebarWidth}px` }}>
      {isExpanded ? (
        <div className="slider-bar-wrapper">
          <div className="library" onClick={handleToggle}>
            <div className="library-content">Your Library</div>
            {/* Nút Toggle */}
            <div className="slider-bar-toggle-button" onClick={handleToggle}>
              <div className="slider-bar-toggle-icon">
                <PlusOutlined />
              </div>
            </div>
            <div className="slider-bar-toggle-button" onClick={handleToggle}>
              <div className="slider-bar-toggle-icon">
                <ArrowLeftOutlined />
              </div>
            </div>
          </div>
          {/* Nội dung Sidebar */}
          <div className="slider-bar-content">
            <div className="slider-bar-lists">
              {playlists.map((playlist, playlistid) => (
                <div
                  key={playlistid}
                  className="slider-bar-list"
                  onMouseEnter={() => handleMouseEnter("playlists", playlistid)}
                  onMouseLeave={handleMouseLeave}>
                  {playlist.img ? (
                    <img
                      src={playlist.img}
                      alt={playlist.title}
                      className="slider-bar-image"
                    />
                  ) : (
                    <div className="slider-bar-placeholder">
                      <CaretRightOutlined className="slider-bar-placeholder-icon" />
                    </div>
                  )}
                  <div className="slider-bar-info">
                    <div className="slider-bar-name">{playlist.title}</div>
                    <div className="slider-bar-role">Playlist</div>
                  </div>
                  {isHovered("playlists", playlistid) && (
                    <div className="slider-bar-icon">
                      <div className="slider-bar-hover-icon">
                        <CaretRightOutlined />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="slider-bar-lists">
              {albums.map((album, albumid) => (
                <div
                  key={albumid}
                  className="slider-bar-list"
                  onMouseEnter={() => handleMouseEnter("albums", albumid)}
                  onMouseLeave={handleMouseLeave}>
                  {album.img ? (
                    <img
                      src={album.img}
                      alt={album.title}
                      className="slider-bar-image"
                    />
                  ) : (
                    <div className="slider-bar-placeholder">
                      <CaretRightOutlined className="slider-bar-placeholder-icon" />
                    </div>
                  )}
                  <div className="slider-bar-info">
                    <div className="slider-bar-name">{album.title}</div>
                    <div className="slider-bar-role">Album</div>
                  </div>
                  {isHovered("albums", albumid) && (
                    <div className="slider-bar-icon">
                      <div className="slider-bar-hover-icon">
                        <CaretRightOutlined />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="slider-bar-lists">
              {artists.map((artist, artistid) => (
                <div
                  key={artistid}
                  className="slider-bar-list"
                  onMouseEnter={() => handleMouseEnter("artists", artistid)}
                  onMouseLeave={handleMouseLeave}>
                  {artist.img ? (
                    <img
                      src={artist.img}
                      alt={artist.title}
                      className="slider-bar-artist-image"
                    />
                  ) : (
                    <div className="slider-bar-artist-placeholder">
                      <CaretRightOutlined className="slider-bar-artist-placeholder-icon" />
                    </div>
                  )}
                  <div className="slider-bar-artist-info">
                    <div className="slider-bar-artist-name">{artist.name}</div>
                    <div className="slider-bar-artist-role">Artist</div>
                  </div>
                  {isHovered("artists", artistid) && (
                    <div className="slider-bar-artist-icon">
                      <div className="slider-bar-artist-hover-icon">
                        <CaretRightOutlined />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="slider-bar-wrapper">
          <div 
            className="library"
            onClick={handleToggle}
          >
            {/* Nút Toggle */}
            <div
              className="slider-bar-toggle-button"
              onClick={handleToggle}
              onMouseEnter={() => setHoveredItem({ list: "toggle", index: 0 })}
              onMouseLeave={handleMouseLeave}
              style={{
                width: "60px",
                height: "60px",
                backgroundColor: isHovered("toggle", 0)
                ? "rgba(255, 255, 255, 0.3)"
                : "rgba(74, 74, 74, 0.3)",
                transform: "translate(-50%, -50%)",
                borderRadius: "10px",
                transition: "background-color 0.3s ease",
                marginLeft: "30px",
                marginTop: "45px"
              }}>
              <div
                className="slider-bar-toggle-icon"
                style={{
                  fontSize: "36px",
                  margin: "12px 12px auto",
                }}>
                <UnorderedListOutlined />
              </div>
            </div>
          </div>
          {/* Nội dung Sidebar */}
          <div className="slider-bar-content">
            <div className="slider-bar-lists">
              {playlists.map((playlist, playlistid) => (
                <div
                  key={playlistid}
                  className="slider-bar-list"
                  style={{ width: "70px" }}
                  onMouseEnter={() => handleMouseEnter("playlists", playlistid)}
                  onMouseLeave={handleMouseLeave}>
                  {playlist.img ? (
                    <img
                      src={playlist.img}
                      alt={playlist.title}
                      className="slider-bar-image"
                    />
                  ) : (
                    <div className="slider-bar-placeholder">
                      <CaretRightOutlined className="slider-bar-placeholder-icon" />
                    </div>
                  )}
                  {isHovered("playlists", playlistid) && (
                    <div className="slider-bar-icon" style={{ left: "50%" }}>
                      <div className="slider-bar-hover-icon">
                        <CaretRightOutlined />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="slider-bar-lists">
              {albums.map((album, albumid) => (
                <div
                  key={albumid}
                  className="slider-bar-list"
                  style={{ width: "70px" }}
                  onMouseEnter={() => handleMouseEnter("albums", albumid)}
                  onMouseLeave={handleMouseLeave}>
                  {album.img ? (
                    <img
                      src={album.img}
                      alt={album.title}
                      className="slider-bar-image"
                    />
                  ) : (
                    <div className="slider-bar-placeholder">
                      <CaretRightOutlined className="slider-bar-placeholder-icon" />
                    </div>
                  )}
                  {isHovered("albums", albumid) && (
                    <div className="slider-bar-icon" style={{ left: "50%" }}>
                      <div className="slider-bar-hover-icon">
                        <CaretRightOutlined />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="slider-bar-lists">
              {artists.map((artist, artistid) => (
                <div
                  key={artistid}
                  className="slider-bar-list"
                  style={{ width: "70px" }}
                  onMouseEnter={() => handleMouseEnter("artists", artistid)}
                  onMouseLeave={handleMouseLeave}>
                  {artist.img ? (
                    <img
                      src={artist.img}
                      alt={artist.title}
                      className="slider-bar-artist-image"
                    />
                  ) : (
                    <div className="slider-bar-artist-placeholder">
                      <CaretRightOutlined className="slider-bar-artist-placeholder-icon" />
                    </div>
                  )}
                  {isHovered("artists", artistid) && (
                    <div
                      className="slider-bar-artist-icon"
                      style={{ left: "50%" }}>
                      <div className="slider-bar-artist-hover-icon">
                        <CaretRightOutlined />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SiderBar;
