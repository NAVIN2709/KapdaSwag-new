import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserData } from 'functions/Userfunctions';
import { useState, useEffect } from 'react';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  const [error, setError] = useState(null);
  const [userdata, setUserdata] = useState(null);
  const location = useLocation();

  useEffect(() => {
    let mounted = true;

    const checkOnboarding = async () => {
      if (!user) {
        setCheckingOnboarding(false);
        return;
      }

      try {
        const userData = await getUserData(user.uid);
        if (mounted) {
          setUserdata(userData);
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        if (mounted) {
          setError(error);
        }
      } finally {
        if (mounted) {
          setCheckingOnboarding(false);
        }
      }
    };

    checkOnboarding();

    return () => {
      mounted = false;
    };
  }, [user]);

  if (loading || checkingOnboarding) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 mb-4">Error: {error.message}</div>
        <button
          onClick={() => {
            setError(null);
            setCheckingOnboarding(true);
          }}
          className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
        >
          Retry
        </button>
      </div>
    );
  }

  switch (true) {
  // Not logged in
  case !user:
    return <Navigate to="/login" replace />;

  // Logged in but no user data → force to onboarding
  case userdata && !userdata.onboardingCompleted && location.pathname !== '/onboarding':
    return <Navigate to="/onboarding" replace />;

  // Logged in and onboarding completed but visiting onboarding/login
  case userdata?.onboardingCompleted &&
       (location.pathname === '/onboarding' || location.pathname === '/login'):
    return <Navigate to="/" replace />;

  default:
    return children;
}
};

export default ProtectedRoute;
