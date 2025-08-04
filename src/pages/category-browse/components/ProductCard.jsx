import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, viewMode = 'grid' }) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(product.isLiked || false);
  const [isSaved, setIsSaved] = useState(product.isSaved || false);

  const handleLike = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleSave = (e) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  const handleCardClick = () => {
    navigate('/product-detail', { state: { product } });
  };

  if (viewMode === 'list') {
    return (
      <div 
        onClick={handleCardClick}
        className="flex space-x-3 p-3 bg-card/50 rounded-xl border border-border/50 hover:border-border animation-spring cursor-pointer"
      >
        <div className="w-20 h-20 bg-muted/20 rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground text-sm truncate">
                {product.name}
              </h3>
              <p className="text-xs text-muted-foreground truncate">
                {product.brand}
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="font-bold text-foreground font-mono">
              ${product.price}
            </span>
            
            <div className="flex items-center space-x-3 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Icon name="Heart" size={12} className="text-error" />
                <span className="font-mono">{product.likes}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={handleCardClick}
      className="bg-card/50 rounded-xl border border-border/50 hover:border-border animation-spring cursor-pointer group overflow-hidden"
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-muted/20 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 animation-spring"
        />
        
        {/* Quick Actions */}
        <div className="absolute top-2 right-2 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 animation-spring">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLike}
            className={`w-8 h-8 bg-background/80 backdrop-blur-xs ${
              isLiked ? 'text-error' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name="Heart" size={16} fill={isLiked ? 'currentColor' : 'none'} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSave}
            className={`w-8 h-8 bg-background/80 backdrop-blur-xs ${
              isSaved ? 'text-warning' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name="Bookmark" size={16} fill={isSaved ? 'currentColor' : 'none'} />
          </Button>
        </div>

        {/* Trending Badge */}
        {product.isTrending && (
          <div className="absolute top-2 left-2 bg-accent text-accent-foreground px-2 py-1 rounded-full text-xs font-medium">
            Trending
          </div>
        )}
      </div>
      
      {/* Product Info */}
      <div className="p-3">
        <div className="mb-2">
          <h3 className="font-semibold text-foreground text-sm truncate">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground truncate">
            {product.brand}
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="font-bold text-foreground font-mono">
            ${product.price}
          </span>
          
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="Heart" size={12} className="text-error" />
              <span className="font-mono">{product.likes}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;