import React from "react";
import {
  FiPlay,
  FiPause,
  FiSkipBack,
  FiSkipForward,
  FiVolume2,
  FiVolumeX,
  FiHeart,
  FiRepeat,
  FiShuffle,
} from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { useSong } from "../context/SongContext";
import { useUser } from "../context/UserContext";

const formatTime = (seconds: number) => {
  if (isNaN(seconds) || seconds <= 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

const Player: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    togglePlay,
    nextSong,
    prevSong,
    progress,
    duration,
    seek,
    volume,
    setVolumeLevel,
  } = useSong();

  const { user, saveToPlaylist, isAuth } = useUser();

  if (!currentSong) return null;

  const isLiked = isAuth && user?.playlist?.includes(String(currentSong.id));

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    seek(Number(e.target.value));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolumeLevel(Number(e.target.value));
  };

  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <div className="h-20 bg-[#121212] border-t border-white/10 px-4 sm:px-6 flex items-center justify-between z-30 select-none">
      {/* Left: Track Details & Like Button */}
      <div className="flex items-center gap-4 w-1/4 min-w-[200px]">
        <img
          src={
            currentSong.thumbnail ||
            "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&auto=format&fit=crop"
          }
          alt={currentSong.title}
          className="w-12 h-12 rounded-lg object-cover shadow-md flex-shrink-0"
        />
        <div className="overflow-hidden">
          <h4 className="text-white text-sm font-semibold truncate hover:underline cursor-pointer">
            {currentSong.title}
          </h4>
          <p className="text-gray-400 text-xs truncate">
            {currentSong.description || "Unknown Artist"}
          </p>
        </div>
        {isAuth && (
          <button
            onClick={() => saveToPlaylist(currentSong.id)}
            className="text-gray-400 hover:text-pink-500 transition-colors p-1.5 cursor-pointer"
            title={isLiked ? "Remove from Playlist" : "Save to Playlist"}
          >
            {isLiked ? (
              <FaHeart className="text-pink-500 text-lg animate-pulse" />
            ) : (
              <FiHeart className="text-lg" />
            )}
          </button>
        )}
      </div>

      {/* Center: Playback Controls & Progress Bar */}
      <div className="flex flex-col items-center gap-1.5 w-2/4 max-w-xl">
        <div className="flex items-center gap-6">
          <button
            className="text-gray-400 hover:text-white text-sm transition cursor-pointer"
            title="Shuffle"
          >
            <FiShuffle />
          </button>
          <button
            onClick={prevSong}
            className="text-gray-300 hover:text-white text-lg transition cursor-pointer"
            title="Previous"
          >
            <FiSkipBack />
          </button>
          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-white hover:scale-105 text-black flex items-center justify-center transition shadow-lg shadow-white/10 cursor-pointer"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <FiPause className="text-lg fill-current" />
            ) : (
              <FiPlay className="text-lg fill-current ml-0.5" />
            )}
          </button>
          <button
            onClick={nextSong}
            className="text-gray-300 hover:text-white text-lg transition cursor-pointer"
            title="Next"
          >
            <FiSkipForward />
          </button>
          <button
            className="text-gray-400 hover:text-white text-sm transition cursor-pointer"
            title="Repeat"
          >
            <FiRepeat />
          </button>
        </div>

        {/* Seek Bar */}
        <div className="w-full flex items-center gap-3 text-xs text-gray-400 font-mono">
          <span>{formatTime(progress)}</span>
          <div className="relative flex-1 flex items-center">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={progress}
              onChange={handleSeekChange}
              className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:h-1.5 transition-all"
              style={{
                background: `linear-gradient(to right, #10b981 ${progressPercent}%, #3f3f46 ${progressPercent}%)`,
              }}
            />
          </div>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right: Volume & Extra Controls */}
      <div className="flex items-center justify-end gap-3 w-1/4 min-w-[150px]">
        <button
          onClick={() => setVolumeLevel(volume === 0 ? 0.8 : 0)}
          className="text-gray-400 hover:text-white transition cursor-pointer"
        >
          {volume === 0 ? <FiVolumeX className="text-lg" /> : <FiVolume2 className="text-lg" />}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={handleVolumeChange}
          className="w-24 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          style={{
            background: `linear-gradient(to right, #10b981 ${volume * 100}%, #3f3f46 ${volume * 100}%)`,
          }}
        />
      </div>
    </div>
  );
};

export default Player;
