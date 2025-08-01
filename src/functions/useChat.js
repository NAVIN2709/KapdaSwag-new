import { useState, useCallback, useEffect } from "react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  limit,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase";

const getChatId = (uid1, uid2) => [uid1, uid2].sort().join("_");

// 🔍 Get last message for chat
export const getLastMessage = async (chatId) => {
  try {
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("timestamp", "desc"),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const lastDoc = querySnapshot.docs[0];
      const lastMessage = lastDoc.data();
      return {
        id: lastDoc.id,
        ...lastMessage,
      };
    }
    return null;
  } catch (error) {
    console.error("Error getting last message:", error);
    return null;
  }
};

const useChat = ({ currentUserId, otherUserId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [image, setImage] = useState(null); // ⬅ new state for image sending
  const chatId = getChatId(currentUserId, otherUserId);

  useEffect(() => {
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("timestamp")
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const newMessages = [];

      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        const messageId = docSnap.id;

        // 🟦 Mark messages as read if they were sent by the other user
        if (data.sender === otherUserId && !data.isRead) {
          const messageRef = doc(db, "chats", chatId, "messages", messageId);
          await updateDoc(messageRef, { isRead: true });
        }

        newMessages.push({
          id: messageId,
          ...data,
        });
      }

      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, [chatId, currentUserId, otherUserId]);

  // 📩 Send message (text + optional image)
  const handleSend = useCallback(
    async (text, imgBase64) => {
      if (!currentUserId || !otherUserId) {
        console.error("❌ Missing user IDs for sending message");
        return;
      }

      if (!text?.trim() && !imgBase64) return;

      const newMessage = {
        sender: currentUserId,
        text: text?.trim() || null,
        image: imgBase64 || null,
        timestamp: serverTimestamp(),
        isRead: false,
      };

      await addDoc(collection(db, "chats", chatId, "messages"), newMessage);
      setInput("");
      setImage(null);
    },
    [chatId, currentUserId, otherUserId]
  );

  const handleInputChange = useCallback((value) => {
    setInput(value);
  }, []);

  return {
    messages,
    input,
    image,
    setImage, // expose setter to MessageInput
    handleSend,
    handleInputChange,
  };
};

export default useChat;
