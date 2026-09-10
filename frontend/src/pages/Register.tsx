import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { FiUser, FiMail, FiLock, FiAlertCircle } from "react-icons/fi";

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { registerUser } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const res = await registerUser(name, email, password);
    setSubmitting(false);

    if (res.success) {
      navigate("/");
    } else {
      setError(res.message || "Failed to register");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <div className="w-full max-w-md bg-[#181818] border border-white/10 p-8 rounded-2xl shadow-2xl flex flex-col gap-6">
        <div className="text-center flex flex-col items-center gap-2">
          <img src="/logo.png" alt="Spotify Logo" className="w-14 h-14 object-contain shadow-lg" />
          <h2 className="text-2xl font-bold text-white mt-1">Create Account</h2>
          <p className="text-gray-400 text-xs">Join Spotify to stream tracks, create albums, and build playlists</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
            <FiAlertCircle className="text-base flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-300">Full Name</label>
            <div className="relative flex items-center">
              <FiUser className="absolute left-3.5 text-gray-400 text-base" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-[#121212] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-300">Email Address</label>
            <div className="relative flex items-center">
              <FiMail className="absolute left-3.5 text-gray-400 text-base" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-[#121212] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-300">Password</label>
            <div className="relative flex items-center">
              <FiLock className="absolute left-3.5 text-gray-400 text-base" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#121212] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 rounded-xl transition shadow-lg shadow-emerald-500/20 mt-2 disabled:opacity-50 cursor-pointer"
          >
            {submitting ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-emerald-400 font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
