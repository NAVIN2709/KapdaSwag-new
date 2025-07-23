import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProductInfo = ({ product, onSizeSelect, onColorSelect, selectedSize, selectedColor }) => {
  const [quantity, setQuantity] = useState(1);

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colors = [
    { name: 'Black', value: '#000000' },
    { name: 'White', value: '#FFFFFF' },
    { name: 'Navy', value: '#1E3A8A' },
    { name: 'Gray', value: '#6B7280' },
    { name: 'Beige', value: '#D2B48C' }
  ];

  const handleQuantityChange = (delta) => {
    setQuantity(Math.max(1, quantity + delta));
  };

  return (
    <div className="p-4 space-y-6">
      {/* Brand and Title */}
      <div>
        <p className="text-sm text-primary font-medium mb-1">{product.brand}</p>
        <h1 className="text-2xl font-bold text-foreground mb-2">{product.name}</h1>
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Icon 
                key={star} 
                name="Star" 
                size={16} 
                className={star <= product.rating ? 'text-warning' : 'text-muted-foreground'} 
                fill={star <= product.rating ? 'currentColor' : 'none'}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
        </div>
      </div>

      {/* Pricing */}
      <div className="flex items-center space-x-4">
        <span className="text-3xl font-bold text-foreground font-mono">${product.price}</span>
        {product.originalPrice && product.originalPrice > product.price && (
          <>
            <span className="text-lg text-muted-foreground line-through font-mono">
              ${product.originalPrice}
            </span>
            <span className="bg-error text-error-foreground px-2 py-1 rounded-md text-sm font-medium">
              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
            </span>
          </>
        )}
      </div>

      {/* Community Stats */}
      <div className="flex items-center space-x-6 py-3 border-y border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Heart" size={16} className="text-error" />
          <span className="text-sm text-muted-foreground font-mono">{product.likes || 0}</span>
          <span className="text-xs text-muted-foreground">likes</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="MessageCircle" size={16} className="text-primary" />
          <span className="text-sm text-muted-foreground font-mono">{product.comments || 0}</span>
          <span className="text-xs text-muted-foreground">comments</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="TrendingUp" size={16} className="text-accent" />
          <span className="text-sm text-muted-foreground font-mono">{product.boosts || 0}</span>
          <span className="text-xs text-muted-foreground">boosts</span>
        </div>
      </div>

      {/* Size Selection */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3">Size</h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => onSizeSelect(size)}
              className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
                selectedSize === size
                  ? 'border-primary bg-primary/10 text-primary' :'border-border text-muted-foreground hover:border-muted-foreground hover:text-foreground'
              }`}
              style={{ minHeight: '44px', minWidth: '44px' }}
            >
              {size}
            </button>
          ))}
        </div>
        <button className="text-sm text-primary mt-2 flex items-center space-x-1">
          <Icon name="Ruler" size={14} />
          <span>Size Guide</span>
        </button>
      </div>

      {/* Color Selection */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3">Color</h3>
        <div className="flex flex-wrap gap-3">
          {colors.map((color) => (
            <button
              key={color.name}
              onClick={() => onColorSelect(color.name)}
              className={`relative w-12 h-12 rounded-full border-2 transition-all duration-200 ${
                selectedColor === color.name
                  ? 'border-primary scale-110' :'border-border hover:border-muted-foreground'
              }`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            >
              {selectedColor === color.name && (
                <Icon 
                  name="Check" 
                  size={16} 
                  className={color.value === '#FFFFFF' ? 'text-black' : 'text-white'}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              )}
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
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1}
            style={{ width: '44px', height: '44px' }}
          >
            <Icon name="Minus" size={16} />
          </Button>
          <span className="text-lg font-mono w-12 text-center">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleQuantityChange(1)}
            style={{ width: '44px', height: '44px' }}
          >
            <Icon name="Plus" size={16} />
          </Button>
        </div>
      </div>

      {/* Product Description */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3">Description</h3>
        <p className="text-muted-foreground leading-relaxed">
          {product.description}
        </p>
      </div>

      {/* Product Details */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3">Details</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Material</span>
            <span className="text-foreground">{product.material || '100% Cotton'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Care</span>
            <span className="text-foreground">{product.care || 'Machine wash cold'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Origin</span>
            <span className="text-foreground">{product.origin || 'Made in USA'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">SKU</span>
            <span className="text-foreground font-mono">{product.sku || 'FS-' + Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;