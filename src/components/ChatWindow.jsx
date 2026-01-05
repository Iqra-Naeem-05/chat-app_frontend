import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../api/axios";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { Check, CheckCheck, Clock1 } from "lucide-react";
import { useLoader } from "../context/LoaderContext";

function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const scrollRef = useRef(null);
  const { user } = useAuth();
  const myId = user?.id;
  const { socket, onlineUsers, selectedUser } = useSocket();
  const {setLoading} = useLoader();


  const normalizeId = (entity) => {
    if (!entity) return null;
    if (typeof entity === "string") return entity;
    return entity._id || entity.id;
  };


  useEffect(() => {
    if (!selectedUser) return;

    const loadChat = async () => {
      try {
        setLoading(true)
        const res = await axiosInstance.get(
          `/chat/${myId}/${selectedUser?.user?._id}`
        );

        const chats = res.data.chats.reverse();
        setMessages(chats);

        const unseenMessageIds = chats
          .filter(
            (m) => normalizeId(m.sender) === selectedUser.user._id && m.status !== "seen"
          )
          .map((m) => m._id);

        if (unseenMessageIds.length > 0 && socket?.connected) {
          socket.emit("messages_seen", {
            withUserId: selectedUser.user._id,
            messageIds: unseenMessageIds,
          });

          setMessages((prev) =>
            prev.map((m) =>
              unseenMessageIds.includes(m._id) ? { ...m, status: "seen" } : m
            )
          );
        }
        
      } catch (err) {
        setLoading(true)
        console.error(err);
      }finally{
        setLoading(false)
      }
    };

    loadChat();
  }, [selectedUser, myId, socket]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    const handleMessageSent = (msg) => {
      setMessages((prev) =>
        prev.map((m) => (m.tempId === msg.tempId ? msg : m))
      );
    };

    const handleReceiveMessage = (msg) => {
      const senderId = normalizeId(msg.sender);
      if (senderId === normalizeId(selectedUser.user._id)) {
        setMessages((prev) => [...prev, msg]);

        socket.emit("messages_seen", {
          withUserId: selectedUser.user._id,
          messageIds: [msg._id],
        });

        setMessages((prev) =>
          prev.map((m) =>
            m._id === msg._id ? { ...m, status: "seen" } : m
          )
        );
      }
    };

    const handleMessageSeen = ({ by }) => {
      if (String(by) !== String(selectedUser.user._id)) return;

      setMessages(prev =>
        prev.map(msg => {
          if (normalizeId(msg.sender) === myId && msg.status !== "seen") {
            return { ...msg, status: "seen" };
          }
          return msg;
        })
      );
    };

    socket.on("message_sent", handleMessageSent);
    socket.on("receive_message", handleReceiveMessage);
    socket.on("messages_seen", handleMessageSeen);

    return () => {
      socket.off("message_sent", handleMessageSent);
      socket.off("receive_message", handleReceiveMessage);
      socket.off("messages_seen", handleMessageSeen);
    };
  }, [socket, selectedUser, myId]);

  useEffect(() => {
    if (!socket || !selectedUser) return;

    socket.emit("chat_opened", { withUserId: selectedUser?.user?._id });

    setMessages(prev =>
      prev.map(msg => {
        if (
          normalizeId(msg.sender) === selectedUser.user._id &&
          msg.status === "delivered"
        ) {
          return { ...msg, status: "seen" };
        }
        return msg;
      })
    );
  }, [selectedUser, socket]);

  const sendMessage = () => {
    if (!text.trim()) return;

    const tempId = Date.now();
    const newMessage = {
      _id: tempId,
      tempId,
      message: text,
      sender: { _id: myId },
      receiver: { _id: selectedUser.user._id },
      status: "pending",
    };

    setMessages((prev) => [...prev, newMessage]);

    if (!socket?.connected) return;

    socket.emit("send_message", {
      receiverId: selectedUser.user._id,
      message: text,
      tempId,
    });



    setText("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const formatLastSeen = (lastSeen) => {
    if (!lastSeen) return "Offline";

    const last = new Date(lastSeen);
    const now = new Date();

    const diffMs = now - last; // difference in milliseconds
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) {
      return "just now";
    }

    if (diffMinutes < 60) {
      return `${diffMinutes} minute(s) ago`;
    }

    if (diffHours < 24) {
      return `today at ${last.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }

    if (diffDays === 1) {
      return "yesterday";
    }

    return `${diffDays} days ago`;
  };

  return (
    <div className=" h-full flex flex-col">

      <div className="sticky top-0 z-10 bg-white">
        <h1 className="p-4 text-xl font-semibold border-b border-b-black text-orange-500 ">
          {selectedUser?.user?.name}
        </h1>

        <p className="px-4 text-sm text-gray-500">
          {onlineUsers.has(selectedUser?.user?._id)
            ? "Online"
            : selectedUser?.lastSeen && `Last seen ${formatLastSeen(selectedUser.lastSeen)}`
          }
        </p>
      </div>

      <div className="flex-1 p-4 overflow-y-auto flex flex-col space-y-3 bg-gray-50">
        {messages
          .filter((msg) => msg && msg.message)
          .map((msg) => {
            const senderId = normalizeId(msg.sender);
            const isMine = senderId === myId;

            return (
              <div
                key={msg.id || msg.tempId}
                className={`relative flex flex-col w-fit max-w-xs px-3 py-2 rounded-lg text-white
                         ${isMine ? "bg-orange-500 ml-auto" : "bg-gray-700"} `}
              >
                <span className="text-sm">{msg.message}</span>

                {isMine && (
                  <div className="mt-1 flex items-center justify-end gap-1 text-[11px] text-gray-200">
                    <span>
                      {(new Date(msg.createdAt || Date.now()).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      }))}
                    </span>

                    {msg.status === "pending" && (
                      <Clock1 className="w-3 h-3 opacity-50" />
                    )}

                    {msg.status === "sent" && (
                      <Check className="w-3 h-3" />
                    )}

                    {msg.status === "delivered" && (
                      <CheckCheck className="w-3 h-3" />
                    )}

                    {msg.status === "seen" && (
                      <CheckCheck className="w-3 h-3 text-green-300" />
                    )}
                  </div>
                )}
              </div>

            );
          })}
        <div ref={scrollRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 p-4 bg-white border-t">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 p-2 border rounded-lg"
          placeholder="Type a message..."
        />
        <button type="submit" className="px-4 py-2 text-gray-500">
          <PaperAirplaneIcon className="w-6 h-6 text-orange-500" />
        </button>
      </form>
    </div>
  );
}

export default ChatWindow;
