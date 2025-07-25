import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Header from "../../components/ui/Header";
import BottomNavigation from "../../components/ui/BottomNavigation";
import QuickActionMenu from "../../components/ui/QuickActionMenu";
import ProductCard from "./components/ProductCard";
import LoadingCard from "./components/LoadingCard";
import Icon from "../../components/AppIcon";

const DiscoveryFeedSwipeInterface = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [quickActionMenu, setQuickActionMenu] = useState({
    isOpen: false,
    position: null,
    product: null,
  });
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const containerRef = useRef(null);

  // Mock product data
  const mockProducts = [
    {
      id: 1,
      name: "Vintage Denim Jacket",
      brand: "Urban Threads",
      price: 89.99,
      originalPrice: 129.99,
      video:"https://media.istockphoto.com/id/1223030415/video/she-is-so-cool.mp4?s=mp4-640x640-is&k=20&c=wRTO589HVyFrvBSUXsm8_wvBT7vsAF-NCGvp3_Jf2jA=",
      image:
        "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=600&fit=crop",
      brandLogo:
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=50&h=50&fit=crop",
      likes: 1247,
      rating: 4.8,
      isTrending: true,
      tags: ["vintage", "denim", "casual"],
      description:
        "Classic vintage-inspired denim jacket with modern fit and premium quality construction.",
        designer:"@navin2006",
      comments: {
        text: [
          { username: "mia", comment: "Looks great on snow trips!" },
          { username: "jake", comment: "Stylish & warm." },
        ],
        video: [
          {
            username: "nina",
            videoUrl:
              "https://media.gettyimages.com/id/1408879369/video/beautiful-african-american-woman-with-an-afro-sitting-alone-on-a-wicker-chair-and-feeling.mp4?s=mp4-640x640-gi&k=20&c=rXqz5kK2uAmDCTwqE-7Ov8rPsfvPFuqjJJPWJ1txJQ4=",
          },
          {
            username: "leo",
            videoUrl:
              "https://media.gettyimages.com/id/1408879369/video/beautiful-african-american-woman-with-an-afro-sitting-alone-on-a-wicker-chair-and-feeling.mp4?s=mp4-640x640-gi&k=20&c=rXqz5kK2uAmDCTwqE-7Ov8rPsfvPFuqjJJPWJ1txJQ4=",
          },
        ],
      },
    },
    {
      id: 2,
      name: "Floral Summer Dress",
      brand: "Bloom & Co",
      price: 65.0,
      designer:"@kapdaswag",
      video:"https://media.istockphoto.com/id/1195291668/video/back-view-of-shopping-woman-walking-on-city-street-tourist-girl-looking-camera.mp4?s=mp4-640x640-is&k=20&c=ZG5KbNyqVvCZ3MpmkSVJU5BrcR8kRXWo-GYdPVA3ZE4=",
      image:
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=600&fit=crop",
      brandLogo:
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=50&h=50&fit=crop",
      likes: 892,
      rating: 4.6,
      isTrending: false,
      tags: ["floral", "summer", "dress"],
      description:
        "Lightweight floral dress perfect for summer occasions with breathable fabric.",
      comments: {
        text: [
          { username: "elena", comment: "Perfect for beach days!" },
          { username: "sofia", comment: "Super flowy and light." },
        ],
        video: [
          {
            username: "zoe",
            videoUrl:
              "https://media.istockphoto.com/id/1189890620/video/spinning-girl-in-dress.mp4",
          },
        ],
      },
    },
    {
      id: 3,
      name: "Minimalist White Sneakers",
      brand: "Clean Steps",
      price: 120.0,
      originalPrice: 150.0,
      designer:"@navin2006",
      image:
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=600&fit=crop",
      brandLogo:
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=50&h=50&fit=crop",
      likes: 2156,
      rating: 4.9,
      isTrending: true,
      tags: ["minimalist", "sneakers", "white"],
      description:
        "Premium leather sneakers with minimalist design and superior comfort.",
      comments: {
        text: [
          { username: "dave", comment: "Clean look and super comfy!" },
          { username: "rachel", comment: "Great grip and cushioning." },
        ],
        video: [],
      },
    },
    {
      id: 4,
      name: "Oversized Hoodie",
      brand: "Comfort Zone",
      price: 45.0,
      designer:"@navin2006",
      image:
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=600&fit=crop",
      brandLogo:
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=50&h=50&fit=crop",
      likes: 1567,
      rating: 4.7,
      isTrending: false,
      tags: ["oversized", "hoodie", "comfort"],
      description:
        "Ultra-soft oversized hoodie perfect for lounging and casual outings.",
      comments: {
        text: [
          { username: "kevin", comment: "Feels like a hug!" },
          { username: "lisa", comment: "Colors stay vibrant after wash." },
        ],
        video: [
          {
            username: "finn",
            videoUrl:
              "https://media.istockphoto.com/id/1197852365/video/young-woman-in-hoodie.mp4",
          },
        ],
      },
    },
    {
      id: 5,
      name: "Leather Crossbody Bag",
      brand: "Artisan Craft",
      designer:"@navin2006",
      price: 180.0,
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=600&fit=crop",
      brandLogo:
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=50&h=50&fit=crop",
      likes: 743,
      rating: 4.5,
      isTrending: false,
      tags: ["leather", "bag", "crossbody"],
      description:
        "Handcrafted leather crossbody bag with vintage-inspired design and modern functionality.",
      comments: {
        text: [
          { username: "amy", comment: "Super elegant!" },
          { username: "nora", comment: "Matches all my outfits." },
        ],
        video: [],
      },
    },
    {
      id: 6,
      name: "High-Waisted Jeans",
      brand: "Denim Dreams",
      designer:"@navin2006",
      price: 75.0,
      originalPrice: 95.0,
      image:
        "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=600&fit=crop",
      brandLogo:
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=50&h=50&fit=crop",
      likes: 1834,
      rating: 4.8,
      isTrending: true,
      tags: ["highwaisted", "jeans", "denim"],
      description:
        "Flattering high-waisted jeans with stretch comfort and timeless style.",
      comments: {
        text: [
          { username: "oliver", comment: "Perfect fit!" },
          {
            username: "hannah",
            comment: "Stretchy and comfy for all-day wear.",
          },
        ],
        video: [
          {
            username: "mark",
            videoUrl:
              "https://media.istockphoto.com/id/1250848423/video/fashion-jeans-walk.mp4",
          },
        ],
      },
    },
  ];

  // Initialize products and check for first-time user
  useEffect(() => {
    const initializeApp = async () => {
      setIsLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setProducts(mockProducts);
      setIsLoading(false);

      // Check if user is new (for tutorial)
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

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

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

  // Load more products when running low
  useEffect(() => {
    if (products.length - currentIndex <= 2 && !isLoading) {
      loadMoreProducts();
    }
  }, [currentIndex, products.length, isLoading]);

  const loadMoreProducts = async () => {
    setIsLoading(true);

    // Simulate API call for more products
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Add more products (cycling through mock data)
    const newProducts = mockProducts.map((product) => ({
      ...product,
      id: product.id + products.length,
      likes: Math.floor(Math.random() * 3000) + 100,
      boosts: Math.floor(Math.random() * 300) + 20,
      tasteMatch: Math.floor(Math.random() * 30) + 70,
    }));

    setProducts((prev) => [...prev, ...newProducts]);
    setIsLoading(false);
  };

  const handleSwipeLeft = useCallback((product) => {
    setProducts((prev) => prev.filter((p) => p.id !== product.id));
  }, []);

  const handleSwipeRight = useCallback((product) => {
    setProducts((prev) => prev.filter((p) => p.id !== product.id));
  }, []);

  const handleDoubleTap = useCallback((product) => {
    setCurrentIndex((prev) => prev + 1);
  }, []);

  const handleLongPress = useCallback((product) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setQuickActionMenu({
        isOpen: true,
        position: { x: rect.width / 2, y: rect.height / 2 },
        product,
      });
    }
  }, []);

  const handleProductDetail = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const quickActionMenuActions = [
    {
      id: "view",
      label: "View Details",
      icon: "Eye",
      color: "text-primary",
      action: () => handleProductDetail(quickActionMenu.product),
    },
    {
      id: "save",
      label: "Save to Closet",
      icon: "Bookmark",
      color: "text-warning",
      action: () => console.log("Saved to closet"),
    },
    {
      id: "share",
      label: "Share",
      icon: "Share",
      color: "text-accent",
      action: () => console.log("Shared product"),
    },
    {
      id: "report",
      label: "Report",
      icon: "Flag",
      color: "text-error",
      action: () => console.log("Reported product"),
    },
  ];

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

      {/* Main Swipe Interface */}
      <div
        ref={containerRef}
        className="pt-16 pb-20 h-screen relative overflow-hidden"
      >
        {/* Product Cards Stack */}
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
                  onDoubleTap={handleDoubleTap}
                  onLongPress={handleLongPress}
                  isActive={index === 0}
                  zIndex={3 - index}
                />
              ))}
          </AnimatePresence>

          {/* Loading Card for Next Items */}
          {isLoading && <LoadingCard delay={0.2} />}
        </div>

        {/* Desktop Navigation Arrows */}
        {isDesktop && (
          <>
            <button
              onClick={() => handleSwipeLeft(products[currentIndex])}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-black/40 hover:bg-black/60 backdrop-blur-xs rounded-full flex items-center justify-center text-white transition-colors"
            >
              <Icon name="ChevronLeft" size={24} />
            </button>

            <button
              onClick={() => handleSwipeRight(products[currentIndex])}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-black/40 hover:bg-black/60 backdrop-blur-xs rounded-full flex items-center justify-center text-white transition-colors"
            >
              <Icon name="ChevronRight" size={24} />
            </button>
          </>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />

      <QuickActionMenu
        isOpen={quickActionMenu.isOpen}
        onClose={() =>
          setQuickActionMenu({ isOpen: false, position: null, product: null })
        }
        position={quickActionMenu.position}
        actions={quickActionMenuActions}
      />
    </div>
  );
};

export default DiscoveryFeedSwipeInterface;
