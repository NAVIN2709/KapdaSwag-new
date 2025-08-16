import React, { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Image from "../../../components/AppImage";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const ProductImageCarousel = ({ media, productName, onLike, isLiked }) => {
  const [isMuted, setIsMuted] = useState(true);
  const videoRefs = useRef([]);

  const isVideo = (url) => {
    if (!url) return false; // handles null, undefined, empty string
    return /\.(mp4|webm|ogg)(\?.*)?(#.*)?$/i.test(url);
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
    videoRefs.current.forEach((video) => {
      if (video) video.muted = !video.muted;
    });
  };

  return (
    <div className="relative w-full aspect-square bg-muted/20 overflow-hidden">
      <Swiper
        modules={[Navigation, Pagination]}
        navigation={{
          nextEl: ".carousel-next",
          prevEl: ".carousel-prev",
        }}
        pagination={{ clickable: true }}
        className="w-full h-full"
      >
        {media
          ?.filter((item) => item)
          .map((item, index) => (
            <SwiperSlide key={index}>
              {isVideo(item) ? (
                <video
                  ref={(el) => (videoRefs.current[index] = el)}
                  src={item}
                  autoPlay
                  muted={isMuted}
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image
                  src={item}
                  alt={`${productName} - ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              )}
            </SwiperSlide>
          ))}
      </Swiper>

      {media?.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="carousel-prev absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 backdrop-blur-xs text-white hover:bg-black/40 hidden md:flex"
            style={{ width: 44, height: 44 }}
          >
            <Icon name="ChevronLeft" size={24} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="carousel-next absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 backdrop-blur-xs text-white hover:bg-black/40 hidden md:flex"
            style={{ width: 44, height: 44 }}
          >
            <Icon name="ChevronRight" size={24} />
          </Button>
        </>
      )}

      {/* Heart / Like Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onLike}
        className={`absolute top-4 right-4 ${
          isLiked
            ? "text-error bg-background/80 backdrop-blur-xs"
            : "text-white bg-black/20 backdrop-blur-xs hover:bg-black/40"
        }`}
        style={{ width: 44, height: 44 }}
      >
        <Icon name="Heart" size={20} fill={isLiked ? "currentColor" : "none"} />
      </Button>

      {/* Mute / Unmute Button (only if videos exist) */}
      {media?.some(isVideo) && (
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMute}
          className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-xs z-[100]"
          style={{ width: 44, height: 44 }}
        >
          <Icon name={isMuted ? "VolumeX" : "Volume2"} size={20} />
        </Button>
      )}
    </div>
  );
};

export default ProductImageCarousel;
