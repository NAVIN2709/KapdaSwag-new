import React, { useState, useEffect, Suspense, lazy } from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";

// Components
import ProtectedRoute from "./components/ProtectedRoutes";
import { AuthProvider } from "./context/AuthContext";
import  Loadingspinner  from "./components/ui/Loadingspinner";

// Lazy loaded pages
const DiscoveryFeedSwipeInterface = lazy(() =>
  import("pages/discovery-feed-swipe-interface")
);
const CommunityHub = lazy(() => import("pages/community-hub"));
const CategoryBrowse = lazy(() => import("pages/category-browse"));
const FriendDiscovery = lazy(() => import("pages/friend-discovery"));
const UserProfile = lazy(() => import("pages/user-profile"));
const ProductDetail = lazy(() => import("pages/product-detail"));
const NotFound = lazy(() => import("pages/NotFound"));
const ChatScreen = lazy(() => import("pages/chats/[id]"));
const Profile = lazy(() => import("pages/user-profile/[id]"));
const Login = lazy(() => import("pages/login"));
const Onboarding = lazy(() => import("pages/onboarding"));
const SplashScreen = lazy(() => import("pages/splashscreen"));

const Routes = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const splashTimeout = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(splashTimeout);
  }, []);

  if (showSplash) return <SplashScreen />;

  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <ScrollToTop />
          <Suspense fallback={<Loadingspinner />}>
            <RouterRoutes>
              {/* Splash Screen */}
              <Route path="/splashscreen" element={<SplashScreen />} />

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
                path="/onboarding"
                element={
                  <ProtectedRoute>
                    <Onboarding />
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
          </Suspense>
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default Routes;
