import React, { useState } from 'react';
import { CaretRightOutlined } from '@ant-design/icons'; // Import the icon
import '../assets/styles/album.css';

const Album = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const albums = [
    { 
        img: "https://i1.sndcdn.com/artworks-JriKS1DyZJ5jOzOn-1NCPkg-t500x500.jpg", 
        title: "B Ray Mix", 
        description: "RHYDER, Lê Hiếu and Sơn Tùng M-TP" 
      },
      { 
        img: "https://i.ytimg.com/vi/7u4g483WTzw/maxresdefault.jpg", 
        title: "Upbeat Mix", 
        description: "Chappell Roan, Sabrina Carpenter, Eminem and more" 
      },
      { 
        img: "", 
        title: "Pop Mix", 
        description: "Taylor Swift, Lady Gaga, Sabrina Carpenter and more" 
      },
      { 
        img: "https://i.ytimg.com/vi/5_ozB0ImkYA/maxresdefault.jpg", 
        title: "Indie Mix", 
        description: "52Hz, Ngọt, Vũ. and more" 
      },
      { 
        img: "https://cdn-images.dzcdn.net/images/cover/7947fa2b4981370977e39f0fd645d4b0/0x1900-000000-80-0-0.jpg", 
        title: "Chill Mix", 
        description: "RAP VIỆT, SOOBIN, ANH TRAI 'SAY HI' and more" 
      },
      { 
          img: "https://images2.thanhnien.vn/528068263637045248/2024/9/18/edit-457047072900098568810546446218-17266692101441990737648.jpeg", 
          title: "Chill Mix", 
          description: "RAP VIỆT" 
      },
  ];

  return (
    <div className="album-wrapper">
      {albums.map((album, index) => (
        <div
          key={index}
          className="album"
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {album.img ? (
            <img src={album.img} alt={album.title} className="album-image" />
          ) : (
            <div className="album-placeholder">
              <CaretRightOutlined className="placeholder-icon" />
            </div>
          )}
          <div className="album-info">
            <div className="album-title">{album.title}</div>
            <div className="album-description">{album.description}</div>
          </div>
          {hoveredIndex === index && (
            <div className="hover-icon">
              <CaretRightOutlined />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Album;



