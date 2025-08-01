import React, { useState,useEffect } from "react";
import { useParams } from "react-router-dom";
import clsx from "clsx";
import ProfileHeader from "../chats/components/ProfileHeader";
import MessageInput from "../chats/components/MessageInput";
import { motion } from "framer-motion";
import { Dialog } from "@headlessui/react";
import { useAuth } from "../../context/AuthContext"; // 👈 your auth hook
import useChat from "functions/useChat"; // 👈 hook you wrote
import { getUserData } from "functions/Userfunctions";

const ChatScreen = () => {
  const { id: otherUserId } = useParams();
  const { user: authUser } = useAuth();
  const currentUserId = authUser?.uid;
  const { messages } = useChat({ currentUserId, otherUserId });

  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [reaction, setReaction] = useState(null);
  const [otheruserdata, setOtheruserdata] = useState(null);

useEffect(() => {
  if (!otherUserId) return;
  const fetchData = async () => {
    try {
      const data = await getUserData(otherUserId); // Firestore fetch
      setOtheruserdata(data);
    } catch (error) {
      console.error("Error fetching other user data:", error);
    }
  };
  fetchData();
}, [otherUserId]);

// Prevent error when data not loaded yet
if (!otheruserdata || !currentUserId) {
  return (
    <div className="flex items-center justify-center h-screen text-gray-400">
      Loading chat...
    </div>
  );
}

const user = {
  id: otherUserId,
  username: otheruserdata.username || "Unknown User",
  profilePicture: otheruserdata.profilePic || "https://i.pravatar.cc/150?u=default",
};


  const handleImageClick = (url) => setFullscreenImage(url);
  const handleDoubleTap = (id) => setReaction(id);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white">
      <ProfileHeader user={user} />

      {/* Message List */}
      <div className="flex-1 overflow-y-scroll p-4 space-y-4">
        {messages.map((msg) => {
          const isMe = msg.sender === currentUserId;
          return (
            <div
              key={msg.id}
              onDoubleClick={() => handleDoubleTap(msg.id)}
              className={clsx(
                "relative max-w-[75%] transition-all",
                isMe ? "ml-auto text-right" : "mr-auto text-left"
              )}
            >
              <motion.div
                initial={{ opacity: 0.3, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={clsx(
                  "rounded-2xl px-4 py-2 text-sm break-words",
                  isMe
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                    : "bg-white text-gray-800 shadow-lg shadow-purple-300/40"
                )}
              >
                {msg.text && <p>{msg.text}</p>}
                {msg.image && (
                  <img
                    onClick={() => handleImageClick(msg.image)}
                    src={msg.image}
                    alt="media"
                    className="mt-2 rounded-xl max-h-60 cursor-pointer hover:brightness-90 transition"
                  />
                )}
              </motion.div>
              <span className="text-xs text-gray-400 mt-1 block">
                {isMe ? "You" : user.username} •{" "}
                {msg.timestamp?.toDate
                  ? msg.timestamp.toDate().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : ""}
              </span>

              {reaction === msg.id && (
                <motion.div
                  className="absolute -top-6 text-3xl"
                  animate={{ scale: [1, 1.5, 1], opacity: [0, 1, 0] }}
                  transition={{ duration: 1 }}
                >
                  ❤️
                </motion.div>
              )}
            </div>
          );
        })}
      </div>

      {/* Message Input */}
      <MessageInput currentUserId={currentUserId} otherUserId={otherUserId} />

      {/* Fullscreen image viewer */}
      <Dialog open={!!fullscreenImage} onClose={() => setFullscreenImage(null)}>
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <button
            onClick={() => setFullscreenImage(null)}
            className="absolute top-6 right-6 text-white text-2xl bg-black/50 hover:bg-black/70 rounded-full p-2"
          >
            ✕
          </button>
          <img
            src={fullscreenImage}
            alt="Full"
            className="max-h-[90%] max-w-[90%] rounded-xl shadow-xl"
          />
        </div>
      </Dialog>
    </div>
  );
};

export default ChatScreen;
