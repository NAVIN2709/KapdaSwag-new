import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import Image from "../../components/AppImage";
import { getEventById } from "functions/Userfunctions";

const EachEvent = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const [messages, setMessages] = useState([]);
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
  }, [messages]);

  const formatDeadline = (deadline) => {
    const date = new Date(deadline);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleSendMessage = () => {
    if (!newMessage && !mediaFile) return;

    setMessages((prev) => [
      ...prev,
      { text: newMessage, media: mediaPreview, sender: "me" },
    ]);
    setNewMessage("");
    setMediaFile(null);
    setMediaPreview(null);
  };

  const handleMediaUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);
      setMediaPreview(URL.createObjectURL(file));
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
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs p-3 rounded-2xl shadow-md transition-all mb-2 ${
                msg.sender === "me"
                  ? "bg-blue-500 shadow-lg shadow-blue-500/30 text-white"
                  : "backdrop-blur-md bg-white/10 border border-white/20 text-white"
              }`}
            >
              {msg.media && (
                <div className="mb-1">
                  {msg.media.endsWith(".mp4") ? (
                    <video src={msg.media} controls className="w-48 rounded-lg" />
                  ) : (
                    <Image src={msg.media} alt="Media" className="w-48 rounded-lg" />
                  )}
                </div>
              )}
              {msg.text && <p className="text-sm break-words">{msg.text}</p>}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Floating Input Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-3 backdrop-blur-lg bg-black/40 border-t border-white/10">
        {mediaPreview && (
          <div className="mb-2 flex items-center gap-2">
            {mediaFile.type.startsWith("video/") ? (
              <video src={mediaPreview} className="w-20 h-20 rounded-lg" controls />
            ) : (
              <img src={mediaPreview} alt="Preview" className="w-20 h-20 rounded-lg" />
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

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 bg-white/10 backdrop-blur-lg px-4 py-2 rounded-full text-sm outline-none text-white placeholder-gray-300"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button variant="ghost" size="icon" onClick={() => fileInputRef.current.click()}>
            <Icon name="Paperclip" size={18} className="text-white" />
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*,video/*"
            onChange={handleMediaUpload}
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
