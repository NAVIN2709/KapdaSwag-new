import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import { getUserData } from 'functions/Userfunctions'; // adjust path if needed
import { useAuth } from '../../../context/AuthContext'; // assuming you store current user in context

const ActionButtons = ({ product, onSaveToCloset, onUnSaveFromCloset, onShare, onBuyNow }) => {
  const { user } = useAuth(); // get current user
  const [isSaved, setIsSaved] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if product is already saved
  useEffect(() => {
    const checkIfSaved = async () => {
      if (!user?.uid || !product?.id) return;

      try {
        const userData = await getUserData(user.uid);
        if (Array.isArray(userData.savedProducts)) {
          setIsSaved(userData.savedProducts.includes(product.id));
        }
      } catch (err) {
        console.error("Error checking saved products:", err);
      }
    };

    checkIfSaved();
  }, [user?.uid, product?.id]);

  const handleSaveToCloset = async () => {
    setLoading(true);
    setIsSaved(true);
    if (onSaveToCloset) await onSaveToCloset(product.id);
    console.log('Saved to closet', product.id);
    setLoading(false);
  };

  const handleUnSaveFromCloset = async () => {
    setLoading(true);
    setIsSaved(false);
    if (onUnSaveFromCloset) await onUnSaveFromCloset(product.id);
    console.log('Removed from closet', product.id);
    setLoading(false);
  };

  const handleShare = async () => {
    const shareData = {
      title: `${product.name} - ${product.brand}`,
      text: `Check out this ${product.name} from ${product.brand} on FashionSwipe!`,
      url: window.location.href
    };

    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
      } catch {
        console.log('Share cancelled or failed');
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch {
        console.log('Failed to copy link');
      }
    }

    if (onShare) onShare(product);
  };

  const handleBuyNow = () => {
    if (product.shopUrl) {
      window.open(product.shopUrl, '_blank');
      if (onBuyNow) onBuyNow(product);
    } else {
      console.warn('No shop URL available for this product.');
    }
  };

  return (
    <div className="space-y-3">
      {isSaved ? (
        <Button
          variant="ghost"
          onClick={handleUnSaveFromCloset}
          loading={loading}
          className="w-full text-warning"
          iconName="Bookmark"
          iconPosition="left"
        >
          Saved to Closet
        </Button>
      ) : (
        <Button
          variant="ghost"
          onClick={handleSaveToCloset}
          loading={loading}
          className="w-full text-muted-foreground"
          iconName="BookmarkPlus"
          iconPosition="left"
        >
          Save to Closet
        </Button>
      )}

      <Button
        variant="default"
        onClick={handleBuyNow}
        loading={isBuying}
        className="w-full"
        iconName="Zap"
        iconPosition="left"
      >
        Buy Now
      </Button>

      <Button
        variant="ghost"
        onClick={handleShare}
        className="w-full text-muted-foreground hover:text-foreground"
        iconName="Share"
        iconPosition="left"
      >
        Share
      </Button>
    </div>
  );
};

export default ActionButtons;
