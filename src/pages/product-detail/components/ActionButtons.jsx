import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActionButtons = ({ 
  product, 
  selectedSize, 
  selectedColor, 
  quantity = 1,
  onAddToCart,
  onSaveToCloset,
  onShare,
  onBuyNow 
}) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isBuying, setIsBuying] = useState(false);

  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    
    setIsAddingToCart(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      if (onAddToCart) {
        onAddToCart({
          product,
          size: selectedSize,
          color: selectedColor,
          quantity
        });
      }
      console.log('Added to cart:', { product, selectedSize, selectedColor, quantity });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleSaveToCloset = () => {
    setIsSaved(!isSaved);
    if (onSaveToCloset) {
      onSaveToCloset(product, !isSaved);
    }
    console.log(isSaved ? 'Removed from closet' : 'Saved to closet', product.id);
  };

  const handleShare = async () => {
    const shareData = {
      title: `${product.name} - ${product.brand}`,
      text: `Check out this ${product.name} from ${product.brand} on FashionSwipe!`,
      url: window.location.href
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Share cancelled or failed');
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch (error) {
        console.log('Failed to copy link');
      }
    }

    if (onShare) {
      onShare(product);
    }
  };

  const handleBuyNow = async () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    setIsBuying(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      if (onBuyNow) {
        onBuyNow({
          product,
          size: selectedSize,
          color: selectedColor,
          quantity
        });
      }
      console.log('Buy now:', { product, selectedSize, selectedColor, quantity });
    } finally {
      setIsBuying(false);
    }
  };

  const totalPrice = (product.price * quantity).toFixed(2);

  return (
    <div className="space-y-4">
      {/* Price Summary */}
      <div className="bg-card/30 rounded-lg p-4 border border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-muted-foreground">Subtotal ({quantity} item{quantity > 1 ? 's' : ''})</span>
          <span className="text-lg font-bold text-foreground font-mono">${totalPrice}</span>
        </div>
        {product.originalPrice && product.originalPrice > product.price && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">You save</span>
            <span className="text-accent font-medium font-mono">
              ${((product.originalPrice - product.price) * quantity).toFixed(2)}
            </span>
          </div>
        )}
      </div>

      {/* Selection Summary */}
      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
        {selectedSize && (
          <div className="flex items-center space-x-1">
            <span>Size:</span>
            <span className="text-foreground font-medium">{selectedSize}</span>
          </div>
        )}
        {selectedColor && (
          <div className="flex items-center space-x-1">
            <span>Color:</span>
            <span className="text-foreground font-medium">{selectedColor}</span>
          </div>
        )}
        <div className="flex items-center space-x-1">
          <span>Qty:</span>
          <span className="text-foreground font-medium font-mono">{quantity}</span>
        </div>
      </div>

      {/* Primary Actions */}
      <div className="flex space-x-3">
        <Button
          variant="outline"
          onClick={handleAddToCart}
          loading={isAddingToCart}
          disabled={!selectedSize || isAddingToCart || isBuying}
          className="flex-1"
          iconName="ShoppingBag"
          iconPosition="left"
        >
          {isAddingToCart ? 'Adding...' : 'Add to Cart'}
        </Button>
        
        <Button
          variant="default"
          onClick={handleBuyNow}
          loading={isBuying}
          disabled={!selectedSize || isAddingToCart || isBuying}
          className="flex-1"
          iconName="Zap"
          iconPosition="left"
        >
          {isBuying ? 'Processing...' : 'Buy Now'}
        </Button>
      </div>

      {/* Secondary Actions */}
      <div className="flex space-x-3">
        <Button
          variant="ghost"
          onClick={handleSaveToCloset}
          className={`flex-1 ${isSaved ? 'text-warning' : 'text-muted-foreground'}`}
          iconName={isSaved ? 'Bookmark' : 'BookmarkPlus'}
          iconPosition="left"
        >
          {isSaved ? 'Saved to Closet' : 'Save to Closet'}
        </Button>
        
        <Button
          variant="ghost"
          onClick={handleShare}
          className="flex-1 text-muted-foreground hover:text-foreground"
          iconName="Share"
          iconPosition="left"
        >
          Share
        </Button>
      </div>

      {/* Additional Info */}
      <div className="space-y-3 pt-4 border-t border-border">
        <div className="flex items-center space-x-3 text-sm">
          <Icon name="Truck" size={16} className="text-accent" />
          <div>
            <span className="text-foreground font-medium">Free shipping</span>
            <span className="text-muted-foreground"> on orders over $75</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 text-sm">
          <Icon name="RotateCcw" size={16} className="text-primary" />
          <div>
            <span className="text-foreground font-medium">30-day returns</span>
            <span className="text-muted-foreground"> for unworn items</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 text-sm">
          <Icon name="Shield" size={16} className="text-success" />
          <div>
            <span className="text-foreground font-medium">Secure checkout</span>
            <span className="text-muted-foreground"> with buyer protection</span>
          </div>
        </div>
      </div>

      {/* Size Guide Link */}
      <div className="text-center pt-2">
        <button className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center space-x-1 mx-auto">
          <Icon name="Ruler" size={14} />
          <span>Need help with sizing?</span>
        </button>
      </div>
    </div>
  );
};

export default ActionButtons;