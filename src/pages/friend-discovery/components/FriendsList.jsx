import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFriends } from "functions/Userfunctions"; // move your function here
import { useAuth } from "../../../context/AuthContext"; // to get logged-in user

const FriendsList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleChat = (id) => {
    navigate(`/chats/${id}`);
  };

  useEffect(() => {
    const fetchFriends = async () => {
      if (!user?.uid) return;
      try {
        const matched = await getFriends(user.uid);
        setFriends(matched);
      } catch (error) {
        console.error("Error loading matched friends:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFriends();
  }, [user]);

  if (loading) {
    return (
      <div className="p-3 flex flex-col items-center text-gray-400">
        <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mb-2"></div>
        Loading your Swag Circle...
      </div>
    );
  }

  if (friends.length === 0) {
    return (
      <div className="p-1 text-center text-gray-400">
        No matched friends yet 😢
      </div>
    );
  }

  return (
    <div className="p-1">
      <h2 className="text-lg font-bold mb-4 text-white">Your Swag Circle</h2>
      <ul className="space-y-4">
        {friends.map((friend) => (
          <li
            key={friend.id}
            className="flex items-center bg-white/5 p-3 rounded-xl backdrop-blur-md shadow-md"
          >
            <img
              src={friend.profilePic || "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0="}
              alt={friend.username}
              className="w-14 h-14 rounded-full object-cover border border-white mr-4"
            />
            <div className="flex-1">
              <p className="text-base font-semibold text-white" onClick={()=>{navigate(`/profile/${friend.id}`)}}>
                {friend.name || friend.displayName}
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
