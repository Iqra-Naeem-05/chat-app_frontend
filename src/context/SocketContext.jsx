import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user, loading } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [selectedUser, setSelectedUser] = useState(null);


  useEffect(() => {
    if (loading) return;

    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setOnlineUsers(new Set());
      }
      return;
    }

    const newSocket = io("http://localhost:5000", {
      withCredentials: true,
    });

    setSocket(newSocket);

    newSocket.on("connect", () =>
      console.log("✅ Socket connected:", newSocket.id)
    );

    newSocket.on("already_online", (users) =>
      setOnlineUsers(new Set(users))
    );

    newSocket.on("user_online", (userId) => {
      setOnlineUsers((prev) => new Set(prev).add(userId));
    });

    newSocket.on("user_offline", (userId) => {
      setOnlineUsers((prev) => {
        const updated = new Set(prev);
        updated.delete(userId);
        return updated;
      });
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user, loading]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers, selectedUser, setSelectedUser }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error("useSocket must be used within SocketProvider");
  return context;
};
