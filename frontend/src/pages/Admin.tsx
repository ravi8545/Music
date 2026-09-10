import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import { useSong } from "../context/SongContext";
import {
  FiPlusCircle,
  FiMusic,
  FiDisc,
  FiTrash2,
  FiUpload,
  FiShield,
  FiCheckCircle,
  FiAlertCircle,
  FiImage,
} from "react-icons/fi";

const Admin: React.FC = () => {
  const { user } = useUser();
  const { albums, songs, addAlbum, addSong, addThumbnail, deleteAlbum, deleteSong } = useSong();

  const [activeTab, setActiveTab] = useState<"album" | "song" | "manage">("song");

  // Add Album form state
  const [albumTitle, setAlbumTitle] = useState("");
  const [albumDesc, setAlbumDesc] = useState("");
  const [albumFile, setAlbumFile] = useState<File | null>(null);

  // Add Song form state
  const [songTitle, setSongTitle] = useState("");
  const [songDesc, setSongDesc] = useState("");
  const [songAlbumId, setSongAlbumId] = useState("");
  const [songFile, setSongFile] = useState<File | null>(null);

  // Song thumbnail modal state
  const [thumbSongId, setThumbSongId] = useState<number | null>(null);
  const [thumbFile, setThumbFile] = useState<File | null>(null);

  // Feedback states
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (user?.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center h-80 bg-[#181818] rounded-2xl border border-white/5 p-8 text-center gap-4 max-w-md mx-auto my-12">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center text-3xl">
          <FiShield />
        </div>
        <h2 className="text-2xl font-bold text-white">Admin Access Required</h2>
        <p className="text-gray-400 text-sm">
          You must be logged in as an administrator to access the upload and management dashboard.
        </p>
      </div>
    );
  }

  const handleAlbumSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!albumFile) {
      setMessage({ type: "error", text: "Please select an album thumbnail image file." });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("title", albumTitle);
    formData.append("description", albumDesc);
    formData.append("file", albumFile);

    const res = await addAlbum(formData);
    setSubmitting(false);

    if (res.success) {
      setMessage({ type: "success", text: res.message || "Album created successfully!" });
      setAlbumTitle("");
      setAlbumDesc("");
      setAlbumFile(null);
    } else {
      setMessage({ type: "error", text: res.message || "Failed to create album." });
    }
  };

  const handleSongSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!songFile) {
      setMessage({ type: "error", text: "Please select an audio file." });
      return;
    }
    if (!songAlbumId) {
      setMessage({ type: "error", text: "Please select an album for this song." });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("title", songTitle);
    formData.append("description", songDesc);
    formData.append("album", songAlbumId);
    formData.append("file", songFile);

    const res = await addSong(formData);
    setSubmitting(false);

    if (res.success) {
      setMessage({ type: "success", text: res.message || "Song added successfully!" });
      setSongTitle("");
      setSongDesc("");
      setSongFile(null);
    } else {
      setMessage({ type: "error", text: res.message || "Failed to add song." });
    }
  };

  const handleThumbnailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!thumbSongId || !thumbFile) return;

    setSubmitting(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("file", thumbFile);

    const res = await addThumbnail(thumbSongId, formData);
    setSubmitting(false);

    if (res.success) {
      setMessage({ type: "success", text: "Song thumbnail updated!" });
      setThumbSongId(null);
      setThumbFile(null);
    } else {
      setMessage({ type: "error", text: res.message || "Failed to upload thumbnail." });
    }
  };

  const handleDeleteAlbum = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this album and its songs?")) return;
    const res = await deleteAlbum(id);
    if (res.success) {
      setMessage({ type: "success", text: "Album deleted." });
    } else {
      setMessage({ type: "error", text: res.message || "Failed to delete album." });
    }
  };

  const handleDeleteSong = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this song?")) return;
    const res = await deleteSong(id);
    if (res.success) {
      setMessage({ type: "success", text: "Song deleted." });
    } else {
      setMessage({ type: "error", text: res.message || "Failed to delete song." });
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="flex items-center justify-between bg-gradient-to-r from-amber-950/60 to-[#181818] p-6 rounded-2xl border border-amber-500/20 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-2xl">
            <FiShield />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Management Dashboard</h1>
            <p className="text-xs text-gray-400">Upload new tracks, create albums, and manage library content</p>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 bg-[#181818] p-1.5 rounded-xl border border-white/10 w-fit">
        <button
          onClick={() => { setActiveTab("song"); setMessage(null); }}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
            activeTab === "song"
              ? "bg-emerald-500 text-black shadow-md"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <FiMusic className="text-base" /> Add Song
        </button>
        <button
          onClick={() => { setActiveTab("album"); setMessage(null); }}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
            activeTab === "album"
              ? "bg-emerald-500 text-black shadow-md"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <FiDisc className="text-base" /> Add Album
        </button>
        <button
          onClick={() => { setActiveTab("manage"); setMessage(null); }}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
            activeTab === "manage"
              ? "bg-emerald-500 text-black shadow-md"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <FiTrash2 className="text-base" /> Manage Catalog
        </button>
      </div>

      {/* Status Feedback Toast */}
      {message && (
        <div
          className={`px-4 py-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
            message.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
              : "bg-red-500/10 border border-red-500/30 text-red-400"
          }`}
        >
          {message.type === "success" ? <FiCheckCircle /> : <FiAlertCircle />}
          <span>{message.text}</span>
        </div>
      )}

      {/* ADD SONG TAB */}
      {activeTab === "song" && (
        <div className="bg-[#181818] border border-white/10 p-6 rounded-2xl flex flex-col gap-6 shadow-xl">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
            <FiPlusCircle className="text-emerald-400" /> Upload New Song
          </h3>

          {albums.length === 0 ? (
            <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 p-4 rounded-xl text-xs">
              ⚠️ Please create at least one Album before adding songs. Switch to the "Add Album" tab first.
            </div>
          ) : (
            <form onSubmit={handleSongSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-300">Song Title</label>
                  <input
                    type="text"
                    required
                    value={songTitle}
                    onChange={(e) => setSongTitle(e.target.value)}
                    placeholder="e.g. Midnight Memories"
                    className="bg-[#121212] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-300">Target Album</label>
                  <select
                    required
                    value={songAlbumId}
                    onChange={(e) => setSongAlbumId(e.target.value)}
                    className="bg-[#121212] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">-- Select Album --</option>
                    {albums.map((alb) => (
                      <option key={alb.id} value={alb.id}>
                        {alb.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-300">Description / Artist</label>
                <input
                  type="text"
                  required
                  value={songDesc}
                  onChange={(e) => setSongDesc(e.target.value)}
                  placeholder="e.g. Featuring Artist / Composer"
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
                  className="bg-[#121212] border border-white/10 rounded-xl p-2 text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-500 file:text-black hover:file:bg-emerald-400 cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 rounded-xl transition shadow-lg shadow-emerald-500/20 mt-2 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <FiUpload /> {submitting ? "Uploading Song..." : "Add Song to Catalog"}
              </button>
            </form>
          )}
        </div>
      )}

      {/* ADD ALBUM TAB */}
      {activeTab === "album" && (
        <div className="bg-[#181818] border border-white/10 p-6 rounded-2xl flex flex-col gap-6 shadow-xl">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
            <FiPlusCircle className="text-emerald-400" /> Create New Album
          </h3>

          <form onSubmit={handleAlbumSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-300">Album Title</label>
              <input
                type="text"
                required
                value={albumTitle}
                onChange={(e) => setAlbumTitle(e.target.value)}
                placeholder="e.g. Summer Hits 2026"
                className="bg-[#121212] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-300">Description</label>
              <input
                type="text"
                required
                value={albumDesc}
                onChange={(e) => setAlbumDesc(e.target.value)}
                placeholder="e.g. Best chillout acoustic collection"
                className="bg-[#121212] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-300">Album Cover Image</label>
              <input
                type="file"
                accept="image/*"
                required
                onChange={(e) => setAlbumFile(e.target.files?.[0] || null)}
                className="bg-[#121212] border border-white/10 rounded-xl p-2 text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-500 file:text-black hover:file:bg-emerald-400 cursor-pointer"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 rounded-xl transition shadow-lg shadow-emerald-500/20 mt-2 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <FiUpload /> {submitting ? "Creating Album..." : "Create Album"}
            </button>
          </form>
        </div>
      )}

      {/* MANAGE CATALOG TAB */}
      {activeTab === "manage" && (
        <div className="flex flex-col gap-8">
          {/* Albums List */}
          <div className="bg-[#181818] border border-white/10 p-6 rounded-2xl flex flex-col gap-4">
            <h3 className="text-base font-bold text-white flex items-center justify-between border-b border-white/5 pb-3">
              <span>Existing Albums ({albums.length})</span>
            </h3>
            {albums.length === 0 ? (
              <p className="text-xs text-gray-400">No albums created yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {albums.map((alb) => (
                  <div
                    key={alb.id}
                    className="flex items-center justify-between bg-[#121212] p-3 rounded-xl border border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={alb.thumbnail}
                        alt={alb.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <h4 className="text-sm font-semibold text-white">{alb.title}</h4>
                        <p className="text-xs text-gray-400">{alb.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteAlbum(alb.id)}
                      className="p-2 text-gray-400 hover:text-red-400 transition cursor-pointer"
                      title="Delete Album"
                    >
                      <FiTrash2 className="text-lg" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Songs List */}
          <div className="bg-[#181818] border border-white/10 p-6 rounded-2xl flex flex-col gap-4">
            <h3 className="text-base font-bold text-white flex items-center justify-between border-b border-white/5 pb-3">
              <span>Existing Songs ({songs.length})</span>
            </h3>
            {songs.length === 0 ? (
              <p className="text-xs text-gray-400">No songs added yet.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {songs.map((song) => (
                  <div
                    key={song.id}
                    className="flex items-center justify-between bg-[#121212] p-3 rounded-xl border border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          song.thumbnail ||
                          "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&auto=format&fit=crop"
                        }
                        alt={song.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <h4 className="text-sm font-semibold text-white">{song.title}</h4>
                        <p className="text-xs text-gray-400">{song.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setThumbSongId(song.id)}
                        className="flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 text-gray-300 text-xs px-3 py-1.5 rounded-lg border border-white/10 transition cursor-pointer"
                        title="Upload song thumbnail"
                      >
                        <FiImage /> Thumbnail
                      </button>
                      <button
                        onClick={() => handleDeleteSong(song.id)}
                        className="p-2 text-gray-400 hover:text-red-400 transition cursor-pointer"
                        title="Delete Song"
                      >
                        <FiTrash2 className="text-lg" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Thumbnail Upload Modal */}
      {thumbSongId !== null && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#181818] border border-white/10 p-6 rounded-2xl max-w-sm w-full flex flex-col gap-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FiImage className="text-emerald-400" /> Upload Song Thumbnail
            </h3>
            <form onSubmit={handleThumbnailSubmit} className="flex flex-col gap-4">
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
                  onClick={() => { setThumbSongId(null); setThumbFile(null); }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Uploading..." : "Save Thumbnail"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
