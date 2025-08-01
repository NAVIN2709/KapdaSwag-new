import React from "react";
import { Send, Image as ImageIcon, X } from "lucide-react";
import useChat from "functions/useChat";

const MessageInput = ({ currentUserId, otherUserId }) => {
  const { input, image, setImage, handleSend, handleInputChange } =
    useChat({ currentUserId, otherUserId });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // save base64 image to state
      };
      reader.readAsDataURL(file);
    }
  };

  const sendMessage = () => {
    handleSend(input, image);
  };

  return (
    <div className="w-full px-4 py-3 bg-[#0d1117] border-t border-[#1f2937]">
      {image && (
        <div className="mb-2 relative inline-block">
          <img
            src={image}
            alt="preview"
            className="h-20 w-20 object-cover rounded-lg border border-gray-700"
          />
          <button
            onClick={() => setImage(null)}
            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex items-center gap-3 bg-[#161b22] rounded-full px-4 py-2 shadow-inner focus-within:ring-2 focus-within:ring-indigo-500 transition">
        <label className="cursor-pointer text-gray-400 hover:text-indigo-400">
          <ImageIcon className="w-5 h-5" />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </label>

        <input
          type="text"
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 bg-transparent outline-none text-white placeholder:text-gray-400 text-sm sm:text-base"
        />

        <button
          onClick={sendMessage}
          className="p-2 rounded-full hover:bg-indigo-600 hover:text-white transition text-gray-400"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
