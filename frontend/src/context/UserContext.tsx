import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import type { IUser } from "../types";

export const USER_SERVICE_URL = "http://localhost:5000/api/v1";

interface UserContextType {
  user: IUser | null;
  isAuth: boolean;
  loading: boolean;
  registerUser: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  loginUser: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logoutUser: () => void;
  saveToPlaylist: (songId: string | number) => Promise<void>;
  fetchUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setIsAuth(false);
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.get(`${USER_SERVICE_URL}/user/me`, {
        headers: { token },
      });
      setUser(data);
      setIsAuth(true);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      localStorage.removeItem("token");
      setUser(null);
      setIsAuth(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const registerUser = async (name: string, email: string, password: string) => {
    try {
      const { data } = await axios.post(`${USER_SERVICE_URL}/user/register`, {
        name,
        email,
        password,
      });

      if (data.token) {
        localStorage.setItem("token", data.token);
        setUser(data.user);
        setIsAuth(true);
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message || "Registration failed" };
    } catch (error: any) {
      const msg = error.response?.data?.message || "Registration error";
      return { success: false, message: msg };
    }
  };

  const loginUser = async (email: string, password: string) => {
    try {
      const { data } = await axios.post(`${USER_SERVICE_URL}/user/login`, {
        email,
        password,
      });

      if (data.token) {
        localStorage.setItem("token", data.token);
        setUser(data.user);
        setIsAuth(true);
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message || "Login failed" };
    } catch (error: any) {
      const msg = error.response?.data?.message || "Login error";
      return { success: false, message: msg };
    }
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuth(false);
  };

  const saveToPlaylist = async (songId: string | number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const { data } = await axios.post(
        `${USER_SERVICE_URL}/user/song/${songId}`,
        {},
        { headers: { token } }
      );
      if (data.playlist && user) {
        setUser({ ...user, playlist: data.playlist });
      } else {
        await fetchUser();
      }
    } catch (error) {
      console.error("Error toggling playlist song:", error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isAuth,
        loading,
        registerUser,
        loginUser,
        logoutUser,
        saveToPlaylist,
        fetchUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
