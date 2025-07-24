import React, { useState } from 'react';
import { Send } from 'lucide-react';

const MessageInput = () => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      console.log('Send:', message);
      setMessage('');
    }
  };

  return (
    <div className="w-full px-4 py-3 bg-[#0d1117] border-t border-[#1f2937]">
      <div className="flex items-center gap-3 bg-[#161b22] rounded-full px-4 py-2 shadow-inner focus-within:ring-2 focus-within:ring-indigo-500 transition">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          className="flex-1 bg-transparent outline-none text-white placeholder:text-gray-400 text-sm sm:text-base"
        />
        <button
          onClick={handleSend}
          className="p-2 rounded-full hover:bg-indigo-600 hover:text-white transition text-gray-400"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
