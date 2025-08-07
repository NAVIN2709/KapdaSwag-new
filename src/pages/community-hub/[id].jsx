import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import Image from "../../components/AppImage";
import { getEventById } from "functions/Userfunctions";
import { Image as ImageIcon, X } from "lucide-react";
import useEventChat from "functions/useEventChat";
import { sendEventMessage } from "functions/useEventChat";
import { useAuth } from "context/AuthContext";
import { getUserData } from "functions/Userfunctions";

const EachEvent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { eventId } = useParams();
  const { eventMessages } = useEventChat(eventId);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const [newMessage, setNewMessage] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const fileInputRef = useRef();
  const chatEndRef = useRef(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const eventData = await getEventById(eventId);
        setEvent(eventData);
      } catch (err) {
        console.error("Error fetching event:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [eventMessages]);

  const formatDeadline = (deadline) => {
    const date = new Date(deadline);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  function formatTimestamp(rawTimestamp) {
    const date = new Date(rawTimestamp);
    if (isNaN(date)) return ""; // Fallback for invalid dates

    const options = {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      day: "2-digit",
      month: "short",
    };
    return date.toLocaleString("en-US", options); // e.g., "07 Aug, 1:52 PM"
  }

  const handleSendMessage = async () => {
    if (!newMessage && !mediaFile) return;

    try {
      const userData = await getUserData(user.uid);

      const messageData = {
        text: newMessage?.trim() || null,
        mediaUrl: mediaFile || null,
        senderId: user.uid,
        senderImage: userData?.profilePic || null,
        username: userData?.username || null,
      };

      // Send message to Firestore (ensure this function supports full messageData)
      await sendEventMessage({ eventId, ...messageData });

      // Clear input states
      setNewMessage("");
      setMediaFile(null);
      setMediaPreview(null);
    } catch (error) {
      console.error("Error sending message:", error);
      // Optional: show UI feedback
    }
  };

  const handleMediaUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result;
        setMediaFile(base64String);
        setMediaPreview(base64String);
      };

      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-muted-foreground">
        Loading event...
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-muted-foreground">
        <p>Event not found.</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative bg-background text-white">
      {/* Glassmorphic Header */}
      <div className="flex items-center p-4 sticky top-0 z-20 backdrop-blur-lg bg-white/10 border-b border-white/10 shadow-lg">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <Icon name="ArrowLeft" size={20} className="text-white" />
        </Button>
        <h1 className="ml-4 text-lg font-bold">{event.title}</h1>
      </div>

      {/* Event Images */}
      <div className="relative w-full">
        <Image
          src={event.eventImage}
          alt="Header"
          className="w-full h-48 object-cover rounded-b-3xl"
        />
        <div className="absolute left-1/2 -bottom-12 -translate-x-1/2">
          <Image
            src={event.brandLogo}
            alt="Event"
            className="w-28 h-28 rounded-full border-4 border-white shadow-xl"
          />
        </div>
      </div>

      {/* Event Info */}
      <div className="px-4 mt-16 text-center">
        <h2 className="text-2xl font-extrabold">{event.title}</h2>
        <p className="text-sm text-gray-300 mt-1">
          Deadline: {formatDeadline(event.deadline)}
        </p>
      </div>

      {/* Pinned Glassmorphic Description */}
      <div className="px-4 mt-4">
        <div className="backdrop-blur-md bg-white/10 border border-white/20 px-4 py-3 rounded-xl shadow-lg">
          <p className="text-sm">{event.description}</p>
        </div>
      </div>

      {/* Chat Section */}
      <div className="flex-1 flex flex-col mt-4 px-4 overflow-y-auto pb-28">
        {eventMessages.map((msg, index) => {
          const isUser = msg.sender === user.uid;

          return (
            <div
              key={index}
              className={`flex flex-col gap-1 mb-4 px-2 ${
                isUser ? "items-end" : "items-start"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <img
                  src={msg.senderImage || "/default-avatar.png"}
                  alt={msg.username || "User"}
                  className="w-6 h-6 rounded-full object-cover border border-white/20 shadow-sm"
                />
                <span className="text-xs text-white/70 font-medium tracking-tight">
                  {msg.username}
                </span>
              </div>

              {/* Message Bubble + Media */}
              <div
                className={`flex flex-col gap-1 max-w-[85%] md:max-w-[70%] rounded-xl px-4 py-3 text-sm shadow-md ${
                  isUser
                    ? "bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-blue-400/30"
                    : "bg-white/10 text-white border border-white/20 backdrop-blur-sm shadow-white/10"
                }`}
              >
                {/* Media */}
                {msg.media && (
                  <div className="rounded-lg overflow-hidden">
                    {msg.media.endsWith(".mp4") ? (
                      <video
                        src={msg.media}
                        controls
                        className="w-full max-w-xs rounded-md"
                      />
                    ) : (
                      <img
                        src={msg.media}
                        alt="Media"
                        className="w-full max-w-xs rounded-md object-cover"
                      />
                    )}
                  </div>
                )}

                {/* Text */}
                {msg.text && (
                  <p className="break-words leading-snug tracking-wide">
                    {msg.text}
                  </p>
                )}
              </div>

              {/* Timestamp */}
              {msg.timestamp && (
                <span
                  className={`text-[10px] mt-1 ${
                    isUser ? "text-white/50 pr-1" : "text-white/50 pl-1"
                  }`}
                >
                  {new Date(
                    msg.timestamp.seconds
                      ? msg.timestamp.seconds * 1000
                      : msg.timestamp
                  ).toLocaleString("en-IN", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                    day: "2-digit",
                    month: "short",
                  })}
                </span>
              )}
            </div>
          );
        })}

        <div ref={chatEndRef} />
      </div>

      {/* Floating Input Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-3 backdrop-blur-lg bg-black/40 border-t border-white/10">
        {mediaPreview && (
          <div className="mb-2 flex items-center gap-2">
            {mediaFile?.type?.startsWith("video/") ? (
              <video
                src={mediaPreview}
                className="w-20 h-20 rounded-lg"
                controls
              />
            ) : (
              <img
                src={mediaPreview}
                alt="Preview"
                className="w-20 h-20 rounded-lg"
              />
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setMediaFile(null);
                setMediaPreview(null);
              }}
            >
              <Icon name="X" size={18} className="text-white" />
            </Button>
          </div>
        )}

        <div className="flex items-center gap-3 bg-[#161b22] rounded-full px-4 py-2 shadow-inner focus-within:ring-2 focus-within:ring-indigo-500 transition">
          <label className="cursor-pointer text-gray-400 hover:text-indigo-400">
            <ImageIcon className="w-5 h-5" />
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*,video/*"
              onChange={handleMediaUpload}
            />
          </label>
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 bg-transparent outline-none text-white placeholder:text-gray-400 text-sm sm:text-base"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button
            variant="default"
            size="icon"
            className="bg-blue-500 text-white shadow-lg shadow-blue-500/30 rounded-full"
            onClick={handleSendMessage}
          >
            <Icon name="Send" size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EachEvent;
