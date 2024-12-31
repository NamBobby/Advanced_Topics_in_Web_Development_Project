import React, { useState, useRef, useEffect, useCallback  } from "react";
import "../assets/styles/footer.css";
import {
  StepBackwardOutlined,
  PlayCircleOutlined,
  PauseOutlined,
  StepForwardOutlined,
  SoundOutlined,
} from "@ant-design/icons";
import axios from "../services/axios.customize";
import SongLogo from "../assets/images/songlogo.png";


const Footer = ({ currentSong, songList, setCurrentSong }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50); // Default volume
  const [previousVolume, setPreviousVolume] = useState(50); // Volume before muting
  const [progress, setProgress] = useState(0); // Song progress
  const [duration, setDuration] = useState(0); // Total song duration
  const audioRef = useRef(null); // Reference to the audio element

  // Toggle play/pause
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100; // Convert 0-100 to 0-1
    }
  };

  // Handle mute/unmute
  const toggleMute = () => {
    if (volume > 0) {
      setPreviousVolume(volume);
      setVolume(0);
      if (audioRef.current) audioRef.current.volume = 0;
    } else {
      setVolume(previousVolume);
      if (audioRef.current) audioRef.current.volume = previousVolume / 100;
    }
  };

  // Handle Next and Previous song navigation
  const handleNextSong = useCallback(() => {
    if (songList && songList.length > 0) {
      const currentIndex = songList.findIndex((song) => song.id === currentSong?.id);
      const nextIndex = (currentIndex + 1) % songList.length; // Loop to the start
      setCurrentSong(songList[nextIndex]);
    }
  }, [songList, currentSong, setCurrentSong]);

  const handlePrevSong = useCallback(() => {
    if (songList && songList.length > 0) {
      const currentIndex = songList.findIndex((song) => song.id === currentSong?.id);
      const prevIndex = (currentIndex - 1 + songList.length) % songList.length; // Loop to the end
      setCurrentSong(songList[prevIndex]);
    }
  }, [songList, currentSong, setCurrentSong]);

  // Automatically play the next song when the current one ends
  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.onended = handleNextSong;
    }
    return () => {
      if (audioElement) {
        audioElement.onended = null; // Clean up to avoid memory leaks
      }
    };
  }, [handleNextSong]);

  // Update progress and duration when the song is playing
  const updateProgress = () => {
    if (audioRef.current) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100 || 0);
    }
  };

  // Handle progress change via slider
  const handleProgressChange = (e) => {
    const newProgress = e.target.value;
    setProgress(newProgress);
    if (audioRef.current) {
      audioRef.current.currentTime = (audioRef.current.duration * newProgress) / 100;
    }
  };

  // Load new song and reset states when `currentSong` changes
  useEffect(() => {
    if (audioRef.current && currentSong?.filePath) {
      audioRef.current.src = `${axios.defaults.baseURL}/${currentSong.filePath.replace(/^src[\\/]/, "")}`;
      audioRef.current.play();
      setIsPlaying(true);
      setProgress(0);
      setDuration(0);
    }
  }, [currentSong]);

  // Set duration when the audio file is loaded
  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      const handleLoadedMetadata = () => {
        setDuration(audioElement.duration);
      };
      audioElement.addEventListener("loadedmetadata", handleLoadedMetadata);
      return () => {
        audioElement.removeEventListener("loadedmetadata", handleLoadedMetadata);
      };
    }
  }, []);
  

  return (
    <footer className="footer">
      {/* Left Section */}
      <div className="footer-left">
        <img
          src={currentSong?.thumbnailPath
            ? `${axios.defaults.baseURL}/${currentSong.thumbnailPath.replace(/^src[\\/]/, "")}`
            : SongLogo}
          alt={currentSong?.title || "Song Thumbnail"}
          className="song-cover"
        />
        <div className="song-info-play">
          <h4 className="song-title-play">{currentSong?.title || "Select a song"}</h4>
          <p className="song-artist-play">{currentSong?.artist || "Artist"}</p>
        </div>
      </div>

      {/* Center Section */}
      <div className="footer-center">
        <div className="footer-control">
          <button className="control-btn prev" onClick={handlePrevSong}>
            <StepBackwardOutlined />
          </button>
          <button className="control-btn play-pause" onClick={togglePlayPause}>
            {isPlaying ? <PauseOutlined /> : <PlayCircleOutlined />}
          </button>
          <button className="control-btn next" onClick={handleNextSong}>
            <StepForwardOutlined />
          </button>
        </div>
        <div className="progress-bar">
          <span className="current-time">
            {new Date((progress / 100) * duration * 1000).toISOString().substr(14, 5)}
          </span>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            className="progress-slider"
            onChange={handleProgressChange}
          />
          <span className="total-time">
            {new Date(duration * 1000).toISOString().substr(14, 5)}
          </span>
        </div>
      </div>

      {/* Right Section */}
      <div className="footer-right">
        <button className="control-btn volume" onClick={toggleMute}>
          <SoundOutlined />
        </button>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          className="volume-slider"
          onChange={handleVolumeChange}
        />
      </div>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} onTimeUpdate={updateProgress}></audio>
    </footer>
  );
};

export default Footer;
