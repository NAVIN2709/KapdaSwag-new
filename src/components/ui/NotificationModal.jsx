import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Icon from "components/AppIcon";

const Notifications = () => {
  const { user } = useAuth();
  const [friendRequests, setFriendRequests] = useState([]); // will store full user details

  useEffect(() => {
    const fetchRequests = async () => {
      if (!user?.uid) return;
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        if (Array.isArray(data.incomingRequests) && data.incomingRequests.length) {
          // Fetch full details for each requester
          const requestsData = await Promise.all(
            data.incomingRequests.map(async (id) => {
              const requesterRef = doc(db, "users", id);
              const requesterSnap = await getDoc(requesterRef);
              return requesterSnap.exists()
                ? { id, ...requesterSnap.data() }
                : null;
            })
          );
          setFriendRequests(requestsData.filter(Boolean)); // remove nulls
        } else {
          setFriendRequests([]); // explicitly set empty if no requests
        }
      }
    };

    fetchRequests();
  }, [user]);

  const handleAccept = async (requesterId) => {
    if (!user?.uid) return;
    const currentUserRef = doc(db, "users", user.uid);
    const requesterRef = doc(db, "users", requesterId);

    const currentUserSnap = await getDoc(currentUserRef);
    const requesterSnap = await getDoc(requesterRef);

    if (currentUserSnap.exists() && requesterSnap.exists()) {
      const currentUserData = currentUserSnap.data();
      const requesterData = requesterSnap.data();

      await updateDoc(currentUserRef, {
        incomingRequests: currentUserData.incomingRequests.filter(
          (id) => id !== requesterId
        ),
        matched: [...(currentUserData.matched || []), requesterId],
      });

      await updateDoc(requesterRef, {
        sentRequests: requesterData.sentRequests.filter((id) => id !== user.uid),
        matched: [...(requesterData.matched || []), user.uid],
      });

      setFriendRequests((prev) => prev.filter((req) => req.id !== requesterId));
    }
  };

  const handleReject = async (requesterId) => {
    if (!user?.uid) return;
    const currentUserRef = doc(db, "users", user.uid);
    const currentUserSnap = await getDoc(currentUserRef);

    if (currentUserSnap.exists()) {
      const currentUserData = currentUserSnap.data();
      await updateDoc(currentUserRef, {
        incomingRequests: currentUserData.incomingRequests.filter(
          (id) => id !== requesterId
        ),
      });
      setFriendRequests((prev) => prev.filter((req) => req.id !== requesterId));
    }
  };

  return (
    <div className="px-4 py-5 space-y-5">
      <div className="flex items-center gap-2">
        <Icon name="Bell" size={20} className="text-black"/>
        <h2 className="text-xl font-semibold text-black">Notifications</h2>
      </div>

      <div className="space-y-4">
        {friendRequests.length > 0 ? (
          friendRequests.map((requester) => (
            <div
              key={requester.id}
              className="p-4 rounded-xl border bg-white/5 backdrop-blur-md shadow hover:shadow-lg transition flex items-start gap-3"
            >
              <img
                src={
                  requester.profilePic ||
                  "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0="
                }
                alt={requester.name || "User"}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-base text-black">
                    {requester.name || "Unknown User"}
                  </h3>
                  <div className="px-2 py-0.5 text-xs rounded-md bg-blue-100 text-blue-700 border">
                    Friend Request
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  @{requester.username || "unknown"}
                </p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleAccept(requester.id)}
                    className="px-3 py-1 text-sm rounded-md bg-green-500 text-white hover:bg-green-600"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleReject(requester.id)}
                    className="px-3 py-1 text-sm rounded-md bg-red-500 text-white hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 text-sm">No New Notifications</p>
        )}
      </div>
    </div>
  );
};

export default Notifications;
