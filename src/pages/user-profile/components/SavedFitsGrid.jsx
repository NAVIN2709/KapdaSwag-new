import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const SavedFitsGrid = ({ products, onProductClick, onRemoveProduct }) => {
  const navigate = useNavigate();
  const [removingId, setRemovingId] = useState(null);

  const handleRemove = async (productId, e) => {
    e.stopPropagation();
    setRemovingId(productId);
    
    // Simulate API call
    setTimeout(() => {
      onRemoveProduct(productId);
      setRemovingId(null);
    }, 500);
  };

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
          <Icon name="Bookmark" size={24} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No Saved Fits Yet</h3>
        <p className="text-muted-foreground text-center mb-6">
          Start swiping and save your favorite fashion finds to build your personal collection.
        </p>
        <Button variant="default" iconName="Zap" iconPosition="left" onClick={()=>navigate("/")}>
          Discover Fashion
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => onProductClick(product)}
            className={`
              relative bg-card rounded-xl overflow-hidden border border-border cursor-pointer
              animation-spring hover:scale-[1.02] hover:shadow-lg
              ${removingId === product.id ? 'opacity-50 scale-95' : ''}
            `}
          >
            {/* Product Image */}
            <div className="aspect-[3/4] bg-muted/20 relative overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              
              {/* Remove Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => handleRemove(product.id, e)}
                disabled={removingId === product.id}
                className="absolute top-2 right-2 bg-black/50 backdrop-blur-xs text-white hover:bg-black/70"
              >
                {removingId === product.id ? (
                  <Icon name="Loader2" size={16} className="animate-spin" />
                ) : (
                  <Icon name="X" size={16} />
                )}
              </Button>

              {/* Price Badge */}
              <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-xs text-white px-2 py-1 rounded-lg">
                <span className="text-sm font-semibold font-mono">${product.price}</span>
              </div>

              {/* Like Count */}
              <div className="absolute bottom-2 right-2 flex items-center space-x-1 bg-black/70 backdrop-blur-xs text-white px-2 py-1 rounded-lg">
                <Icon name="Heart" size={12} className="text-error" />
                <span className="text-xs font-mono">{product.likes}</span>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-3">
              <h3 className="font-semibold text-foreground text-sm mb-1 truncate">
                {product.name}
              </h3>
              <p className="text-muted-foreground text-xs mb-2 truncate">
                {product.brand}
              </p>
              
              {/* Saved Date */}
              <div className="flex items-center space-x-1">
                <Icon name="Clock" size={12} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Saved {product.savedDate}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      {products.length >= 10 && (
        <div className="flex justify-center mt-6">
          <Button variant="outline" iconName="Plus" iconPosition="left">
            Load More Fits
          </Button>
        </div>
      )}
    </div>
  );
};

export default SavedFitsGrid;