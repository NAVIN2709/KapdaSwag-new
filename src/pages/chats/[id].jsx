import { useState } from "react";
import { useParams } from "react-router-dom";
import clsx from "clsx";
import ProfileHeader from "../chats/components/ProfileHeader";
import MessageInput from "../chats/components/MessageInput";
import { motion } from "framer-motion";
import { Dialog } from "@headlessui/react";
import { Link } from "react-router-dom";

const ChatScreen = () => {
  const { id } = useParams();

  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [reaction, setReaction] = useState(null);

  const user = {
    id,
    username: `User ${id}`,
    profilePicture: `https://i.pravatar.cc/150?img=9`,
  };

  const currentUserId = "me";

  const messages = [
    {
      id: 1,
      senderId: "me",
      text: "Hey! How’s it going? 😄",
      time: "10:35 AM",
    },
    {
      id: 2,
      senderId: id,
      text: "All good! Check this out 👀",
      time: "10:36 AM",
    },
    {
      id: 3,
      senderId: id,
      image: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d",
      time: "10:36 AM",
    },
    {
      id: 4,
      senderId: "me",
      text: "🔥🔥🔥 Bro that’s sick!",
      time: "10:37 AM",
    },
    {
      id: 5,
      senderId: id,
      text: "Thanks, clicked it yesterday evening.",
      time: "10:38 AM",
    },
    {
      id: 6,
      senderId: "me",
      image: "https://images.unsplash.com/photo-1581291519195-ef11498d1cf5",
      time: "10:39 AM",
    },
  ];

  const handleImageClick = (url) => setFullscreenImage(url);
  const handleDoubleTap = (id) => setReaction(id);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white">
      <Link to={`/profile/${user.id}`}>
        <ProfileHeader user={user} />
      </Link>

      {/* Message List */}
      <div className="flex-1 overflow-y-scroll p-4 space-y-4">
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUserId;
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
                {isMe ? "You" : user.username} • {msg.time}
              </span>

              {/* Reaction animation (❤️) */}
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
      <MessageInput />

      {/* Fullscreen image viewer */}
      <Dialog open={!!fullscreenImage} onClose={() => setFullscreenImage(null)}>
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <button
            onClick={() => setFullscreenImage(null)}
            className="absolute top-6 right-6 text-white text-2xl bg-black/50 hover:bg-black/70 rounded-full p-2 focus:outline-none"
            aria-label="Close image viewer"
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
