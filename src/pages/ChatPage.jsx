import { useEffect } from "react";
import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";

function ChatPage() {
  const { socket, onlineUsers, selectedUser, setSelectedUser } = useSocket();
  const { user } = useAuth();

  useEffect(() => {
    setSelectedUser(null);
  }, [user]);  
  
  if (!socket) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Connecting to chat...</p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden md:flex h-screen  bg-green-100">
        <div className="w-1/4 h-full overflow-auto border-r bg-white">
          <ChatList onSelectUser={setSelectedUser} onlineUsers={onlineUsers} socket={socket} />
        </div>

        <div className="flex-1">
        {selectedUser && socket ? (

            <ChatWindow/>
          ) : (
            <div className="flex items-center justify-center h-full">
            <p className="text-orange-500 text-center">Select a user to start chatting!</p>
          </div>
        )}
        </div>
      </div>

      <div className="md:hidden h-full">
        <ChatList onSelectUser={setSelectedUser} onlineUsers={onlineUsers} socket={socket} />
      </div>
    </>
  );
}

export default ChatPage;
