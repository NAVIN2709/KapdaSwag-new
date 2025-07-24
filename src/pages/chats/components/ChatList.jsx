// chats/components/ChatList.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const dummyUsers = [
  {
    id: 1,
    username: "anushka",
    profilePicture: "https://i.pravatar.cc/150?img=47",
  },
  {
    id: 2,
    username: "aryan",
    profilePicture: "https://i.pravatar.cc/150?img=12",
  },
  {
    id: 3,
    username: "shruti",
    profilePicture: "https://i.pravatar.cc/150?img=31",
  },
  { id: 4, username: "dev", profilePicture: "https://i.pravatar.cc/150?img=4" },
  {
    id: 5,
    username: "meera",
    profilePicture: "https://i.pravatar.cc/150?img=56",
  },
  {
    id: 6,
    username: "rahul",
    profilePicture: "https://i.pravatar.cc/150?img=22",
  },
  {
    id: 7,
    username: "isha",
    profilePicture: "https://i.pravatar.cc/150?img=66",
  },
  {
    id: 8,
    username: "rohan",
    profilePicture: "https://i.pravatar.cc/150?img=9",
  },
];

const ChatList = () => {
  const navigate = useNavigate();

  const openChat = (userId) => {
    navigate(`/chats/${userId}`); // Navigates to ChatScreen
  };

  return (
    <div>
      {dummyUsers.map((user) => (
        <div
          key={user.id}
          className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-100 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
          onClick={() => openChat(user.id)}
        >
          <img
            src={user.profilePicture}
            alt={user.username}
            className="w-14 h-14 rounded-full border-2 border-gray-200 shadow-sm object-cover"
          />
          <div>
            <p className="font-semibold text-white">{user.username}</p>
            <p className="text-sm text-gray-500">Tap to chat</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatList;
