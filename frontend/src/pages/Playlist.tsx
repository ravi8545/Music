import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useSong } from "../context/SongContext";
import SongItem from "../components/SongItem";
import { FiHeart, FiPlayCircle, FiLock } from "react-icons/fi";

const Playlist: React.FC = () => {
  const { user, isAuth } = useUser();
  const { songs, playSong } = useSong();

  if (!isAuth || !user) {
    return (
      <div className="flex flex-col items-center justify-center h-80 bg-[#181818] rounded-2xl border border-white/5 p-8 text-center gap-4 max-w-md mx-auto my-12">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-3xl">
          <FiLock />
        </div>
        <h2 className="text-2xl font-bold text-white">Login Required</h2>
        <p className="text-gray-400 text-sm">
          Please log in or create an account to save your favorite songs to your personal playlist.
        </p>
        <Link
          to="/login"
          className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-8 py-3 rounded-full transition shadow-lg shadow-emerald-500/20 mt-2"
        >
          Log In Now
        </Link>
      </div>
    );
  }

  const playlistSongs = songs.filter((song) => user.playlist?.includes(String(song.id)));

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Playlist Hero Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 bg-gradient-to-b from-pink-950/70 via-zinc-900 to-[#181818] p-6 rounded-2xl border border-white/10 shadow-2xl">
        <div className="w-44 h-44 rounded-xl bg-gradient-to-tr from-pink-600 to-emerald-600 flex items-center justify-center shadow-2xl shadow-pink-950/80 flex-shrink-0">
          <FiHeart className="text-white text-7xl animate-pulse" />
        </div>
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-2 flex-1">
          <span className="text-pink-400 font-bold text-xs uppercase tracking-widest">
            Personal Playlist
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Liked Songs
          </h1>
          <p className="text-gray-300 text-sm">
            Curated playlist by <span className="text-white font-semibold">{user.name}</span>
          </p>

          <div className="flex items-center gap-4 mt-4">
            <span className="text-gray-400 text-xs font-medium">
              {playlistSongs.length} Saved {playlistSongs.length === 1 ? "Track" : "Tracks"}
            </span>
            {playlistSongs.length > 0 && (
              <button
                onClick={() => playSong(playlistSongs[0], playlistSongs)}
                className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-6 py-2.5 rounded-full flex items-center gap-2 transition shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                <FiPlayCircle className="text-xl" /> Play Playlist
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tracks List */}
      <div className="flex flex-col gap-2">
        {playlistSongs.length > 0 ? (
          <div className="flex flex-col gap-1 bg-[#181818]/60 p-3 rounded-2xl border border-white/5">
            {playlistSongs.map((song, idx) => (
              <SongItem key={song.id} song={song} index={idx} queue={playlistSongs} />
            ))}
          </div>
        ) : (
          <div className="bg-[#181818] p-12 text-center text-gray-400 text-sm rounded-xl border border-white/5 flex flex-col items-center gap-3">
            <FiHeart className="text-4xl text-gray-600" />
            <p>Your playlist is empty. Explore home page and click the heart icon on any song to save it here!</p>
            <Link
              to="/"
              className="text-emerald-400 font-semibold hover:underline text-xs mt-2"
            >
              Browse Music
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Playlist;
