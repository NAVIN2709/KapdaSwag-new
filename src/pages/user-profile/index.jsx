import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import BottomNavigation from '../../components/ui/BottomNavigation';
import ProfileHeader from './components/ProfileHeader';
import ProfileTabs from './components/ProfileTabs';
import SavedFitsGrid from './components/SavedFitsGrid';
import UserContentGrid from './components/UserContentGrid';
import StylePreferences from './components/StylePreferences';
import ActivityFeed from './components/ActivityFeed';
import EditProfileModal from './components/EditProfileModal';

const UserProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('saved');
  const [showEditModal, setShowEditModal] = useState(false);
  const [user, setUser] = useState(null);
  const [savedProducts, setSavedProducts] = useState([]);
  const [userContent, setUserContent] = useState([]);
  const [stylePreferences, setStylePreferences] = useState({});
  const [activities, setActivities] = useState([]);
  const [isOwnProfile] = useState(true); // Mock: assume viewing own profile

  // Mock user data
  useEffect(() => {
    const mockUser = {
      id: "user_001",
      name: "Emma Rodriguez",
      username: "emma_style",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400",
      bio: "Fashion enthusiast & style curator ✨\nLiving for vintage finds and sustainable fashion 🌱",
      followersCount: 2847,
      followingCount: 892,
      postsCount: 156,
      dripRating: 87,
      vibeScore: "Trendsetter",
      isVerified: true,
      isOnline: true,
      styleTags: ["vintage", "sustainable", "minimalist", "streetwear"],
      badges: [
        { name: "Top Reviewer", icon: "Star" },
        { name: "Trendsetter", icon: "TrendingUp" },
        { name: "Community Leader", icon: "Crown" }
      ],
      website: "https://emmastyle.blog",
      location: "Los Angeles, CA",
      isPrivate: false
    };

    const mockSavedProducts = [
      {
        id: "prod_001",
        name: "Vintage Denim Jacket",
        brand: "Levi\'s",
        price: 89.99,
        originalPrice: 120.00,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
        likes: 234,
        savedDate: "2 days ago"
      },
      {
        id: "prod_002",
        name: "Sustainable Cotton Tee",
        brand: "Everlane",
        price: 32.00,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
        likes: 156,
        savedDate: "1 week ago"
      },
      {
        id: "prod_003",
        name: "High-Waisted Mom Jeans",
        brand: "Urban Outfitters",
        price: 78.00,
        image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400",
        likes: 189,
        savedDate: "3 days ago"
      },
      {
        id: "prod_004",
        name: "Oversized Blazer",
        brand: "Zara",
        price: 95.00,
        image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400",
        likes: 298,
        savedDate: "5 days ago"
      },
      {
        id: "prod_005",
        name: "Platform Sneakers",
        brand: "Converse",
        price: 85.00,
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400",
        likes: 167,
        savedDate: "1 week ago"
      },
      {
        id: "prod_006",
        name: "Cropped Cardigan",
        brand: "& Other Stories",
        price: 65.00,
        image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400",
        likes: 143,
        savedDate: "4 days ago"
      }
    ];

    const mockUserContent = [
      {
        id: "content_001",
        type: "reviews",
        title: "My honest review of this vintage find",
        thumbnail: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400",
        likes: 456,
        comments: 23,
        createdAt: "2 days ago",
        isPopular: true
      },
      {
        id: "content_002",
        type: "videos",
        title: "Styling one dress 3 ways",
        thumbnail: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400",
        likes: 789,
        comments: 45,
        duration: "2:34",
        createdAt: "1 week ago",
        isPopular: true
      },
      {
        id: "content_003",
        type: "posts",
        title: "Thrift haul from weekend adventures",
        thumbnail: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
        likes: 234,
        comments: 12,
        createdAt: "3 days ago"
      },
      {
        id: "content_004",
        type: "reviews",
        title: "Sustainable fashion brand spotlight",
        thumbnail: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400",
        likes: 345,
        comments: 18,
        createdAt: "5 days ago"
      }
    ];

    const mockStylePreferences = {
      styles: ["vintage", "sustainable", "minimalist", "casual"],
      colorPalette: "neutral",
      sizeRange: {
        tops: "M",
        bottoms: "M"
      },
      budgetRange: {
        min: 30,
        max: 150
      },
      inspirations: [
        {
          name: "Vintage Vibes",
          image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=200"
        },
        {
          name: "Minimalist Chic",
          image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=200"
        },
        {
          name: "Street Style",
          image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200"
        }
      ]
    };

    const mockActivities = [
      {
        id: "activity_001",
        type: "likes",
        action: "liked",
        target: "Vintage Denim Jacket by Levi\'s",
        timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
        thumbnail: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=100",
        engagement: { likes: 12, comments: 3 }
      },
      {
        id: "activity_002",
        type: "follows",
        action: "started following",
        target: "@vintage_curator",
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      },
      {
        id: "activity_003",
        type: "saves",
        action: "saved",
        target: "Sustainable Cotton Tee by Everlane",
        timestamp: new Date(Date.now() - 7200000), // 2 hours ago
        thumbnail: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100"
      },
      {
        id: "activity_004",
        type: "comments",
        action: "commented on",
        target: "Street Style Inspiration Post",
        timestamp: new Date(Date.now() - 14400000), // 4 hours ago
        details: "Love this look! Where did you get those boots?",
        engagement: { likes: 8, comments: 2 }
      },
      {
        id: "activity_005",
        type: "posts",
        action: "posted",
        target: "My honest review of this vintage find",
        timestamp: new Date(Date.now() - 172800000), // 2 days ago
        thumbnail: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=100",
        engagement: { likes: 456, comments: 23, shares: 12 }
      }
    ];

    setUser(mockUser);
    setSavedProducts(mockSavedProducts);
    setUserContent(mockUserContent);
    setStylePreferences(mockStylePreferences);
    setActivities(mockActivities);
  }, []);

  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  const handleSaveProfile = (updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
  };

  const handleFollow = (isFollowing) => {
    console.log('Follow action:', isFollowing);
  };

  const handleMessage = () => {
    console.log('Message user');
  };

  const handleProductClick = (product) => {
    navigate('/product-detail', { state: { product } });
  };

  const handleRemoveProduct = (productId) => {
    setSavedProducts(prev => prev.filter(p => p.id !== productId));
  };

  const handleContentClick = (content) => {
    console.log('Content clicked:', content);
  };

  const handleUpdatePreferences = (newPreferences) => {
    setStylePreferences(newPreferences);
  };

  const handleLoadMoreActivity = () => {
    console.log('Load more activity');
  };

  const tabCounts = {
    saved: savedProducts.length,
    content: userContent.length,
    preferences: Object.keys(stylePreferences).length
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'saved':
        return (
          <SavedFitsGrid
            products={savedProducts}
            onProductClick={handleProductClick}
            onRemoveProduct={handleRemoveProduct}
          />
        );
      case 'content':
        return (
          <UserContentGrid
            content={userContent}
            onContentClick={handleContentClick}
          />
        );
      case 'preferences':
        return (
          <StylePreferences
            preferences={stylePreferences}
            onUpdatePreferences={handleUpdatePreferences}
            isOwnProfile={isOwnProfile}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16 pb-20">
        <ProfileHeader
          user={user}
          isOwnProfile={isOwnProfile}
          onEditProfile={handleEditProfile}
          onFollow={handleFollow}
          onMessage={handleMessage}
        />

        <ProfileTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          counts={tabCounts}
        />

        <div className="min-h-[50vh]">
          {renderTabContent()}
        </div>

        {/* Activity Feed - Desktop Only */}
        <div className="hidden lg:block fixed right-4 top-20 w-80 h-[calc(100vh-6rem)] bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Recent Activity</h3>
          </div>
          <div className="h-full overflow-y-auto">
            <ActivityFeed
              activities={activities.slice(0, 5)}
              onLoadMore={handleLoadMoreActivity}
            />
          </div>
        </div>
      </main>

      <BottomNavigation />

      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        user={user}
        onSave={handleSaveProfile}
      />
    </div>
  );
};

export default UserProfile;