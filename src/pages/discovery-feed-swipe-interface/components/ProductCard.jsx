import React, { useState, useRef, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimation,
} from "framer-motion";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";
import CommentsModal from "../components/CommentsModal";
import { useNavigate } from "react-router-dom";
import { getUserData } from "functions/Userfunctions";
import { useAuth } from "../../../context/AuthContext"; // Auth context

const ProductCard = ({
  product,
  onSwipeLeft,
  onSwipeRight,
  isActive = true,
  zIndex = 1,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const [lastTap, setLastTap] = useState(0);
  const [CurrentUser, setCurrentUser] = useState(null)
  const [showComments, setShowComments] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null); // "left" or "right"

  useEffect(() => {
    (async () => {
      try {
        const userdata = await getUserData(user.uid);
        setCurrentUser(userdata);
      } catch (error) {
        console.error("❌ Error fetching user data:", error);
      }
    })();
  }, []);

  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const controls = useAnimation();
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-300, -100, 0, 100, 300], [0, 1, 1, 1, 0]);

  // Reactively show swipe icons
  useEffect(() => {
    const unsubscribe = x.on("change", (latestX) => {
      if (latestX > 50) setSwipeDirection("right");
      else if (latestX < -50) setSwipeDirection("left");
      else setSwipeDirection(null);
    });

    return () => unsubscribe();
  }, [x]);

  const handleDragEnd = (event, info) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    const threshold = 100;

    if (offset > threshold || velocity > 500) {
      setIsLiked(true);
      controls.start({ x: 1000, opacity: 0 }).then(() => {
        onSwipeRight(product);
      });
    } else if (offset < -threshold || velocity < -500) {
      controls.start({ x: -1000, opacity: 0 }).then(() => {
        onSwipeLeft(product);
      });
    } else {
      // Snap back to original position
      controls.start({ x: 0, rotate: 0, scale: 1 });
    }
  };

  const handleTap = () => {
    const now = Date.now();
    const delta = now - lastTap;

    if (delta < 300) {
      setIsLiked(true);
      setShowHeartAnimation(true);
      setTimeout(() => setShowHeartAnimation(false), 1000);
    }
    setLastTap(now);
  };

  const handleSave = () => {
    setIsSaved((prev) => !prev);
  };

  const handleShopNow = (shop) => {
    console.log("clicked");
  };

  useEffect(() => {
    controls.start({ x: 0, scale: 1 });
  }, []);

  return (
    <motion.div
      ref={cardRef}
      className="absolute inset-0 w-full h-[90%] my-auto cursor-grab active:cursor-grabbing"
      style={{ x, rotate, opacity, zIndex }}
      drag={isActive ? "x" : false}
      dragElastic={0.2}
      dragMomentum={true}
      onDragEnd={handleDragEnd}
      onTap={handleTap}
      whileDrag={{ scale: 1.05 }}
      initial={{ scale: 0.95 }}
      animate={controls}
      exit={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Card Content */}
      <div className="relative w-full h-full bg-muted/20 overflow-hidden rounded-2xl">
        {product.video ? (
          <video
            src={product.video}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <Image
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Brand Logo */}
        <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-xs rounded-full p-2">
          <Image
            src={product.brandLogo}
            alt={product.brand}
            className="w-8 h-8 object-contain"
          />
        </div>

        {/* Trending Badge */}
        {product.isTrending && (
          <div className="absolute top-6 right-6 bg-warning/90 backdrop-blur-xs rounded-full px-3 py-1 flex items-center space-x-1">
            <Icon name="TrendingUp" size={14} className="text-white" />
            <span className="text-xs font-bold text-white">Trending</span>
          </div>
        )}

        {/* Quick Actions */}
        <div className="absolute right-6 bottom-[150px] transform -translate-y-1/2 space-y-3 space-x-2 z-50">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSave}
            className={`w-12 h-12 rounded-full ${
              isSaved
                ? "bg-warning/90 text-white"
                : "bg-black/40 text-white hover:bg-black/60"
            } backdrop-blur-xs`}
          >
            <Icon name={isSaved ? "Bookmark" : "BookmarkPlus"} size={20} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowComments(true)}
            className="w-12 h-12 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-xs"
          >
            <Icon name="MessageCircle" size={20} />
          </Button>

          <a
            href={product?.shop}
            target="_blank"
            rel="noopener noreferrer"
            className="w-30 bg-primary text-white px-6 py-2 rounded-full text-md font-semibold shadow backdrop-blur-xs inline-block text-center"
          >
            Shop
          </a>
        </div>

        {/* Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-center space-x-4 mb-3">
            <div className="flex items-center space-x-1">
              <Icon name="Heart" size={16} className="text-error" />
              <span className="text-sm font-mono">{product.likes}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Star" size={16} className="text-warning" />
              <span className="text-sm font-mono">{product.rating}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold leading-tight">{product.name}</h2>
            <p className="text-white/80 text-sm">{product.brand}</p>
            {product.designer && (
              <p className="text-sm text-white/60 italic">
                Designed by{" "}
                <span className="font-bold">{product.designer}</span>
              </p>
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold font-mono">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-white/60 line-through font-mono">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
              {product.tasteMatch && (
                <div className="bg-primary/90 backdrop-blur-xs rounded-full px-3 py-1">
                  <span className="text-xs font-bold text-white">
                    {product.tasteMatch}% Match
                  </span>
                </div>
              )}
            </div>
          </div>

          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {product.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="bg-white/20 backdrop-blur-xs rounded-full px-2 py-1 text-xs text-white"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Swipe Indicators */}
        {swipeDirection === "right" && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="bg-red-700 backdrop-blur-xs rounded-full p-4">
              <Icon name="Heart" size={32} className="text-white" />
            </div>
          </motion.div>
        )}

        {swipeDirection === "left" && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="bg-red-700 backdrop-blur-xs rounded-full p-4">
              <Icon name="X" size={32} className="text-white" />
            </div>
          </motion.div>
        )}

        {showHeartAnimation && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0] }}
            transition={{ duration: 1 }}
          >
            <Icon
              name="Heart"
              size={80}
              className="text-error"
              fill="currentColor"
            />
          </motion.div>
        )}
      </div>

      {showComments && (
        <CommentsModal
          comments={product.comments}
          onClose={() => setShowComments(false)}
          currentUser={CurrentUser}
          productId={product.id}
        />
      )}
    </motion.div>
  );
};

export default ProductCard;
