import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { SongProvider } from "./context/SongContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import AlbumDetails from "./pages/AlbumDetails";
import Playlist from "./pages/Playlist";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";

const App: React.FC = () => {
  return (
    <Router>
      <UserProvider>
        <SongProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/album/:id" element={<AlbumDetails />} />
              <Route path="/playlist" element={<Playlist />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </Layout>
        </SongProvider>
      </UserProvider>
    </Router>
  );
};

export default App;