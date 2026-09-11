import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSong } from "../context/SongContext";
import { useUser } from "../context/UserContext";
import SongItem from "../components/SongItem";
import {
  FiPlayCircle,
  FiClock,
  FiMusic,
  FiTrash2,
  FiPlusCircle,
  FiX,
  FiUpload,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";

interface TrackItem {
  file: File;
  title: string;
}

const AlbumDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedAlbum, fetchAlbumDetails, playSong, deleteAlbum, addSong, addBulkSongs } = useSong();
  const { isAuth } = useUser();

  // Add Song Modal State
  const [showAddSong, setShowAddSong] = useState(false);
  const [songTitle, setSongTitle] = useState("");
  const [songDesc, setSongDesc] = useState("");
  const [songTracks, setSongTracks] = useState<TrackItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

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

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const items: TrackItem[] = files.map((file) => ({
      file,
      title: file.name.replace(/\.[^/.]+$/, "").trim(),
    }));
    setSongTracks(items);
    if (items.length === 1 && !songTitle) {
      setSongTitle(items[0].title);
    }
  };

  const handleUpdateTrackTitle = (index: number, newTitle: string) => {
    setSongTracks((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], title: newTitle };
      return copy;
    });
  };

  const handleRemoveTrack = (index: number) => {
    setSongTracks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddSongSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (songTracks.length === 0 || !album.id) {
      setUploadError("Please select at least one audio file.");
      return;
    }
    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      if (songTracks.length === 1) {
        const track = songTracks[0];
        const titleToUse = songTitle.trim() || track.title;

        const formData = new FormData();
        formData.append("title", titleToUse);
        formData.append("description", songDesc || "Album Track");
        formData.append("album", String(album.id));
        formData.append("file", track.file);

        const res = await addSong(formData);
        if (res.success) {
          setUploadSuccess(`Added "${titleToUse}" successfully!`);
          setTimeout(() => {
            setShowAddSong(false);
            setSongTitle("");
            setSongDesc("");
            setSongTracks([]);
            setUploadSuccess(null);
          }, 1200);
          if (id) fetchAlbumDetails(id);
        } else {
          setUploadError(res.message || "Failed to add song.");
        }
      } else {
        const formData = new FormData();
        formData.append("album", String(album.id));
        formData.append("description", songDesc || "Album Track");
        formData.append("titles", JSON.stringify(songTracks.map((t) => t.title)));
        songTracks.forEach((t) => formData.append("files", t.file));

        const res = await addBulkSongs(formData);
        if (res.success) {
          setUploadSuccess(`Added ${songTracks.length} songs to "${album.title}"!`);
          setTimeout(() => {
            setShowAddSong(false);
            setSongTitle("");
            setSongDesc("");
            setSongTracks([]);
            setUploadSuccess(null);
          }, 1200);
          if (id) fetchAlbumDetails(id);
        } else {
          setUploadError(res.message || "Failed to add songs.");
        }
      }
    } catch (err: any) {
      setUploadError(err.message || "An unexpected error occurred during upload.");
    } finally {
      setUploading(false);
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
                  onClick={() => {
                    setShowAddSong(true);
                    setUploadError(null);
                    setUploadSuccess(null);
                  }}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white font-semibold px-4 py-2 rounded-full flex items-center gap-1.5 transition text-xs border border-white/10 cursor-pointer"
                  title="Add songs to this album"
                >
                  <FiPlusCircle className="text-emerald-400" /> Add Songs
                </button>

                <button
                  onClick={handleDeleteAlbum}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-full flex items-center gap-1.5 transition text-xs font-semibold cursor-pointer"
                  title="Delete Album"
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
                onClick={() => {
                  setShowAddSong(true);
                  setUploadError(null);
                  setUploadSuccess(null);
                }}
                className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-4 py-2 rounded-full text-xs transition"
              >
                + Add First Song
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add Song Modal for this Album */}
      {showAddSong && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#181818] border border-white/10 p-6 rounded-2xl max-w-lg w-full flex flex-col gap-4 shadow-2xl relative">
            <button
              onClick={() => setShowAddSong(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-lg"
            >
              <FiX />
            </button>

            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FiPlusCircle className="text-emerald-400" /> Add Songs to "{album.title}"
            </h3>

            {uploadError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-xs flex items-center gap-2">
                <FiAlertCircle />
                <span>{uploadError}</span>
              </div>
            )}

            {uploadSuccess && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-xl text-xs flex items-center gap-2">
                <FiCheckCircle />
                <span>{uploadSuccess}</span>
              </div>
            )}

            <form onSubmit={handleAddSongSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-300">Artist / Description</label>
                <input
                  type="text"
                  value={songDesc}
                  onChange={(e) => setSongDesc(e.target.value)}
                  placeholder="e.g. Acoustic Version / Artist Name"
                  className="bg-[#121212] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Single Song Title (if 1 or no track selected) */}
              {songTracks.length <= 1 && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-300">
                    Song Title {songTracks.length === 1 ? "(auto-detected from file name)" : "*"}
                  </label>
                  <input
                    type="text"
                    value={songTitle}
                    onChange={(e) => setSongTitle(e.target.value)}
                    placeholder="e.g. Summer Breeze (leave blank to use file name)"
                    className="bg-[#121212] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}

              {/* Audio Files Input */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-300">
                    Audio Files (.mp3, .wav) - <span className="text-emerald-400">Select multiple songs at once</span>
                  </label>
                  {songTracks.length > 0 && (
                    <span className="text-xs text-emerald-400 font-bold">
                      {songTracks.length} track(s) selected
                    </span>
                  )}
                </div>
                <input
                  type="file"
                  accept="audio/*"
                  multiple
                  required={songTracks.length === 0}
                  onChange={handleFilesChange}
                  className="bg-[#121212] border border-white/10 rounded-xl p-2 text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-500 file:text-black cursor-pointer"
                />
              </div>

              {/* Selected Files Badge List with Editable Titles */}
              {songTracks.length > 0 && (
                <div className="bg-[#121212] p-3 rounded-xl border border-white/10 flex flex-col gap-2">
                  <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                    <span className="text-[11px] font-bold text-gray-300">
                      Tracks to upload ({songTracks.length}):
                    </span>
                    <button
                      type="button"
                      onClick={() => setSongTracks([])}
                      className="text-[11px] text-red-400 hover:underline"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto pr-1">
                    {songTracks.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 bg-zinc-900/80 p-2 rounded-lg border border-white/5"
                      >
                        <span className="text-[10px] font-bold text-gray-500 w-4 text-center">{idx + 1}</span>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => handleUpdateTrackTitle(idx, e.target.value)}
                          placeholder="Song title"
                          className="flex-1 bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-emerald-500"
                        />
                        <span className="text-gray-500 text-[10px]">
                          {(item.file.size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTrack(idx)}
                          className="text-gray-500 hover:text-red-400 p-0.5"
                          title="Remove"
                        >
                          <FiX className="text-xs" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
                  disabled={uploading || songTracks.length === 0}
                  className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-5 py-2.5 rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <FiUpload />{" "}
                  {uploading
                    ? "Uploading Songs..."
                    : `Upload ${songTracks.length > 1 ? `${songTracks.length} Songs` : "Song"}`}
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
