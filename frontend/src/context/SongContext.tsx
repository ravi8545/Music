import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import type { IAlbum, ISong } from "../types";

export const SONG_SERVICE_URL = "http://localhost:8000/api/v1";
export const ADMIN_SERVICE_URL = "http://localhost:7000/api/v1";

interface SongContextType {
  songs: ISong[];
  albums: IAlbum[];
  currentSong: ISong | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  loading: boolean;
  selectedAlbum: { album: IAlbum; songs: ISong[] } | null;
  playlistQueue: ISong[];
  
  fetchSongs: () => Promise<void>;
  fetchAlbums: () => Promise<void>;
  fetchAlbumDetails: (id: string | number) => Promise<void>;
  fetchSingleSong: (id: string | number) => Promise<ISong | null>;
  
  playSong: (song: ISong, queue?: ISong[]) => void;
  togglePlay: () => void;
  nextSong: () => void;
  prevSong: () => void;
  seek: (seconds: number) => void;
  setVolumeLevel: (val: number) => void;

  // Admin Operations
  addAlbum: (formData: FormData) => Promise<{ success: boolean; message?: string }>;
  addSong: (formData: FormData) => Promise<{ success: boolean; message?: string }>;
  addThumbnail: (songId: string | number, formData: FormData) => Promise<{ success: boolean; message?: string }>;
  deleteAlbum: (id: string | number) => Promise<{ success: boolean; message?: string }>;
  deleteSong: (id: string | number) => Promise<{ success: boolean; message?: string }>;
}

const SongContext = createContext<SongContextType | undefined>(undefined);

