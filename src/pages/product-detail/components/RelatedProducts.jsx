import React, { useRef } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RelatedProducts = ({ currentProductId, onProductSelect }) => {
  const scrollContainerRef = useRef(null);

  const relatedProducts = [
    {
      id: 2,
      name: 'Vintage Denim Jacket',
      brand: 'RetroStyle',
      price: 89.99,
      originalPrice: 119.99,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=600&fit=crop',
      rating: 4.6,
      reviewCount: 128,
      likes: 456,
      tags: ['#vintage', '#denim', '#classic'],
      isNew: false,
      discount: 25
    },
    {
      id: 3,
      name: 'Minimalist White Tee',
      brand: 'BasicCo',
      price: 24.99,
      originalPrice: null,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=600&fit=crop',
      rating: 4.8,
      reviewCount: 89,
      likes: 234,
      tags: ['#minimalist', '#basic', '#essential'],
      isNew: true,
      discount: 0
    },
    {
      id: 4,
      name: 'Floral Summer Dress',
      brand: 'BloomWear',
      price: 79.99,
      originalPrice: 99.99,
      image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=600&fit=crop',
      rating: 4.7,
      reviewCount: 156,
      likes: 678,
      tags: ['#floral', '#summer', '#feminine'],
      isNew: false,
      discount: 20
    },
    {
      id: 5,
      name: 'Cozy Knit Sweater',
      brand: 'WarmThreads',
      price: 64.99,
      originalPrice: 84.99,
      image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=600&fit=crop',
      rating: 4.5,
      reviewCount: 203,
      likes: 345,
      tags: ['#cozy', '#knit', '#winter'],
      isNew: false,
      discount: 24
    },
    {
      id: 6,
      name: 'High-Waist Jeans',
      brand: 'DenimCraft',
      price: 94.99,
      originalPrice: null,
      image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=600&fit=crop',
      rating: 4.9,
      reviewCount: 267,
      likes: 892,
      tags: ['#highwaist', '#denim', '#trending'],
      isNew: true,
      discount: 0
    }
  ];

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 280;
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const targetScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  const handleProductClick = (product) => {
    if (onProductSelect) {
      onProductSelect(product);
    }
  };

  const handleLike = (productId, e) => {
    e.stopPropagation();
    console.log('Liked product:', productId);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-foreground">You Might Also Like</h3>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('left')}
            className="hidden md:flex"
            style={{ width: '40px', height: '40px' }}
          >
            <Icon name="ChevronLeft" size={16} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('right')}
            className="hidden md:flex"
            style={{ width: '40px', height: '40px' }}
          >
            <Icon name="ChevronRight" size={16} />
          </Button>
        </div>
      </div>

      <div 
        ref={scrollContainerRef}
        className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {relatedProducts.map((product) => (
          <div
            key={product.id}
            onClick={() => handleProductClick(product)}
            className="flex-shrink-0 w-64 bg-card/30 rounded-lg overflow-hidden border border-border cursor-pointer hover:border-primary/50 transition-all duration-200 hover:scale-105"
          >
            <div className="relative aspect-[3/4]">
              <Image
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              
              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col space-y-2">
                {product.isNew && (
                  <span className="bg-accent text-accent-foreground px-2 py-1 rounded-md text-xs font-medium">
                    NEW
                  </span>
                )}
                {product.discount > 0 && (
                  <span className="bg-error text-error-foreground px-2 py-1 rounded-md text-xs font-medium">
                    -{product.discount}%
                  </span>
                )}
              </div>

              {/* Like Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => handleLike(product.id, e)}
                className="absolute top-3 right-3 w-8 h-8 bg-black/20 backdrop-blur-xs text-white hover:bg-black/40 hover:text-error transition-colors"
              >
                <Icon name="Heart" size={16} />
              </Button>

              {/* Quick Actions */}
              <div className="absolute bottom-3 left-3 right-3 flex space-x-2 opacity-0 hover:opacity-100 transition-opacity duration-200">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 bg-white/90 backdrop-blur-xs text-black hover:bg-white text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Quick view:', product.id);
                  }}
                >
                  Quick View
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 bg-white/90 backdrop-blur-xs text-black hover:bg-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Add to cart:', product.id);
                  }}
                >
                  <Icon name="ShoppingBag" size={14} />
                </Button>
              </div>
            </div>

            <div className="p-4 space-y-3">
              {/* Brand and Rating */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-primary font-medium">{product.brand}</span>
                <div className="flex items-center space-x-1">
                  <Icon name="Star" size={12} className="text-warning" fill="currentColor" />
                  <span className="text-xs text-muted-foreground font-mono">{product.rating}</span>
                </div>
              </div>

              {/* Product Name */}
              <h4 className="font-semibold text-foreground text-sm leading-tight line-clamp-2">
                {product.name}
              </h4>

              {/* Price */}
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-foreground font-mono">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through font-mono">
                    ${product.originalPrice}
                  </span>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {product.tags.slice(0, 2).map((tag) => (
                  <span 
                    key={tag}
                    className="px-2 py-1 bg-muted/50 text-muted-foreground text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Community Stats */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <Icon name="Heart" size={12} className="text-error" />
                    <span className="font-mono">{product.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="MessageCircle" size={12} />
                    <span className="font-mono">{product.reviewCount}</span>
                  </div>
                </div>
                <button className="text-primary hover:text-primary/80 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="text-center pt-4">
        <Button variant="outline" className="w-full md:w-auto">
          <Icon name="Grid3X3" size={16} className="mr-2" />
          View All Similar Items
        </Button>
      </div>
    </div>
  );
};

export default RelatedProducts;