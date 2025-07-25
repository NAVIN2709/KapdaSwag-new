import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/ui/Header';
import BottomNavigation from '../../components/ui/BottomNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ProductImageCarousel from './components/ProductImageCarousel';
import ProductInfo from './components/ProductInfo';
import VideoReviewSection from './components/VideoReviewSection';
import RelatedProducts from './components/RelatedProducts';
import ActionButtons from './components/ActionButtons';

const ProductDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLiked, setIsLiked] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeSection, setActiveSection] = useState('details');

  // Mock product data - in real app this would come from props or API
  const mockProduct = {
    id: 1,
    name: 'Vintage Oversized Blazer',
    brand: 'UrbanChic',
    price: 129.99,
    originalPrice: 179.99,
    rating: 4.8,
    reviewCount: 234,
    likes: 1247,
    comments: 89,
    boosts: 156,
    description: `This vintage-inspired oversized blazer combines timeless elegance with modern comfort. Crafted from premium wool blend fabric, it features structured shoulders, a relaxed fit, and classic lapels that make it perfect for both professional and casual settings.\n\nThe versatile design allows you to dress it up with tailored pants for the office or dress it down with jeans for a chic weekend look. The quality construction ensures durability while maintaining the sophisticated silhouette that defines contemporary fashion.`,
    material: '70% Wool, 25% Polyester, 5% Elastane',
    care: 'Dry clean only',
    origin: 'Made in Italy',
    sku: 'UC-BLZ-001',
    images: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop'
    ]
  };

  const [product] = useState(mockProduct);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  const handleAddToCart = (cartData) => {
    console.log('Added to cart:', cartData);
    // Show success message or navigate to cart
  };

  const handleSaveToCloset = (product, saved) => {
    console.log(saved ? 'Saved to closet:' : 'Removed from closet:', product.id);
  };

  const handleShare = (product) => {
    console.log('Shared product:', product.id);
  };

  const handleBuyNow = (purchaseData) => {
    console.log('Buy now:', purchaseData);
    // Navigate to checkout
  };

  const handleProductSelect = (selectedProduct) => {
    console.log('Selected related product:', selectedProduct.id);
    // In real app, this would update the current product or navigate to new product page
  };

  const sections = [
    { id: 'details', label: 'Details', icon: 'Info' },
    { id: 'reviews', label: 'Reviews', icon: 'Play' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Back Button */}
      <div className="fixed top-16 left-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="bg-background/80 backdrop-blur-sm border border-border hover:bg-background"
          style={{ width: '44px', height: '44px' }}
        >
          <Icon name="ArrowLeft" size={20} />
        </Button>
      </div>

      <div className="pt-16 pb-20">
        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Images */}
              <div className="sticky top-24">
                <ProductImageCarousel
                  images={product.images}
                  productName={product.name}
                  onLike={handleLike}
                  isLiked={isLiked}
                />
              </div>

              {/* Right Column - Product Info and Actions */}
              <div className="space-y-8">
                <ProductInfo
                  product={product}
                  onSizeSelect={handleSizeSelect}
                  onColorSelect={handleColorSelect}
                  selectedSize={selectedSize}
                  selectedColor={selectedColor}
                />
                
                <ActionButtons
                  product={product}
                  selectedSize={selectedSize}
                  selectedColor={selectedColor}
                  quantity={quantity}
                  onAddToCart={handleAddToCart}
                  onSaveToCloset={handleSaveToCloset}
                  onShare={handleShare}
                  onBuyNow={handleBuyNow}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          {/* Product Images */}
          <ProductImageCarousel
            images={product.images}
            productName={product.name}
            onLike={handleLike}
            isLiked={isLiked}
          />

          {/* Section Navigation */}
          <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
            <div className="flex space-x-1 p-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-200 ${
                    activeSection === section.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <Icon name={section.icon} size={16} />
                  <span className="text-sm font-medium">{section.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content Sections */}
          <div className="min-h-screen">
            {activeSection === 'details' && (
              <div className="space-y-6">
                <ProductInfo
                  product={product}
                  onSizeSelect={handleSizeSelect}
                  onColorSelect={handleColorSelect}
                  selectedSize={selectedSize}
                  selectedColor={selectedColor}
                />
                
                <div className="px-4">
                  <ActionButtons
                    product={product}
                    selectedSize={selectedSize}
                    selectedColor={selectedColor}
                    quantity={quantity}
                    onAddToCart={handleAddToCart}
                    onSaveToCloset={handleSaveToCloset}
                    onShare={handleShare}
                    onBuyNow={handleBuyNow}
                  />
                </div>
              </div>
            )}

            {activeSection === 'reviews' && (
              <VideoReviewSection />
            )}
          </div>
        </div>

        {/* Related Products - Both Desktop and Mobile */}
        <div className="mt-12 border-t border-border">
          <RelatedProducts
            currentProductId={product.id}
            onProductSelect={handleProductSelect}
          />
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default ProductDetail;