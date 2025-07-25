import React from "react";
import { useNavigate } from "react-router-dom";

const mockFriends = [
  // Users
  {
    id: 101,
    type: "user",
    username: "style_guru_ryan",
    displayName: "Ryan Cooper",
    avatar: "https://i.pravatar.cc/150?img=33",
    bio: "Streetwear connoisseur. I live for kicks and custom fits.",
  },
  {
    id: 102,
    type: "user",
    username: "boho_blossom",
    displayName: "Ella Rose",
    avatar: "https://i.pravatar.cc/150?img=45",
    bio: "Boho babe with a love for earthy tones and layered textures.",
  },
  {
    id: 103,
    type: "user",
    username: "sleek_and_chic",
    displayName: "Nina Patel",
    avatar: "https://i.pravatar.cc/150?img=55",
    bio: "Minimalism is not boring. It’s an art form.",
  },

  // Brands
  {
    id: 201,
    type: "brand",
    username: "urbanthreadz",
    displayName: "UrbanThreadz (Brand)",
    avatar: "https://i.pravatar.cc/150?img=12",
    bio: "Fresh streetwear drops weekly. DM for collabs!",
  },
  {
    id: 202,
    type: "brand",
    username: "boho_earthwear",
    displayName: "Boho Earthwear (Brand)",
    avatar: "https://i.pravatar.cc/150?img=28",
    bio: "Sustainable fashion for free spirits.",
  },
  {
    id: 203,
    type: "brand",
    username: "minimaluxe",
    displayName: "MinimaLuxe (Brand)",
    avatar: "https://i.pravatar.cc/150?img=20",
    bio: "Luxury in simplicity. Let your style breathe.",
  },
];

const FriendsList = () => {
  const navigate = useNavigate();

  const handleChat = (id) => {
    navigate(`/chats/${id}`);
  };

  return (
    <div className="p-1">
      <h2 className="text-lg font-bold mb-4 text-white">Your Swag Circle</h2>
      <ul className="space-y-4">
        {mockFriends.map((friend) => (
          <li
            key={friend.id}
            className="flex items-center bg-white/5 p-3 rounded-xl backdrop-blur-md shadow-md"
          >
            <img
              src={friend.avatar}
              alt={friend.username}
              className="w-14 h-14 rounded-full object-cover border border-white mr-4"
            />
            <div className="flex-1">
              <p className="text-base font-semibold text-white">
                {friend.displayName}
              </p>
              <p className="text-sm text-gray-300">@{friend.username}</p>
              <p className="text-xs text-gray-400 mt-1">{friend.bio}</p>
            </div>
            <div className="flex flex-col space-y-2 ml-3">
              <button
                onClick={() => handleChat(friend.id)}
                className="group relative inline-flex items-center px-4 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-md transition-all duration-300 hover:from-indigo-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg
                  className="w-4 h-4 mr-2 text-white group-hover:scale-110 transform transition-transform"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
                Chat
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendsList;
