import React, { useState, useEffect } from "react";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../../../firebase";
import { sendFriendRequest } from "../../../functions/Userfunctions";
import { useAuth } from "../../../context/AuthContext";

const calculateMatchScore = (userA, userB) => {
  if (!userA?.swipeData || !userB?.swipeData) return 0;

  let totalCategories = 0;
  let commonLikes = 0;

  for (const style in userA.swipeData) {
    if (userB.swipeData[style]) {
      totalCategories++;
      const likesA = userA.swipeData[style]?.likes || 0;
      const likesB = userB.swipeData[style]?.likes || 0;
      commonLikes += Math.min(likesA, likesB);
    }
  }

  // Assuming maximum likes per category = 50
  return totalCategories > 0
    ? (commonLikes / (totalCategories * 50)) * 100
    : 0;
};

// 🔹 Fetch suggestions based on match score
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

    const score = calculateMatchScore(currentUser, otherUser);
    if (score > 65) {
      suggestions.push({
        id: otherUser.id,
        username: otherUser.username || "Unknown User",
        displayName: otherUser.name || "",
        avatar:
          otherUser.profilePic || "https://i.pravatar.cc/150?img=1",
        styleMatch: Math.round(score),
      });
    }
  }
  return suggestions.sort((a, b) => b.styleMatch - a.styleMatch);
};

const SuggestedUsers = ({ onUserClick }) => {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState([]);
  const [loadingStates, setLoadingStates] = useState({});
  const [followingStates, setFollowingStates] = useState({});

  useEffect(() => {
    const loadSuggestions = async () => {
      if (!user?.uid) return;
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) return;
      const currentUserData = { id: user.uid, ...userDoc.data() };
      const result = await generateSuggestionsForUser(currentUserData);
      setSuggestions(result);
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

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Suggested for You</h3>
      <div className="grid gap-4">
        {suggestions.map((user) => {
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
                <Button
                  variant={isFriends ? "outline" : "default"}
                  size="sm"
                  onClick={() => handleFollow(user.id)}
                  disabled={isFriends}
                  loading={isLoading}
                >
                  {isFriends ? "Requested" : "Request"}
                </Button>
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
        })}
      </div>
    </div>
  );
};

export default SuggestedUsers;
