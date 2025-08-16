import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/ui/Header";
import BottomNavigation from "../../components/ui/BottomNavigation";
import ProfileHeader from "./components/ProfileHeader";
import ProfileTabs from "./components/ProfileTabs";
import SavedFitsGrid from "./components/SavedFitsGrid";
import UserContentGrid from "./components/UserContentGrid";
import EditProfileModal from "./components/EditProfileModal";
import { useAuth } from "../../context/AuthContext";
import { getUserData } from "functions/Userfunctions";
import Loadingspinner from "components/ui/Loadingspinner";
import NewPost from "./components/NewPost";

const UserProfile = () => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [activeTab, setActiveTab] = useState("saved");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [user, setUser] = useState(null);
  const [savedProducts, setSavedProducts] = useState([]);
  const [userContent, setUserContent] = useState([]);
  const [stylePreferences, setStylePreferences] = useState({});
  const [isOwnProfile] = useState(true);
  const [showSpinner, setShowSpinner] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!authUser) return;
      try {
        const userData = await getUserData(authUser.uid);
        if (userData) {
          setUser(userData);
          setSavedProducts(userData.savedProducts || []);
          setUserContent(userData.userContent || []);
          setStylePreferences(userData.interests || {});
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };
    fetchData();
  }, [authUser]);

  const handleEditProfile = () => setShowEditModal(true);
  const handleSaveProfile = (updatedData) =>
    setUser((prev) => ({ ...prev, ...updatedData }));

  const handleFollow = (isFollowing) =>
    console.log("Follow action:", isFollowing);
  const handleMessage = () => console.log("Message user");

  const handleProductClick = (product) =>
    navigate(`/product-detail/${product.id}`, { state: { product } });
  const handleRemoveProduct = (productId) =>
    setSavedProducts((prev) => prev.filter((id) => id !== productId));

  const handleContentClick = (content) =>
    console.log("Content clicked:", content);

  useEffect(() => {
    const timer = setTimeout(() => setShowSpinner(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const tabCounts = {
    saved: savedProducts.length,
    content: userContent.length,
    preferences: Object.keys(stylePreferences).length,
  };

  if (!user || showSpinner) {
    return <Loadingspinner />;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "saved":
        return (
          <SavedFitsGrid
            products={savedProducts}
            onProductClick={handleProductClick}
            onRemoveProduct={handleRemoveProduct}
          />
        );
      case "content":
        return (
          <UserContentGrid
            content={userContent}
            onContentClick={handleContentClick}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
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

        <div className="min-h-[50vh]">{renderTabContent()}</div>
      </main>

      <BottomNavigation />

      {/* Floating + Button for Brand */}
      {user?.isBrand && (
        <button
          onClick={() => setShowNewPostModal(true)}
          className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-primary/90 transition text-2xl"
        >
          +
        </button>
      )}

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        user={user}
        onSave={handleSaveProfile}
      />

      {/* New Post Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-4 w-full max-w-2xl relative">
            <button
              onClick={() => setShowNewPostModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              ✕
            </button>
            <NewPost onClose={() => setShowNewPostModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
