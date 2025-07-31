import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../firebase"; // ✅ Make sure Firestore is initialized in firebase.js

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Listen for login/logout
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // ✅ Google Sign-In + Firestore User Data Check
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setAuthLoading(true);
      console.log("Started login...");
      const result = await signInWithPopup(auth, provider);
      console.log("Login successful");

      const uid = result.user.uid;

      // 🔍 Fetch user data from Firestore
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        navigate("/")
      } else {
        console.log("❌ No user document found in Firestore for UID:", uid);
        navigate("/onboarding")
        return
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }finally {
    setAuthLoading(false); 
  }
  };

  // Logout
  const logout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loginWithGoogle, logout, authLoading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
