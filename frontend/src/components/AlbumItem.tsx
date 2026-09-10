import React from "react";
import { Link } from "react-router-dom";
import { FiPlay } from "react-icons/fi";
import type { IAlbum } from "../types";

interface AlbumItemProps {
  album: IAlbum;
}

const AlbumItem: React.FC<AlbumItemProps> = ({ album }) => {
  return (
    <Link
      to={`/album/${album.id}`}
      className="group bg-[#181818] hover:bg-[#252525] p-4 rounded-xl transition-all duration-300 flex flex-col gap-3 border border-white/5 hover:border-white/10 hover:shadow-xl hover:shadow-black/50"
    >
      <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-zinc-800 shadow-md">
        <img
          src={
            album.thumbnail ||
            "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop"
          }
          alt={album.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute right-3 bottom-3 w-12 h-12 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-lg opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <FiPlay className="text-xl fill-current ml-0.5" />
        </div>
      </div>
      <div>
        <h3 className="text-white font-bold text-base truncate">{album.title}</h3>
        <p className="text-gray-400 text-xs truncate mt-1">{album.description}</p>
      </div>
    </Link>
  );
};

export default AlbumItem;
