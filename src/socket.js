import { io } from "socket.io-client";

export const createSocket = (token) => {
  if (!token) {
    console.error("No token provided to createSocket");
    return null;
  }

  const socket = io("http://localhost:5000", {
    auth: { token },
    autoConnect: true, 
  });

  socket.on("connect", () => console.log("Socket connected:", socket.id));
  socket.on("connect_error", (err) => console.log("Socket connection error:", err.message));

  return socket;
};
