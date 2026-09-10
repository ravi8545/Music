import React, { useState } from "react";
import { FiPlay, FiPause, FiHeart, FiTrash2, FiInfo, FiImage, FiX } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import type { ISong } from "../types";
import { useSong } from "../context/SongContext";
import { useUser } from "../context/UserContext";

interface SongItemProps {
  song: ISong;
  index?: number;
  queue?: ISong[];
}

const SongItem: React.FC<SongItemProps> = ({ song, index, queue }) => {
  const { currentSong, isPlaying, playSong, deleteSong, fetchSingleSong, addThumbnail } = useSong();
  const { user, saveToPlaylist, isAuth } = useUser();

  const [showInfo, setShowInfo] = useState(false);
  const [songDetails, setSongDetails] = useState<ISong | null>(null);
  const [showThumbUpload, setShowThumbUpload] = useState(false);
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const isCurrent = currentSong?.id === song.id;
  const isLiked = isAuth && user?.playlist?.includes(String(song.id));

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${song.title}"?`)) {
      await deleteSong(song.id);
    }
  };

  const handleInfo = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowInfo(true);
    const data = await fetchSingleSong(song.id);
    if (data) {
      setSongDetails(data);
    }
  };

  const handleThumbSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!thumbFile) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", thumbFile);

    const res = await addThumbnail(song.id, formData);
    setUploading(false);
    if (res.success) {
      setShowThumbUpload(false);
      setThumbFile(null);
    }
  };

  return (
    <>
      <div
        onClick={() => playSong(song, queue)}
        className={`group flex items-center justify-between p-3 rounded-xl transition-all duration-200 cursor-pointer ${
          isCurrent
            ? "bg-emerald-950/40 border border-emerald-500/30 text-white"
            : "hover:bg-[#222222] text-gray-300"
        }`}
      >
        <div className="flex items-center gap-4 min-w-0">
          {typeof index === "number" && (
            <span className="w-6 text-center text-sm font-mono text-gray-500 group-hover:hidden">
              {index + 1}
            </span>
          )}

          {/* Play/Pause Button indicator on hover/active */}
          <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-zinc-800 shadow-md">
            <img
              src={
                song.thumbnail ||
                "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=120&auto=format&fit=crop"
              }
              alt={song.title}
              className="w-full h-full object-cover"
            />
            <div
              className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity ${
                isCurrent ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              }`}
            >
              {isCurrent && isPlaying ? (
                <FiPause className="text-white text-xl fill-current" />
              ) : (
                <FiPlay className="text-white text-xl fill-current ml-0.5" />
              )}
            </div>
          </div>

          <div className="min-w-0">
            <h4
              className={`text-sm font-semibold truncate ${
                isCurrent ? "text-emerald-400 font-bold" : "text-white"
              }`}
            >
              {song.title}
            </h4>
            <p className="text-xs text-gray-400 truncate">{song.description || "Single Track"}</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* View Info (GET /song/:id) */}
          <button
            onClick={handleInfo}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 opacity-0 group-hover:opacity-100 transition cursor-pointer"
            title="Song Details (GET /song/:id)"
          >
            <FiInfo className="text-base" />
          </button>

          {isAuth && (
            <>
              {/* Upload Thumbnail (POST /song/:id) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowThumbUpload(true);
                }}
                className="p-1.5 text-gray-400 hover:text-emerald-400 rounded-lg hover:bg-white/10 opacity-0 group-hover:opacity-100 transition cursor-pointer"
                title="Upload Song Thumbnail (POST /song/:id)"
              >
                <FiImage className="text-base" />
              </button>

              {/* Save / Remove Playlist (POST /user/song/:id) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  saveToPlaylist(song.id);
                }}
                className="p-1.5 text-gray-400 hover:text-pink-500 transition cursor-pointer"
                title={isLiked ? "Remove from Playlist" : "Save to Playlist"}
              >
                {isLiked ? (
                  <FaHeart className="text-pink-500 text-base" />
                ) : (
                  <FiHeart className="text-base group-hover:opacity-100 opacity-60" />
                )}
              </button>

              {/* Delete Song (DELETE /song/:id) */}
              <button
                onClick={handleDelete}
                className="p-1.5 text-gray-400 hover:text-red-400 rounded-lg hover:bg-white/10 opacity-0 group-hover:opacity-100 transition cursor-pointer"
                title="Delete Song (DELETE /song/:id)"
              >
                <FiTrash2 className="text-base" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Song Details Modal (GET /song/:id) */}
      {showInfo && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <div className="bg-[#181818] border border-white/10 p-6 rounded-2xl max-w-md w-full flex flex-col gap-4 shadow-2xl relative">
            <button
              onClick={() => setShowInfo(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-lg"
            >
              <FiX />
            </button>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FiInfo className="text-emerald-400" /> Song Details
            </h3>

            <div className="flex items-center gap-4 bg-[#121212] p-4 rounded-xl border border-white/5">
              <img
                src={
                  songDetails?.thumbnail ||
                  song.thumbnail ||
                  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&auto=format&fit=crop"
                }
                alt={song.title}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div className="flex flex-col gap-1 overflow-hidden">
                <span className="text-xs text-emerald-400 font-bold uppercase">ID: #{song.id}</span>
                <h4 className="text-base font-bold text-white truncate">{songDetails?.title || song.title}</h4>
                <p className="text-xs text-gray-400 truncate">{songDetails?.description || song.description}</p>
                {songDetails?.album_id && (
                  <span className="text-xs text-gray-500">Album ID: {songDetails.album_id}</span>
                )}
              </div>
            </div>

            <div className="flex justify-end mt-2">
              <button
                onClick={() => setShowInfo(false)}
                className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-5 py-2 rounded-xl text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Thumbnail Modal (POST /song/:id) */}
      {showThumbUpload && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <div className="bg-[#181818] border border-white/10 p-6 rounded-2xl max-w-sm w-full flex flex-col gap-4 shadow-2xl relative">
            <button
              onClick={() => setShowThumbUpload(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-lg"
            >
              <FiX />
            </button>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FiImage className="text-emerald-400" /> Upload Thumbnail for "{song.title}"
            </h3>

            <form onSubmit={handleThumbSubmit} className="flex flex-col gap-4">
              <input
                type="file"
                accept="image/*"
                required
                onChange={(e) => setThumbFile(e.target.files?.[0] || null)}
                className="bg-[#121212] border border-white/10 rounded-xl p-2 text-xs text-gray-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-500 file:text-black cursor-pointer"
              />

              <div className="flex items-center justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowThumbUpload(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer disabled:opacity-50"
                >
                  {uploading ? "Uploading..." : "Upload Cover"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default SongItem;
