import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Image from '../AppImage';
import Button from './Button';

const ProductDetailModal = ({ isOpen, onClose, product }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out this ${product.name} on FashionSwipe`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    console.log('Added to cart:', { product, size: selectedSize, quantity });
  };

  const sizes = ['XS', 'S', 'M', 'L', 'XL'];
  const images = product.images || [product.image];

  return (
    <div className="fixed inset-0 z-300 bg-background/95 backdrop-blur-sm animate-fade-in">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between h-16 px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <Icon name="ArrowLeft" size={24} />
          </Button>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="text-muted-foreground hover:text-foreground"
            >
              <Icon name="Share" size={20} />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSave}
              className={isSaved ? 'text-warning' : 'text-muted-foreground hover:text-foreground'}
            >
              <Icon name={isSaved ? 'Bookmark' : 'BookmarkPlus'} size={20} />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Image Gallery */}
        <div className="relative">
          <div className="aspect-square bg-muted/20">
            <Image
              src={images[activeImageIndex]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Image Indicators */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`w-2 h-2 rounded-full animation-spring ${
                    index === activeImageIndex ? 'bg-primary' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
          
          {/* Like Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLike}
            className={`absolute top-4 right-4 ${
              isLiked 
                ? 'text-error bg-background/80 backdrop-blur-xs' :'text-white bg-black/20 backdrop-blur-xs hover:bg-black/40'
            }`}
          >
            <Icon name={isLiked ? 'Heart' : 'Heart'} size={20} fill={isLiked ? 'currentColor' : 'none'} />
          </Button>
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-6">
          {/* Basic Info */}
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">{product.name}</h1>
            <p className="text-muted-foreground mb-3">{product.brand}</p>
            <div className="flex items-center space-x-4">
              <span className="text-2xl font-bold text-foreground font-mono">${product.price}</span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through font-mono">${product.originalPrice}</span>
              )}
            </div>
          </div>

          {/* Community Stats */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Icon name="Heart" size={16} className="text-error" />
              <span className="text-sm text-muted-foreground font-mono">{product.likes || 0}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="MessageCircle" size={16} className="text-primary" />
              <span className="text-sm text-muted-foreground font-mono">{product.reviews || 0}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="TrendingUp" size={16} className="text-accent" />
              <span className="text-sm text-muted-foreground font-mono">{product.boosts || 0}</span>
            </div>
          </div>

          {/* Size Selection */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">Size</h3>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded-lg border animation-spring ${
                    selectedSize === size
                      ? 'border-primary bg-primary/10 text-primary' :'border-border text-muted-foreground hover:border-muted-foreground'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">Quantity</h3>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Icon name="Minus" size={16} />
              </Button>
              <span className="text-lg font-mono w-8 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Icon name="Plus" size={16} />
              </Button>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              {product.description || 'This stylish piece combines comfort with contemporary design, perfect for any fashion-forward individual looking to make a statement.'}
            </p>
          </div>

          {/* Reviews Preview */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-foreground">Reviews</h3>
              <Button variant="ghost" className="text-primary">
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {[1, 2].map((review) => (
                <div key={review} className="flex space-x-3">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    <Icon name="User" size={16} className="text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-foreground">@user{review}</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Icon key={star} name="Star" size={12} className="text-warning" fill="currentColor" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Love this piece! Great quality and fits perfectly.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border p-4 safe-area-inset-bottom">
        <div className="flex space-x-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
          <Button
            variant="default"
            className="flex-1"
            onClick={handleAddToCart}
          >
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;