import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import DiscoveryFeedSwipeInterface from "pages/discovery-feed-swipe-interface";
import CommunityHub from "pages/community-hub";
import CategoryBrowse from "pages/category-browse";
import FriendDiscovery from "pages/friend-discovery";
import UserProfile from "pages/user-profile";
import ProductDetail from "pages/product-detail";
import NotFound from "pages/NotFound";
import Chats from 'pages/chats'
import ChatScreen from "pages/chats/[id]";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<DiscoveryFeedSwipeInterface />} />
        <Route path="/community-hub" element={<CommunityHub />} />
        <Route path="/category-browse" element={<CategoryBrowse />} />
        <Route path="/friend-discovery" element={<FriendDiscovery />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/product-detail" element={<ProductDetail />} />
        <Route path="/chats" element={<Chats />} />
        <Route path="/chats/:id" element={<ChatScreen />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;