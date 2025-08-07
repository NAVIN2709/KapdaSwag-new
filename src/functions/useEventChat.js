import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";

export const sendEventMessage = async ({
  eventId,
  senderId,
  text,
  mediaUrl = null,
  senderImage = null,
  username,
}) => {
  try {
    if (!eventId) {
      console.error("Missing eventId");
      return;
    }
    if (!senderId) {
      console.error("Missing senderId");
      return;
    }
    if (!text?.trim() && !mediaUrl) {
      console.error("Message must contain either text or media");
      return;
    }

    const newMessage = {
      sender: senderId,
      text: text?.trim() || null,
      media: mediaUrl || null, // You can rename to `media` if supporting both image/video
      senderImage: senderImage || null,
      username: username,
      timestamp: serverTimestamp(),
      isRead: false,
    };

    await addDoc(collection(db, "events", eventId, "messages"), newMessage);
  } catch (error) {
    console.error("❌ Error sending event message:", error);
  }
};

//Listen to live messages
const useEventChat = (eventId) => {
  const [eventMessages, setEventMessages] = useState([]);

  useEffect(() => {
    if (!eventId) return;

    const q = query(
      collection(db, "events", eventId, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEventMessages(messages);
    });

    return () => unsubscribe();
  }, [eventId]);

  return { eventMessages };
};

export default useEventChat;
