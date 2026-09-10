import React from "react";
import { useSong } from "../context/SongContext";
import AlbumItem from "../components/AlbumItem";
import SongItem from "../components/SongItem";
import { FiMusic, FiDisc, FiPlayCircle } from "react-icons/fi";

const Home: React.FC = () => {
  const { albums, songs, loading, playSong } = useSong();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-emerald-500">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-emerald-900/60 via-zinc-900 to-zinc-950 p-8 border border-emerald-500/20 overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <span className="text-emerald-400 font-bold text-xs uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
            Featured Platform
          </span>
          <h1 className="text-4xl font-extrabold text-white mt-3 tracking-tight">
            {getGreeting()}
          </h1>
          <p className="text-gray-300 text-sm mt-2 leading-relaxed">
            Discover trending albums, listen to your favorite tracks, and curate your personal music library with crystal clear sound quality.
          </p>
          {songs.length > 0 && (
            <button
              onClick={() => playSong(songs[0], songs)}
              className="mt-6 inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-6 py-3 rounded-full transition-all shadow-lg shadow-emerald-500/25 cursor-pointer"
            >
              <FiPlayCircle className="text-xl" /> Listen Now
            </button>
          )}
        </div>
        <div className="absolute right-4 bottom-0 opacity-10 text-emerald-400 text-[200px] pointer-events-none font-black leading-none">
          ♫
        </div>
      </div>

      {/* Popular Albums Section */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FiDisc className="text-emerald-400" /> Featured Albums
          </h2>
        </div>

        {albums.length === 0 ? (
          <div className="bg-[#181818] rounded-xl p-8 text-center text-gray-400 text-sm border border-white/5">
            No albums uploaded yet. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {albums.map((album) => (
              <AlbumItem key={album.id} album={album} />
            ))}
          </div>
        )}
      </section>

      {/* Trending Songs Section */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FiMusic className="text-emerald-400" /> Recommended Songs
          </h2>
        </div>

        {songs.length === 0 ? (
          <div className="bg-[#181818] rounded-xl p-8 text-center text-gray-400 text-sm border border-white/5">
            No songs available in the database yet.
          </div>
        ) : (
          <div className="flex flex-col gap-1 bg-[#181818]/60 p-3 rounded-2xl border border-white/5">
            {songs.map((song, idx) => (
              <SongItem key={song.id} song={song} index={idx} queue={songs} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;