import React from "react";

const mockFriends = [
  {
    id: 101,
    username: "style_guru_ryan",
    displayName: "Ryan Cooper",
    avatar: "https://i.pravatar.cc/150?img=33",
    bio: "Streetwear connoisseur. I live for kicks and custom fits.",
  },
  {
    id: 102,
    username: "boho_blossom",
    displayName: "Ella Rose",
    avatar: "https://i.pravatar.cc/150?img=45",
    bio: "Boho babe with a love for earthy tones and layered textures.",
  },
  {
    id: 103,
    username: "sleek_and_chic",
    displayName: "Nina Patel",
    avatar: "https://i.pravatar.cc/150?img=55",
    bio: "Minimalism is not boring. It’s an art form.",
  },
];

const FriendsList = () => {
  const handleUnfollow = (id) => {
    console.log("Unfollowed user:", id);
  };

  return (
    <div className="p-1">
      <h2 className="text-lg font-bold mb-4 text-white">Your Swag Circle</h2>
      <ul className="space-y-4">
        {mockFriends.map((friend) => (
          <li
            key={friend.id}
            className="flex items-center p-3 rounded-xl backdrop-blur-md shadow-md"
          >
            <img
              src={friend.avatar}
              alt={friend.username}
              className="w-14 h-14 rounded-full object-cover border border-white mr-4"
            />
            <div className="flex-1">
              <p className="text-base font-semibold text-white">{friend.displayName}</p>
              <p className="text-sm text-gray-300">@{friend.username}</p>
              <p className="text-xs text-gray-400 mt-1">{friend.bio}</p>
            </div>
            <button
              onClick={() => handleUnfollow(friend.id)}
              className="ml-3 px-3 py-1 text-xs bg-pink-600 text-white rounded-full hover:bg-pink-700"
            >
              Unfollow
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendsList;
