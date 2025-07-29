import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";

// Pages
import DiscoveryFeedSwipeInterface from "pages/discovery-feed-swipe-interface";
import CommunityHub from "pages/community-hub";
import CategoryBrowse from "pages/category-browse";
import FriendDiscovery from "pages/friend-discovery";
import UserProfile from "pages/user-profile";
import ProductDetail from "pages/product-detail";
import NotFound from "pages/NotFound";
import ChatScreen from "pages/chats/[id]";
import Profile from "pages/user-profile/[id]";
import Login from "pages/login";

// Auth
import ProtectedRoute from "../src/components/ProtectedRoutes";
import { AuthProvider } from "../src/context/AuthContext";

const Routes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <ScrollToTop />
          <RouterRoutes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DiscoveryFeedSwipeInterface />
                </ProtectedRoute>
              }
            />
            <Route
              path="/community-hub"
              element={
                <ProtectedRoute>
                  <CommunityHub />
                </ProtectedRoute>
              }
            />
            <Route
              path="/category-browse"
              element={
                <ProtectedRoute>
                  <CategoryBrowse />
                </ProtectedRoute>
              }
            />
            <Route
              path="/friend-discovery"
              element={
                <ProtectedRoute>
                  <FriendDiscovery />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-profile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/product-detail"
              element={
                <ProtectedRoute>
                  <ProductDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chats/:id"
              element={
                <ProtectedRoute>
                  <ChatScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/:id"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </RouterRoutes>
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default Routes;
