import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiChevronLeft, FiChevronRight, FiLogOut } from "react-icons/fi";
import { useUser } from "../context/UserContext";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuth, logoutUser } = useUser();

  return (
    <div className="h-16 bg-[#121212]/90 backdrop-blur-md sticky top-0 z-20 px-6 flex items-center justify-between border-b border-white/5">
      {/* Navigation history controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-all cursor-pointer"
          title="Go back"
        >
          <FiChevronLeft className="text-xl" />
        </button>
        <button
          onClick={() => navigate(1)}
          className="w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-all cursor-pointer"
          title="Go forward"
        >
          <FiChevronRight className="text-xl" />
        </button>
      </div>

      {/* User Auth & Quick Upload Section */}
      <div className="flex items-center gap-3">
        {isAuth && (
          <Link
            to="/admin"
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold px-3.5 py-1.5 rounded-full transition shadow-md shadow-emerald-500/20"
          >
            <span>+ Upload Song</span>
          </Link>
        )}

        {isAuth && user ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#181818] border border-white/10 px-3 py-1.5 rounded-full text-sm font-medium text-white">
              <div className="w-6 h-6 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold text-xs">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="max-w-[120px] truncate">{user.name}</span>
            </div>

            <button
              onClick={logoutUser}
              className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
              title="Logout"
            >
              <FiLogOut className="text-lg" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/register"
              className="text-gray-400 hover:text-white font-semibold text-sm px-4 py-2 transition-all"
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm px-6 py-2 rounded-full transition-all shadow-lg shadow-emerald-500/20"
            >
              Log In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
