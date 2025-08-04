import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Header from "../../components/ui/Header";
import BottomNavigation from "../../components/ui/BottomNavigation";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import ProductImageCarousel from "./components/ProductImageCarousel";
import ProductInfo from "./components/ProductInfo";
import VideoReviewSection from "./components/VideoReviewSection";
import ActionButtons from "./components/ActionButtons";
import { getProductData } from "functions/Userfunctions";
import { handleSaveProduct } from "functions/Userfunctions";
import { useAuth } from "context/AuthContext";

const ProductDetail = () => {
  const navigate = useNavigate();
  const {user}=useAuth();
  const { id } = useParams();
  const { state } = useLocation();

  const [product, setProduct] = useState(state?.product || null);
  const [isLiked, setIsLiked] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeSection, setActiveSection] = useState("details");

  // Fetch product if not passed via state
  useEffect(() => {
    if (!product && id) {
      (async () => {
        try {
          const fetchedProduct = await getProductData(id); // Fetch from Firestore
          setProduct(fetchedProduct);
        } catch (err) {
          console.error("Failed to fetch product", err);
        }
      })();
    }
  }, [product, id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBack = () => navigate(-1);

  const handleLike = () => setIsLiked(!isLiked);
  const handleSizeSelect = (size) => setSelectedSize(size);
  const handleColorSelect = (color) => setSelectedColor(color);
  const handleAddToCart = (cartData) => console.log("Added to cart:", cartData);

  const handleSaveToCloset = async (prod) => {
    try {
      await handleSaveProduct(user.uid,prod); // call your imported function
      console.log("Saved to closet:", prod);
    } catch (err) {
      console.error("Error saving product:", err);
    }
  };

  const handleShare = (prod) => console.log("Shared product:", prod.id);
  const handleBuyNow = (purchaseData) => console.log("Buy now:", purchaseData);
  const handleProductSelect = (selectedProduct) =>
    console.log("Selected related product:", selectedProduct.id);

  const sections = [
    { id: "details", label: "Details", icon: "Info" },
    { id: "reviews", label: "Reviews", icon: "Play" },
  ];

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading product...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Back Button */}
      <div className="fixed top-16 left-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="bg-background/80 backdrop-blur-sm border border-black hover:bg-background text-black mt-4"
          style={{ width: "44px", height: "44px" }}
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

              {/* Right Column */}
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
          <ProductImageCarousel
            images={[product.image]}
            productName={product.name}
            onLike={handleLike}
            isLiked={isLiked}
          />

          {/* Tabs */}
          <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
            <div className="flex space-x-1 p-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-200 ${
                    activeSection === section.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <Icon name={section.icon} size={16} />
                  <span className="text-sm font-medium">{section.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="min-h-screen">
            {activeSection === "details" && (
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
            {activeSection === "reviews" && <VideoReviewSection comments={product.comments} />}
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default ProductDetail;
