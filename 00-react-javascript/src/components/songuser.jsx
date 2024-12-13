import React, { useState } from "react";
import { CaretRightOutlined } from "@ant-design/icons";
import "../assets/styles/songuser.css";

const SongUser = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [itemsToShow, setItemsToShow] = useState(5);
  const [expanded, setExpanded] = useState(false);

  const songs = [
    { img: "", title: "Only Girl (In the World)", duration: "4:53" },
    {
      img: "https://upload.wikimedia.org/wikipedia/vi/3/39/Umbrella-rihanna.jpg",
      title: "Umbrella",
      duration: "4:53",
    },
    {
      img: "https://upload.wikimedia.org/wikipedia/en/c/c2/Rude_Boy_cover.png",
      title: "Rude Boy",
      duration: "4:53",
    },
    {
      img: "https://upload.wikimedia.org/wikipedia/en/a/a8/Hey_Daddy_%28Daddy%27s_Home%29.jpg",
      title: "Hey Daddy (Daddy's Home)",
      duration: "4:53",
    },
    {
      img: "https://upload.wikimedia.org/wikipedia/en/3/3e/Thinking_Out_Loud_cover.png",
      title: "Thinking Out Loud",
      duration: "4:09",
    },
    {
      img: "https://upload.wikimedia.org/wikipedia/en/9/91/WDKYSingleCover.jpg",
      title: "Stronger",
      duration: "4:09",
    },
    {
      img: "https://upload.wikimedia.org/wikipedia/en/f/fc/Mockingbird_%28Eminem_song%29_cover.jpg",
      title: "Mockingbird",
      duration: "4:09",
    },
    {
      img: "https://upload.wikimedia.org/wikipedia/en/b/b9/Taylor_Swift_-_Anti-Hero.png",
      title: "Anti-Hero",
      duration: "4:39",
    },
    {
      img: "https://upload.wikimedia.org/wikipedia/en/b/b9/Taylor_Swift_-_Anti-Hero.png",
      title: "Anti-Hero",
      duration: "4:39",
    },
    {
      img: "https://upload.wikimedia.org/wikipedia/en/b/b9/Taylor_Swift_-_Anti-Hero.png",
      title: "Anti-Hero",
      duration: "4:39",
    },
  ];

  const handleSeeMore = () => {
    if (expanded) {
      setItemsToShow(5);
      setExpanded(false);
    } else {
      setItemsToShow(songs.length);
      setExpanded(true);
    }
  };

  return (
    <div className="songuser-wrapper">
      {songs.slice(0, itemsToShow).map((song, index) => (
        <div
          key={index}
          className="songuser"
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}>
          <div className="songuser-number">
            {hoveredIndex === index ? <CaretRightOutlined /> : index + 1}
          </div>
          <div className="songuser-image-container">
            {song.img ? (
              <img src={song.img} alt={song.title} className="songuser-image" />
            ) : (
              <div className="songuser-placeholder">
                <CaretRightOutlined className="songuser-placeholder-icon" />
              </div>
            )}
          </div>
          <div className="songuser-info">
            <div className="songuser-name">{song.title}</div>
          </div>
          <div className="songuser-duration">{song.duration}</div>
        </div>
      ))}

      {songs.length > 5 && (
        <div className="songuser-see-more" onClick={handleSeeMore}>
          {expanded ? "See Less" : "See More"}
        </div>
      )}
    </div>
  );
};

export default SongUser;