export const SongProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [songs, setSongs] = useState<ISong[]>([]);
  const [albums, setAlbums] = useState<IAlbum[]>([]);
  const [currentSong, setCurrentSong] = useState<ISong | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.8);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedAlbum, setSelectedAlbum] = useState<{ album: IAlbum; songs: ISong[] } | null>(null);
  const [playlistQueue, setPlaylistQueue] = useState<ISong[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();
    
    const audio = audioRef.current;
    audio.volume = volume;

    const handleTimeUpdate = () => {
      setProgress(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      nextSong();
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
    };
  }, []);

  const fetchSongs = async () => {
    try {
      const { data } = await axios.get(`${SONG_SERVICE_URL}/songs/all`);
      setSongs(data);
      if (data.length > 0 && !currentSong) {
        setCurrentSong(data[0]);
        setPlaylistQueue(data);
      }
    } catch (error) {
      console.error("Error fetching songs:", error);
    }
  };

  const fetchAlbums = async () => {
    try {
      const { data } = await axios.get(`${SONG_SERVICE_URL}/album/all`);
      setAlbums(data);
    } catch (error) {
      console.error("Error fetching albums:", error);
    }
  };

  const fetchAlbumDetails = async (id: string | number) => {
    try {
      const { data } = await axios.get(`${SONG_SERVICE_URL}/album/${id}`);
      setSelectedAlbum(data);
    } catch (error) {
      console.error("Error fetching album details:", error);
    }
  };

  const fetchSingleSong = async (id: string | number): Promise<ISong | null> => {
    try {
      const { data } = await axios.get(`${SONG_SERVICE_URL}/song/${id}`);
      return data;
    } catch (error) {
      console.error("Error fetching single song:", error);
      return null;
    }
  };

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      await Promise.all([fetchSongs(), fetchAlbums()]);
      setLoading(false);
    };
    initData();
  }, []);

  const playSong = (song: ISong, queue?: ISong[]) => {
    if (!audioRef.current) return;
    
    if (queue) {
      setPlaylistQueue(queue);
    } else if (playlistQueue.length === 0) {
      setPlaylistQueue(songs);
    }

    if (currentSong?.id === song.id) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
      }
      return;
    }

    setCurrentSong(song);
    audioRef.current.src = song.audio;
    audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
  };

  const togglePlay = () => {
    if (!audioRef.current || !currentSong) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (!audioRef.current.src) {
        audioRef.current.src = currentSong.audio;
      }
      audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  };

  const nextSong = () => {
    if (!currentSong || playlistQueue.length === 0) return;
    const currentIndex = playlistQueue.findIndex((s) => s.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % playlistQueue.length;
    playSong(playlistQueue[nextIndex]);
  };

  const prevSong = () => {
    if (!currentSong || playlistQueue.length === 0) return;
    const currentIndex = playlistQueue.findIndex((s) => s.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + playlistQueue.length) % playlistQueue.length;
    playSong(playlistQueue[prevIndex]);
  };

  const seek = (seconds: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = seconds;
    setProgress(seconds);
  };

  const setVolumeLevel = (val: number) => {
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
  };

  // --- Admin API Handlers ---
  const getToken = () => localStorage.getItem("token") || "";

  const addAlbum = async (formData: FormData) => {
    try {
      const { data } = await axios.post(`${ADMIN_SERVICE_URL}/album/new`, formData, {
        headers: {
          token: getToken(),
        },
      });
      await fetchAlbums();
      return { success: true, message: data.message };
    } catch (error: any) {
      console.error("addAlbum error:", error.response?.data || error.message);
      return { success: false, message: error.response?.data?.message || "Failed to add album" };
    }
  };

  const addSong = async (formData: FormData) => {
    try {
      const { data } = await axios.post(`${ADMIN_SERVICE_URL}/song/new`, formData, {
        headers: {
          token: getToken(),
        },
      });
      await fetchSongs();
      return { success: true, message: data.message };
    } catch (error: any) {
      console.error("addSong error:", error.response?.data || error.message);
      return { success: false, message: error.response?.data?.message || "Failed to add song" };
    }
  };

  const addThumbnail = async (songId: string | number, formData: FormData) => {
    try {
      const { data } = await axios.post(`${ADMIN_SERVICE_URL}/song/${songId}`, formData, {
        headers: {
          token: getToken(),
        },
      });
      await fetchSongs();
      return { success: true, message: data.message };
    } catch (error: any) {
      console.error("addThumbnail error:", error.response?.data || error.message);
      return { success: false, message: error.response?.data?.message || "Failed to add thumbnail" };
    }
  };

  const deleteAlbum = async (id: string | number) => {
    try {
      const { data } = await axios.delete(`${ADMIN_SERVICE_URL}/album/${id}`, {
        headers: {
          token: getToken(),
        },
      });
      await Promise.all([fetchAlbums(), fetchSongs()]);
      return { success: true, message: data.message };
    } catch (error: any) {
      console.error("deleteAlbum error:", error.response?.data || error.message);
      return { success: false, message: error.response?.data?.message || "Failed to delete album" };
    }
  };

  const deleteSong = async (id: string | number) => {
    try {
      const { data } = await axios.delete(`${ADMIN_SERVICE_URL}/song/${id}`, {
        headers: {
          token: getToken(),
        },
      });
      await fetchSongs();
      return { success: true, message: data.message };
    } catch (error: any) {
      console.error("deleteSong error:", error.response?.data || error.message);
      return { success: false, message: error.response?.data?.message || "Failed to delete song" };
    }
  };

  return (
    <SongContext.Provider
      value={{
        songs,
        albums,
        currentSong,
        isPlaying,
        volume,
        progress,
        duration,
        loading,
        selectedAlbum,
        playlistQueue,
        fetchSongs,
        fetchAlbums,
        fetchAlbumDetails,
        fetchSingleSong,
        playSong,
        togglePlay,
        nextSong,
        prevSong,
        seek,
        setVolumeLevel,
        addAlbum,
        addSong,
        addThumbnail,
        deleteAlbum,
        deleteSong,
      }}
    >
      {children}
    </SongContext.Provider>
  );
};

export const useSong = () => {
  const context = useContext(SongContext);
  if (!context) {
    throw new Error("useSong must be used within a SongProvider");
  }
  return context;
};
