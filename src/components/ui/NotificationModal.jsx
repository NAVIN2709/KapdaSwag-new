import React, { useEffect, useState } from "react";
import { Palette, Users, BadgeCheck, VideoIcon, UserPlus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const staticNotifications = [
  {
    id: "n1",
    type: "Design Challenge",
    title: "Urban Fusion 2025",
    description: "New challenge by Zara for Gen Z streetwear designers.",
    icon: <Palette className="text-pink-500" size={22} />,
    time: "3 days left",
    tag: "Upcoming",
  },
  {
    id: "n2",
    type: "Brand Collab",
    title: "KapdaSwag x H&M",
    description: "H&M is looking for indie designers to co-create.",
    icon: <Users className="text-green-500" size={22} />,
    time: "Apply by July 30",
    tag: "Collab",
  }
];

const Notifications = () => {
  const { user } = useAuth();
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!user?.uid) return;
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        if (Array.isArray(data.receivedRequests)) {
          setFriendRequests(data.receivedRequests);
        }
      }
    };

    fetchRequests();
  }, [user]);

  const handleAccept = async (requesterId) => {
    if (!user?.uid) return;
    const currentUserRef = doc(db, "users", user.uid);
    const requesterRef = doc(db, "users", requesterId);

    // Remove request from both sides & add to matched list
    const currentUserSnap = await getDoc(currentUserRef);
    const requesterSnap = await getDoc(requesterRef);

    if (currentUserSnap.exists() && requesterSnap.exists()) {
      const currentUserData = currentUserSnap.data();
      const requesterData = requesterSnap.data();

      await updateDoc(currentUserRef, {
        receivedRequests: currentUserData.receivedRequests.filter(id => id !== requesterId),
        matched: [...(currentUserData.matched || []), requesterId]
      });

      await updateDoc(requesterRef, {
        sentRequests: requesterData.sentRequests.filter(id => id !== user.uid),
        matched: [...(requesterData.matched || []), user.uid]
      });

      setFriendRequests(prev => prev.filter(id => id !== requesterId));
    }
  };

  const handleReject = async (requesterId) => {
    if (!user?.uid) return;
    const currentUserRef = doc(db, "users", user.uid);

    const currentUserSnap = await getDoc(currentUserRef);
    if (currentUserSnap.exists()) {
      const currentUserData = currentUserSnap.data();
      await updateDoc(currentUserRef, {
        receivedRequests: currentUserData.receivedRequests.filter(id => id !== requesterId)
      });
      setFriendRequests(prev => prev.filter(id => id !== requesterId));
    }
  };

  return (
    <div className="px-4 py-5 space-y-5">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold text-black">Notifications</h2>
      </div>

      <div className="space-y-4">
        {/* Friend Requests */}
        {friendRequests.map((requesterId) => (
          <div
            key={requesterId}
            className="p-4 rounded-xl border bg-white/5 backdrop-blur-md shadow hover:shadow-lg transition flex items-start gap-3"
          >
            <div className="mt-1">
              <UserPlus className="text-indigo-500" size={22} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-base text-black">
                  New Friend Request
                </h3>
                <div className="px-2 py-0.5 text-xs rounded-md bg-blue-100 text-blue-700 border">
                  Friend
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Someone sent you a friend request.
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleAccept(requesterId)}
                  className="px-3 py-1 text-sm rounded-md bg-green-500 text-white hover:bg-green-600"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleReject(requesterId)}
                  className="px-3 py-1 text-sm rounded-md bg-red-500 text-white hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Static Notifications */}
        {staticNotifications.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl border bg-white/5 backdrop-blur-md shadow hover:shadow-lg transition flex items-start gap-3"
          >
            <div className="mt-1">{item.icon}</div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-base text-black">
                  {item.title}
                </h3>
                <div className="px-2 py-0.5 text-xs rounded-md bg-muted text-muted-foreground border">
                  {item.tag}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {item.description}
              </p>
              <p className="text-xs mt-2 text-muted-foreground">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
