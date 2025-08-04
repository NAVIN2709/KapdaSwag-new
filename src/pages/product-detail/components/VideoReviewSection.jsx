import React, { useState, useRef } from "react";
import Image from "../../../components/AppImage";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const VideoReviewSection = ({ comments }) => {
  const videoComments = comments?.video || [];
  const textComments = comments?.text || [];

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);

  const currentVideo = videoComments[currentVideoIndex];

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
            {/* Play Button Overlay */}
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
                      width: `${duration ? (currentTime / duration) * 100 : 0}%`,
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
