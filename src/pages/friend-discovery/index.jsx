import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/ui/Header";
import BottomNavigation from "../../components/ui/BottomNavigation";
import Icon from "../../components/AppIcon";
import FriendsList from "./components/FriendsList";
import SearchBar from "./components/SearchBar";
import SuggestedUsers from "./components/SuggestedUsers";

const FriendDiscovery = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("friends");

  const handleUserSelect = (user) => {
    navigate(`/profile/${user}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Discover Friends
            </h1>
            <p className="text-muted-foreground">
              Connect with fashion enthusiasts who share your style and interests
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <SearchBar onUserSelect={handleUserSelect} />
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-6 bg-muted/20 rounded-lg p-1">
            {[
              { id: "friends", label: "Friends", icon: "Users" },
              { id: "suggested", label: "Suggested", icon: "Sparkles" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md animation-spring
                  ${
                    activeTab === tab.id
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }
                `}
              >
                <Icon name={tab.icon} size={16} />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content based on active tab */}
          {activeTab === "suggested" && (
            <div className="max-w-2xl mx-auto">
              <SuggestedUsers />
            </div>
          )}

          {activeTab === "friends" && (
            <div className="max-w-2xl mx-auto">
              <FriendsList
                onChat={(friend) => navigate(`/chats/${friend.id}`)}
              />
            </div>
          )}
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
};

export default FriendDiscovery;
