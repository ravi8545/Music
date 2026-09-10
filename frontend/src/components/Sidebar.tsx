import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FiHome, FiMusic, FiHeart, FiShield } from "react-icons/fi";
import { useUser } from "../context/UserContext";
import { useSong } from "../context/SongContext";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useUser();
  const { albums } = useSong();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-64 bg-[#121212] h-full flex flex-col gap-2 p-2 select-none text-gray-300">
      {/* Top Navigation Box */}
      <div className="bg-[#181818] rounded-xl p-4 flex flex-col gap-4">
        <Link to="/" className="flex items-center gap-3 text-white font-bold text-xl px-1">
          <img src="/logo.png" alt="Spotify Logo" className="w-10 h-10 object-contain drop-shadow-md" />
          <span className="tracking-tight text-white font-extrabold text-2xl">Spotify</span>
        </Link>

        <nav className="flex flex-col gap-1 mt-2">
          <Link
            to="/"
            className={`flex items-center gap-4 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              isActive("/") ? "bg-[#282828] text-white" : "hover:text-white hover:bg-[#202020]"
            }`}
          >
            <FiHome className="text-xl text-emerald-400" />
            <span>Home</span>
          </Link>

          <Link
            to="/playlist"
            className={`flex items-center gap-4 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              isActive("/playlist") ? "bg-[#282828] text-white" : "hover:text-white hover:bg-[#202020]"
            }`}
          >
            <FiHeart className="text-xl text-pink-500" />
            <span>My Playlist</span>
            {user?.playlist?.length ? (
              <span className="ml-auto bg-emerald-500/20 text-emerald-400 text-xs px-2 py-0.5 rounded-full font-bold">
                {user.playlist.length}
              </span>
            ) : null}
          </Link>

          <Link
            to="/admin"
            className={`flex items-center gap-4 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              isActive("/admin") ? "bg-emerald-950/50 text-emerald-400 border border-emerald-500/30" : "text-amber-400 hover:bg-[#202020]"
            }`}
          >
            <FiShield className="text-xl text-amber-400" />
            <span>Upload & Manage</span>
          </Link>
        </nav>
      </div>

      {/* Library & Albums List Box */}
      <div className="bg-[#181818] rounded-xl flex-1 p-4 flex flex-col gap-3 overflow-hidden">
        <div className="flex items-center justify-between px-1 text-gray-400 font-semibold text-sm">
          <div className="flex items-center gap-2">
            <FiMusic className="text-lg" />
            <span>Albums Library</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2 scrollbar-thin scrollbar-thumb-zinc-700">
          {albums.length === 0 ? (
            <div className="text-xs text-gray-500 p-2 text-center">No albums created yet</div>
          ) : (
            albums.map((album) => (
              <Link
                key={album.id}
                to={`/album/${album.id}`}
                className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                  isActive(`/album/${album.id}`)
                    ? "bg-[#282828] text-white"
                    : "hover:bg-[#222222] text-gray-300"
                }`}
              >
                <img
                  src={album.thumbnail || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&auto=format&fit=crop"}
                  alt={album.title}
                  className="w-10 h-10 object-cover rounded-md flex-shrink-0"
                />
                <div className="overflow-hidden">
                  <p className="text-sm font-medium truncate text-white">{album.title}</p>
                  <p className="text-xs text-gray-400 truncate">{album.description}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
