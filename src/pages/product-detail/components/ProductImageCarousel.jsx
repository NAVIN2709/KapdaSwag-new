import React, { useState, useRef } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProductImageCarousel = ({ images, productName, onLike, isLiked }) => {
  // Normalize to always be an array
  const imageList = Array.isArray(images) ? images : [images];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const imageRef = useRef(null);
  const touchStartRef = useRef({ x: 0, y: 0 });
  const touchEndRef = useRef({ x: 0, y: 0 });

  // Swipe Handling
  const handleTouchStart = (e) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchMove = (e) => {
    touchEndRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = () => {
    const deltaX = touchStartRef.current.x - touchEndRef.current.x;
    const deltaY = Math.abs(touchStartRef.current.y - touchEndRef.current.y);

    if (Math.abs(deltaX) > 50 && deltaY < 100 && imageList.length > 1) {
      if (deltaX > 0 && currentIndex < imageList.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else if (deltaX < 0 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    }
  };

  // Zoom Handling
  const handleDoubleClick = (e) => {
    if (isZoomed) {
      setIsZoomed(false);
    } else {
      const rect = imageRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setZoomPosition({ x, y });
      setIsZoomed(true);
    }
  };

  // Navigation
  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % imageList.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
  };

  return (
    <div className="relative w-full aspect-square bg-muted/20 overflow-hidden">
      {/* Main Image */}
      <div
        ref={imageRef}
        className={`w-full h-full cursor-pointer transition-transform duration-300 ${
          isZoomed ? 'scale-200' : 'scale-100'
        }`}
        style={
          isZoomed
            ? { transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` }
            : {}
        }
        onDoubleClick={handleDoubleClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={imageList[currentIndex]}
          alt={`${productName} - Image ${currentIndex + 1}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Navigation Arrows (Only if multiple images) */}
      {imageList.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={prevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/20 backdrop-blur-xs text-black hover:bg-black/40 hidden md:flex"
            style={{ width: '44px', height: '44px' }}
          >
            <Icon name="ChevronLeft" size={24} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/20 backdrop-blur-xs text-black hover:bg-black/40 hidden md:flex"
            style={{ width: '44px', height: '44px' }}
          >
            <Icon name="ChevronRight" size={24} />
          </Button>
        </>
      )}

      {/* Like Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onLike}
        className={`absolute top-4 right-4 ${
          isLiked
            ? 'text-error bg-background/80 backdrop-blur-xs'
            : 'text-white bg-black/20 backdrop-blur-xs hover:bg-black/40'
        }`}
        style={{ width: '44px', height: '44px' }}
      >
        <Icon
          name="Heart"
          size={20}
          fill={isLiked ? 'currentColor' : 'none'}
        />
      </Button>

      {/* Zoom Indicator */}
      {isZoomed && (
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-xs text-white px-3 py-1 rounded-full text-sm font-medium">
          Pinch to zoom out
        </div>
      )}

      {/* Image Indicators */}
      {imageList.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {imageList.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? 'bg-white scale-125'
                  : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}

      {/* Image Counter */}
      {imageList.length > 1 && (
        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-xs text-white px-3 py-1 rounded-full text-sm font-medium">
          {currentIndex + 1} / {imageList.length}
        </div>
      )}
    </div>
  );
};

export default ProductImageCarousel;
