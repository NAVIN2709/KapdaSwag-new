import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/ui/Header";
import BottomNavigation from "../../components/ui/BottomNavigation";
import ProfileHeader from "./components/ProfileHeader";
import ProfileTabs from "./components/ProfileTabs";
import SavedFitsGrid from "./components/SavedFitsGrid";
import UserContentGrid from "./components/UserContentGrid";
import EditProfileModal from "./components/EditProfileModal";
import { useAuth } from "../../context/AuthContext"; // Auth context
import { getUserData } from "functions/Userfunctions";
import Loadingspinner from "components/ui/Loadingspinner";

const UserProfile = () => {
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth(); // Get user + logout
  const [activeTab, setActiveTab] = useState("saved");
  const [showEditModal, setShowEditModal] = useState(false);
  const [user, setUser] = useState(null);
  const [savedProducts, setSavedProducts] = useState([]);
  const [userContent, setUserContent] = useState([]);
  const [stylePreferences, setStylePreferences] = useState({});
  const [isOwnProfile] = useState(true);

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
    navigate("/product-detail", { state: { product } });
  const handleRemoveProduct = (productId) =>
    setSavedProducts((prev) => prev.filter((p) => p.id !== productId));
  const handleContentClick = (content) =>
    console.log("Content clicked:", content);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login"); // redirect to login page
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const tabCounts = {
    saved: savedProducts.length,
    content: userContent.length,
    preferences: Object.keys(stylePreferences).length,
  };

  if (!user) {
    return (
      <Loadingspinner />
    );
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

        <div className="min-h-[50vh]">{renderTabContent()}</div>
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
