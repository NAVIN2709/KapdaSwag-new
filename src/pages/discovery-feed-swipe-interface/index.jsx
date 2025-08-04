import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Header from "../../components/ui/Header";
import BottomNavigation from "../../components/ui/BottomNavigation";
import ProductCard from "./components/ProductCard";
import LoadingCard from "./components/LoadingCard";
import Icon from "../../components/AppIcon";
import { getProducts } from "../../functions/Userfunctions"; // Firestore fetch
import { handleSwipe } from "../../functions/Userfunctions";

const DiscoveryFeedSwipeInterface = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const containerRef = useRef(null);

  // Fetch products from Firestore on mount
  useEffect(() => {
    const initializeApp = async () => {
      setIsLoading(true);

      try {
        const data = await getProducts();
        if (data.length > 0) {
          setProducts(data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }

      setIsLoading(false);

      // Check tutorial
      const hasSeenTutorial = localStorage.getItem(
        "fashionswipe_tutorial_seen"
      );
      if (!hasSeenTutorial) {
        setShowInstructions(true);
        localStorage.setItem("fashionswipe_tutorial_seen", "true");
      }
    };

    initializeApp();
  }, []);

  // Handle window resize for desktop mode
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Keyboard navigation for desktop
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (!isDesktop) return;

      switch (event.key) {
        case "ArrowLeft":
          handleSwipeLeft(products[currentIndex]);
          break;
        case "ArrowRight":
          handleSwipeRight(products[currentIndex]);
          break;
        case " ":
          event.preventDefault();
          handleDoubleTap(products[currentIndex]);
          break;
        case "Enter":
          handleProductDetail(products[currentIndex]);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentIndex, products, isDesktop]);

  // Load more products if near the end
  useEffect(() => {
    if (products.length - currentIndex <= 2 && !isLoading) {
      loadMoreProducts();
    }
  }, [currentIndex, products.length, isLoading]);

  const loadMoreProducts = async () => {
    setIsLoading(true);
    try {
      const more = await getProducts();
      setProducts((prev) => [...prev, ...more]);
    } catch (error) {
      console.error("Error loading more products:", error);
    }
    setIsLoading(false);
  };

  const handleSwipeLeft = useCallback((product) => {
    setProducts((prev) => prev.filter((p) => p.id !== product.id));
  }, []);

  const handleSwipeRight = useCallback((product) => {
    setProducts((prev) => prev.filter((p) => p.id !== product.id));
    handleSwipe(product);
  }, []);

  const handleProductDetail = (product) => {
    console.log("Open product detail:", product);
  };

  if (isLoading && products.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 pb-20 h-screen relative">
          <LoadingCard />
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Swipe interface */}
      <div
        ref={containerRef}
        className="pt-16 pb-20 h-screen relative overflow-hidden"
      >
        <div className="absolute inset-0 p-4">
          <AnimatePresence>
            {products
              .slice(currentIndex, currentIndex + 3)
              .map((product, index) => (
                <ProductCard
                  key={`${product.id}-${currentIndex}`}
                  product={product}
                  onSwipeLeft={handleSwipeLeft}
                  onSwipeRight={handleSwipeRight}
                  isActive={index === 0}
                  zIndex={3 - index}
                />
              ))}
          </AnimatePresence>
          {isLoading && <LoadingCard delay={0.2} />}
        </div>

        {/* Desktop arrows */}
        {isDesktop && (
          <>
            <button
              onClick={() => handleSwipeLeft(products[currentIndex])}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white"
            >
              <Icon name="ChevronLeft" size={24} />
            </button>
            <button
              onClick={() => handleSwipeRight(products[currentIndex])}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white"
            >
              <Icon name="ChevronRight" size={24} />
            </button>
          </>
        )}
      </div>

      <BottomNavigation />
      {showInstructions && (
        <div className="fixed inset-0 bg-black/50 text-white flex flex-col items-center justify-center z-[9999] p-6">
          <h1 className="text-2xl font-bold mb-4">Swipe Instructions</h1>
          <ol className="list-decimal list-inside text-lg space-y-2">
            <li>Swipe left if you don’t like a product</li>
            <li>Swipe right if you like a product</li>
            <li>Double tap to like instantly</li>
            <li>Long press for quick actions</li>
          </ol>
          <button
            onClick={() => setShowInstructions(false)}
            className="mt-6 px-6 py-3 bg-white text-black rounded-md text-base font-semibold"
          >
            Got it
          </button>
        </div>
      )}
    </div>
  );
};

export default DiscoveryFeedSwipeInterface;
