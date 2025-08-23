import React, { useState, useEffect } from "react";
import {
  FaInstagram,
  FaSnapchatGhost,
  FaArrowLeft,
  FaPen,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import {
  getUserData,
  sendFriendRequest,
  removeFriend,
  cancelFriendRequest,
} from "functions/Userfunctions";
import { useAuth } from "../../context/AuthContext";
import BrandProducts from "./BrandProducts";

const ProfileComponent = ({ profile, isOwnProfile = false }) => {
  const { user } = useAuth();
  const { id } = useParams();
  const [followState, setFollowState] = useState("unfollowed");
  const [loadingFollowState, setLoadingFollowState] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkFollowing = async () => {
      if (!user?.uid || !id) return;

      try {
        const userdata = await getUserData(user.uid);

        const isFollowing = userdata.matched?.includes(id);
        const isRequest = userdata.sentRequests?.includes(id);

        if (isFollowing) {
          setFollowState("following");
        } else if (isRequest) {
          setFollowState("requested");
        } else {
          setFollowState("unfollowed");
        }
      } catch (error) {
        console.error("Error checking follow state:", error);
      } finally {
        setLoadingFollowState(false);
      }
    };

    checkFollowing();
  }, [user, id]);

  const handleFollow = async () => {
    try {
      if (followState === "unfollowed") {
        // Send friend request in Firestore
        await sendFriendRequest(user.uid, id);
        setFollowState("requested");
      } else if (followState === "following") {
        await removeFriend(user.uid, id);
        setFollowState("unfollowed");
      } else {
        await cancelFriendRequest(user.uid, id);
        setFollowState("requested");
      }
    } catch (error) {
      console.error("Error updating follow state:", error);
    }
  };

  // ✅ Show loader until follow state is ready
  if (loadingFollowState) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-6 py-6">
      {/* Back Button */}
      <button
        onClick={() => navigate("/friend-discovery")}
        className="flex items-center text-gray-300 hover:text-white mb-4"
      >
        <FaArrowLeft className="mr-2" />
        Back
      </button>

      {/* Avatar + Info */}
      <div className="text-center space-y-4">
        <img
          src={
            profile.profilePic ||
            "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0="
          }
          className="w-24 h-24 mx-auto rounded-full object-cover border-4 border-pink-500"
          alt="Profile"
        />

        <div>
          <h2 className="text-2xl font-bold">{profile.name}</h2>
          <p className="text-gray-400 text-sm">@{profile.username}</p>
        </div>

        {/* Edit or Follow Button */}
        {isOwnProfile ? (
          <button className="bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-xl font-medium text-white flex items-center gap-2 mx-auto">
            <FaPen />
            Edit Profile
          </button>
        ) : (
          <button
            onClick={followState === "requested" ? undefined : handleFollow}
            disabled={followState === "requested"}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              followState === "unfollowed"
                ? "bg-pink-600 hover:bg-pink-700"
                : followState === "requested"
                ? "bg-yellow-400 text-black cursor-not-allowed"
                : "bg-gray-300 text-black hover:bg-gray-400"
            }`}
          >
            {followState === "unfollowed"
              ? "Follow"
              : followState === "requested"
              ? "Requested"
              : "Unfollow"}
          </button>
        )}
      </div>

      {/* Bio */}
      {profile.bio && (
        <p className="mt-6 text-center text-gray-200 px-4">{profile.bio}</p>
      )}

      {/* Tags */}
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {profile.interests?.map((interest, idx) => (
          <span
            key={idx}
            className="bg-[#1e293b] text-white border border-gray-600 px-3 py-1 text-sm rounded-full"
          >
            #{interest.toLowerCase()}
          </span>
        ))}
      </div>

      {/* Socials */}
      <div className="mt-6 flex justify-center gap-6 text-2xl text-pink-400">
        {profile.instagram && (
          <a
            href={`https://instagram.com/${profile.instagram}`}
            target="_blank"
            rel="noreferrer"
          >
            <FaInstagram className="hover:text-pink-500 transition" />
          </a>
        )}
        {profile.snapchat && (
          <a
            href={`https://snapchat.com/add/${profile.snapchat}`}
            target="_blank"
            rel="noreferrer"
          >
            <FaSnapchatGhost className="hover:text-yellow-400 transition" />
          </a>
        )}
      </div>
      {profile.isBrand && (
        <div className="mt-10">
          <BrandProducts uid={id} />
        </div>
      )}
    </div>
  );
};

export default ProfileComponent;
