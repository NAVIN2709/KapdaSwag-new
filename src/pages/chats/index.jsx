// chats/index.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import ChatList from "../chats/components/ChatList";
import { ArrowLeft } from "lucide-react"; // optional, if you're using lucide icons

const ChatHome = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="fixed top-0 w-full z-10 p-4 bg-background shadow-sm flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-white hover:text-gray-300 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>
        <h1 className="text-xl font-extrabold tracking-tight text-white text-center flex-1">
          Your Swag Circle
        </h1>
        <div className="w-14" /> {/* Spacer to balance flex */}
      </div>

      <div className="pt-20">
        <ChatList />
      </div>
    </div>
  );
};

export default ChatHome;
