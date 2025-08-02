import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { getUserData } from "functions/Userfunctions";

const videos = [
  "https://media.istockphoto.com/id/2192664753/video/young-female-customer-selecting-handbag-in-modern-boutique-store.mp4?s=mp4-640x640-is&k=20&c=9gvey5V0VoTNHAtcMwQ7GYKvVRwCL47cnkvQxqW5zb4=",
  "https://media.istockphoto.com/id/1872396434/video/black-woman-using-virtual-reality-headset-for-online-shopping-browsing-through-stylish.mp4?s=mp4-640x640-is&k=20&c=5M7r9wsQkfzwJ4wNMeXsdoD9SPc79XRQ5T2sbMcjVKM=",
];

export default function Login() {
  const navigate = useNavigate();
  const { loginWithGoogle, authLoading, user } = useAuth();
  const [currentVideo, setCurrentVideo] = useState(0);


useEffect(() => {
  const checkUser = async () => {
    if (!user) return; // no user logged in, don't navigate

    try {
      const data = await getUserData(user.uid);

      // Example: navigate only if profile is complete
      if (data?.onboardingCompleted) {
        navigate("/", { replace: true });
      } else {
        navigate("/onboarding", { replace: true });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  checkUser();
}, [user]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideo((prev) => (prev + 1) % videos.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Videos */}
      {videos.map((video, index) => (
        <video
          key={index}
          autoPlay
          loop
          muted
          playsInline
          className={`absolute inset-0 w-full h-full object-cover filter blur-sm transition-opacity duration-1000 ${
            index === currentVideo ? "opacity-100" : "opacity-0"
          }`}
        >
          <source src={video} type="video/mp4" />
        </video>
      ))}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-transparent" />

      {/* Center Logo & Title */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <img
          src="./logo.png"
          alt="KapdaSwag Logo"
          className="w-20 h-20 mb-4 drop-shadow-lg"
        />
        <h1 className="text-3xl font-bold text-white drop-shadow-md">
          Welcome to KapdaSwag
        </h1>
        <p className="text-gray-100 mt-2 shadow-lg">
          Explore the latest fashion trends & community
        </p>
      </div>

      {/* Sign In Button at Bottom */}
      <div className="absolute bottom-10 left-0 w-full flex justify-center px-6">
        <button
          onClick={loginWithGoogle}
          className="flex items-center justify-center w-full max-w-xs bg-background border border-white/30 rounded-full py-3 px-4 hover:bg-white/30 active:scale-[0.98] transition-all duration-200 backdrop-blur-sm shadow-lg"
        >
          {authLoading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              <span className="font-medium">Signing in...</span>
            </>
          ) : (
            <>
              <FcGoogle className="text-2xl mr-3" />
              <span className="text-white font-medium tracking-wide">
                Sign in with Google
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
