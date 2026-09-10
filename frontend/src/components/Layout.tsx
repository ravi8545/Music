import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Player from "./Player";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="h-screen bg-black flex flex-col overflow-hidden font-sans text-gray-100">
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col bg-[#121212] overflow-hidden my-2 mr-2 rounded-xl border border-white/5">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-zinc-700">
            {children}
          </main>
        </div>
      </div>

      {/* Persistent Bottom Player Bar */}
      <Player />
    </div>
  );
};

export default Layout;