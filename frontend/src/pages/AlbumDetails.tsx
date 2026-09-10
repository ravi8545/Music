import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSong } from "../context/SongContext";
import { useUser } from "../context/UserContext";
import SongItem from "../components/SongItem";
import { FiPlayCircle, FiClock, FiMusic, FiTrash2, FiPlusCircle, FiX, FiUpload } from "react-icons/fi";

const AlbumDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedAlbum, fetchAlbumDetails, playSong, deleteAlbum, addSong } = useSong();
  const { isAuth } = useUser();

  // Add Song Modal State
  const [showAddSong, setShowAddSong] = useState(false);
  const [songTitle, setSongTitle] = useState("");
  const [songDesc, setSongDesc] = useState("");
  const [songFile, setSongFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchAlbumDetails(id);
    }
  }, [id]);

  if (!selectedAlbum) {
    return (
      <div className="flex items-center justify-center h-64 text-emerald-500">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { album, songs } = selectedAlbum;

  const handleDeleteAlbum = async () => {
    if (window.confirm(`Are you sure you want to delete album "${album.title}" and all its tracks?`)) {
      const res = await deleteAlbum(album.id);
      if (res.success) {
        navigate("/");
      }
    }
  };

  const handleAddSongSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!songFile || !album.id) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("title", songTitle);
    formData.append("description", songDesc);
    formData.append("album", String(album.id));
    formData.append("file", songFile);

    const res = await addSong(formData);
    setUploading(false);

    if (res.success) {
      setShowAddSong(false);
      setSongTitle("");
      setSongDesc("");
      setSongFile(null);
      if (id) fetchAlbumDetails(id);
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Album Header Banner */}
      <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 bg-gradient-to-b from-emerald-950/80 via-zinc-900 to-[#181818] p-6 rounded-2xl border border-white/10 shadow-2xl">
        <img
          src={
            album.thumbnail ||
            "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&auto=format&fit=crop"
          }
          alt={album.title}
          className="w-48 h-48 rounded-xl object-cover shadow-2xl shadow-black/80 flex-shrink-0"
        />
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-2 flex-1">
          <span className="text-emerald-400 font-bold text-xs uppercase tracking-widest">
            Album
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {album.title}
          </h1>
          <p className="text-gray-300 text-sm max-w-xl">{album.description}</p>

          <div className="flex flex-wrap items-center gap-3 mt-4">
            <span className="text-gray-400 text-xs font-medium flex items-center gap-1">
              <FiMusic /> {songs?.length || 0} Tracks
            </span>

            {songs && songs.length > 0 && (
              <button
                onClick={() => playSong(songs[0], songs)}
                className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-5 py-2 rounded-full flex items-center gap-2 transition shadow-lg shadow-emerald-500/20 cursor-pointer text-xs"
              >
                <FiPlayCircle className="text-lg" /> Play All
              </button>
            )}

            {isAuth && (
              <>
                <button
                  onClick={() => setShowAddSong(true)}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white font-semibold px-4 py-2 rounded-full flex items-center gap-1.5 transition text-xs border border-white/10 cursor-pointer"
                  title="Add new song to this album (POST /song/new)"
                >
                  <FiPlusCircle className="text-emerald-400" /> Add Song
                </button>

                <button
                  onClick={handleDeleteAlbum}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-full flex items-center gap-1.5 transition text-xs font-semibold cursor-pointer"
                  title="Delete Album (DELETE /album/:id)"
                >
                  <FiTrash2 /> Delete Album
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Song Tracklist */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-white/10 pb-3">
          <div className="flex items-center gap-4">
            <span className="w-6 text-center">#</span>
            <span>Title</span>
          </div>
          <FiClock />
        </div>

        {songs && songs.length > 0 ? (
          <div className="flex flex-col gap-1 mt-1">
            {songs.map((song, idx) => (
              <SongItem key={song.id} song={song} index={idx} queue={songs} />
            ))}
          </div>
        ) : (
          <div className="bg-[#181818] p-8 text-center text-gray-400 text-sm rounded-xl border border-white/5 flex flex-col items-center gap-3">
            <p>No tracks in this album yet.</p>
            {isAuth && (
              <button
                onClick={() => setShowAddSong(true)}
                className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-4 py-2 rounded-full text-xs transition"
              >
                + Add First Song
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add Song Modal for this Album (POST /song/new) */}
      {showAddSong && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#181818] border border-white/10 p-6 rounded-2xl max-w-md w-full flex flex-col gap-4 shadow-2xl relative">
            <button
              onClick={() => setShowAddSong(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-lg"
            >
              <FiX />
            </button>

            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FiPlusCircle className="text-emerald-400" /> Add Song to "{album.title}"
            </h3>

            <form onSubmit={handleAddSongSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-300">Song Title</label>
                <input
                  type="text"
                  required
                  value={songTitle}
                  onChange={(e) => setSongTitle(e.target.value)}
                  placeholder="e.g. Summer Breeze"
                  className="bg-[#121212] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-300">Description / Artist</label>
                <input
                  type="text"
                  required
                  value={songDesc}
                  onChange={(e) => setSongDesc(e.target.value)}
                  placeholder="e.g. Acoustic Version"
                  className="bg-[#121212] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-300">Audio File (.mp3, .wav)</label>
                <input
                  type="file"
                  accept="audio/*"
                  required
                  onChange={(e) => setSongFile(e.target.files?.[0] || null)}
                  className="bg-[#121212] border border-white/10 rounded-xl p-2 text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-500 file:text-black cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSong(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-5 py-2.5 rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <FiUpload /> {uploading ? "Uploading..." : "Upload Song"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlbumDetails;
