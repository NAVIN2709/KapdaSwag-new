import React, { useState, useEffect } from "react";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../../../firebase";
import { sendFriendRequest } from "../../../functions/Userfunctions";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const calculateInterestMatch = (userA, userB) => {
  if (!userA?.interests || !userB?.interests) return 0;

  const setA = new Set(userA.interests.map((i) => i.toLowerCase()));
  const setB = new Set(userB.interests.map((i) => i.toLowerCase()));

  const common = [...setA].filter((tag) => setB.has(tag));
  const totalUnique = new Set([...setA, ...setB]).size;

  return totalUnique > 0 ? (common.length / totalUnique) * 100 : 0;
};

const generateSuggestionsForUser = async (currentUser) => {
  const allUsersSnap = await getDocs(collection(db, "users"));
  const allUsers = allUsersSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  const suggestions = [];
  const sentRequests = currentUser.sentRequests || [];
  const matchedFriends = currentUser.matched || [];

  for (const otherUser of allUsers) {
    if (
      otherUser.id === currentUser.id ||
      sentRequests.includes(otherUser.id) ||
      matchedFriends.includes(otherUser.id)
    )
      continue;

    const score = calculateInterestMatch(currentUser, otherUser);
    if (score > 10) {
      // match threshold
      suggestions.push({
        id: otherUser.id,
        username: otherUser.username || "Unknown User",
        displayName: otherUser.name || "",
        avatar:
          otherUser.profilePic ||
          "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0=",
        styleMatch: Math.round(score),
        styleTags: otherUser.interests || [],
      });
    }
  }
  return suggestions.sort((a, b) => b.styleMatch - a.styleMatch);
};

const SuggestedUsers = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState([]);
  const [loadingStates, setLoadingStates] = useState({});
  const [followingStates, setFollowingStates] = useState({});
  const [isLoading, setIsLoading] = useState(true); // 🔹 new loading state

  useEffect(() => {
    const loadSuggestions = async () => {
      if (!user?.uid) return;
      setIsLoading(true);
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        setIsLoading(false);
        return;
      }
      const currentUserData = { id: user.uid, ...userDoc.data() };
      const result = await generateSuggestionsForUser(currentUserData);
      setSuggestions(result);
      setIsLoading(false);
    };
    loadSuggestions();
  }, [user]);

  const handleFollow = async (userId) => {
    setLoadingStates((prev) => ({ ...prev, [userId]: true }));
    try {
      await sendFriendRequest(user.uid, userId);
      setFollowingStates((prev) => ({ ...prev, [userId]: true }));
    } catch (error) {
      console.error("Follow failed:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [userId]: false }));
    }
  };
  const onUserClick = (user) => {
    navigate(`/profile/${user.id}`);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">
        Suggested for You
      </h3>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
          <svg
            className="animate-spin h-6 w-6 mb-2 text-primary"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          <p>Loading suggestions...</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {suggestions.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No suggestions found.
            </p>
          ) : (
            suggestions.map((user) => {
              const isFriends = followingStates[user.id];
              const isLoading = loadingStates[user.id];

              return (
                <div
                  key={user.id}
                  className="bg-card border border-border rounded-xl p-4 space-y-4 hover:border-primary/20"
                >
                  <div className="flex items-start justify-between">
                    <div
                      className="flex items-center space-x-3 cursor-pointer flex-1"
                      onClick={() => onUserClick(user)}
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-muted">
                        <Image
                          src={user.avatar}
                          alt={user.username}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">
                          @{user.username}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {user.displayName}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleFollow(user.id)}
                      disabled={isFriends || isLoading}
                      className={`group relative inline-flex items-center px-4 py-1.5 text-sm font-medium text-white rounded-full shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                        isFriends
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-500 hover:to-blue-600"
                      }`}
                    >
                      {isLoading ? (
                        <svg
                          className="animate-spin h-4 w-4 mr-2 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-4 h-4 mr-2 text-white group-hover:scale-110 transform transition-transform"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M18 9a3 3 0 00-6 0v3H9l3 3 3-3h-3V9a1 1 0 112 0v3h2V9z" />
                        </svg>
                      )}
                      {isFriends ? "Requested" : "Request"}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {user.styleTags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default SuggestedUsers;
