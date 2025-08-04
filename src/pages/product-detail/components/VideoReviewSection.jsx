import React, { useState, useRef, useEffect } from "react";
import Image from "../../../components/AppImage";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import { getUserData } from "functions/Userfunctions";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../../../firebase";

const VideoReviewSection = ({ comments, currentUser,productId }) => {
  const [CurrentUser, setCurrentUser] = useState(null);
  const [videoComments, setVideoComments] = useState(comments?.video || []);
  const [textComments, setTextComments] = useState(comments?.text || []);

  const [textInput, setTextInput] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);

  const currentVideo = videoComments[currentVideoIndex];

  useEffect(() => {
    (async () => {
      try {
        const userdata = await getUserData(currentUser);
        setCurrentUser(userdata);
      } catch (error) {
        console.error("❌ Error fetching user data:", error);
      }
    })();
  }, []);

  // Convert file to Base64
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleAddComment = async () => {
    if (!textInput.trim() && !imageFile && !videoFile) return;
    if (!CurrentUser?.username) {
      alert("You must be logged in to comment");
      return;
    }

    try {
      const productRef = doc(db, "products", productId); // you'll need to pass productId as prop

      if (videoFile) {
        // Convert video to Base64
        const videoBase64 = await toBase64(videoFile);

        await updateDoc(productRef, {
          "comments.video": arrayUnion({
            username: CurrentUser.username,
            videoUrl: videoBase64,
            textcomment: textInput.trim() || "",
          }),
        });

        setVideoComments((prev) => [
          ...prev,
          {
            username: CurrentUser.username,
            videoUrl: videoBase64,
            textcomment: textInput.trim() || "",
          },
        ]);
      } else {
        // Image or text
        let imageBase64 = null;
        if (imageFile) {
          imageBase64 = await toBase64(imageFile);
        }

        await updateDoc(productRef, {
          "comments.text": arrayUnion({
            username: CurrentUser.username,
            comment: textInput.trim(),
            ...(imageBase64 && { imageBase64 }),
          }),
        });

        setTextComments((prev) => [
          ...prev,
          {
            username: CurrentUser.username,
            comment: textInput.trim(),
            ...(imageBase64 && { imageBase64 }),
          },
        ]);
      }

      // Reset inputs
      setTextInput("");
      setImageFile(null);
      setVideoFile(null);
    } catch (error) {
      console.error("❌ Error adding comment:", error);
    }
  };

  const handleVideoClick = (index) => {
    setCurrentVideoIndex(index);
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) setDuration(videoRef.current.duration);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="p-4 space-y-8">
      <h3 className="text-xl font-bold text-foreground">
        Comments ({textComments.length + videoComments.length})
      </h3>

      {/* Add Comment Form */}
      {/* Comment Input Bar */}
      <div className="flex items-center bg-muted/20 rounded-full px-3 py-2 space-x-2">
        {/* Attachment Button */}
        <label className="cursor-pointer flex items-center justify-center w-8 h-8 rounded-full bg-muted hover:bg-muted/40 transition">
          <Icon name="Paperclip" size={18} className="text-muted-foreground" />
          <input
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;
              if (file.type.startsWith("image")) {
                setImageFile(file);
                setVideoFile(null);
              } else if (file.type.startsWith("video")) {
                setVideoFile(file);
                setImageFile(null);
              }
            }}
          />
        </label>

        {/* Text Input */}
        <input
          type="text"
          placeholder="Write a comment..."
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
        />

        {/* Send Button */}
        <Button
          size="sm"
          className="bg-primary text-white px-4 py-1 rounded-full hover:bg-primary/90 transition"
          onClick={handleAddComment}
          disabled={!textInput && !imageFile && !videoFile}
        >
          Send
        </Button>
      </div>

      {/* Video Comments Section */}
      {videoComments.length > 0 && (
        <>
          {/* Main Video Player */}
          <div className="relative aspect-[9/16] rounded-xl overflow-hidden max-w-sm mx-auto">
            <video
              ref={videoRef}
              src={currentVideo.videoUrl}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              className="w-full h-full object-cover"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={togglePlayPause}
              className="absolute inset-0 w-full h-full backdrop-blur-xs text-white hover:bg-black/40 rounded-none"
            >
              <div className="w-16 h-16 bg-white/20 backdrop-blur-xs rounded-full flex items-center justify-center">
                <Icon name={isPlaying ? "Pause" : "Play"} size={24} />
              </div>
            </Button>

            {/* Progress */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
              <div className="flex items-center space-x-2 text-white text-sm">
                <span className="font-mono">{formatTime(currentTime)}</span>
                <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-100"
                    style={{
                      width: `${
                        duration ? (currentTime / duration) * 100 : 0
                      }%`,
                    }}
                  />
                </div>
                <span className="font-mono">{formatTime(duration)}</span>
              </div>
            </div>

            {/* User Info */}
            <div className="absolute top-4 left-4">
              <div className="bg-black/40 px-3 py-1 rounded-full text-white text-sm">
                @{currentVideo.username}
              </div>
            </div>
          </div>

          {/* Video Caption */}
          {currentVideo.textcomment && (
            <p className="text-muted-foreground text-center mt-2">
              {currentVideo.textcomment}
            </p>
          )}

          {/* Thumbnails */}
          <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
            {videoComments.map((vid, index) => (
              <button
                key={index}
                onClick={() => handleVideoClick(index)}
                className={`relative flex-shrink-0 w-20 h-28 rounded-lg overflow-hidden border-2 ${
                  index === currentVideoIndex
                    ? "border-primary scale-105"
                    : "border-transparent hover:border-muted-foreground"
                }`}
              >
                <video
                  src={vid.videoUrl}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <Icon name="Play" size={16} className="text-white" />
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Text Comments Section */}
      {textComments.length > 0 && (
        <div className="space-y-4">
          {textComments.map((c, i) => (
            <div
              key={i}
              className="bg-muted/20 rounded-lg p-3 flex flex-col space-y-2"
            >
              <span className="font-semibold">@{c.username}</span>
              <p className="text-muted-foreground">{c.comment}</p>
              {c.imageBase64 && (
                <img
                  src={c.imageBase64}
                  alt="comment attachment"
                  className="w-full max-w-xs rounded-lg"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoReviewSection;
