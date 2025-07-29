import React from "react";
import { useAuth } from "../../context/AuthContext";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const { loginWithGoogle } = useAuth();

  return (
    <div className="flex items-center justify-center min-h-screen bg-transparent px-4">
      <div className="flex flex-col items-center">
        
        {/* Logo */}
        <img 
          src="./logo.png" 
          alt="KapdaSwag Logo"
          className="w-20 h-20 mb-6 drop-shadow-lg"
        />

        {/* Glass Card */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] p-8 w-full max-w-sm text-center">
          
          {/* Title */}
          <h2 className="text-3xl font-extrabold mb-2 text-white drop-shadow-md">
            Welcome to KapdaSwag
          </h2>
          <p className="text-gray-200 mb-8 text-sm">
            Sign in to explore the latest fashion trends & community
          </p>

          {/* Google Sign In Button */}
          <button
            onClick={loginWithGoogle}
            className="flex items-center justify-center w-full bg-white/20 border border-white/30 rounded-full py-3 px-4 hover:bg-white/30 active:scale-[0.98] transition-all duration-200 backdrop-blur-sm shadow-md"
          >
            <FcGoogle className="text-2xl mr-3" />
            <span className="text-white font-medium tracking-wide">
              Sign in with Google
            </span>
          </button>

          {/* Subtext */}
          <p className="mt-6 text-gray-400 text-xs">
            By signing in, you agree to our <span className="text-white underline cursor-pointer">Terms</span> & <span className="text-white underline cursor-pointer">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
}
