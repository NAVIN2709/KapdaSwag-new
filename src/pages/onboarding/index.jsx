import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCamera } from "react-icons/fi";
import { FaInstagram, FaSnapchat } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getUserData, saveUserData } from "functions/Userfunctions";
import { useAuth } from "../../context/AuthContext";

const fashionTags = [
  "Minimalistic",
  "Old Money",
  "Streetwear",
  "Bohemian",
  "Vintage",
  "Casual",
  "Chic",
  "Sporty",
];

const stepImages = [
  "https://i.pinimg.com/736x/0c/d0/59/0cd059340f2c67d7511476614a4cc8be.jpg",
  "https://i.pinimg.com/736x/f1/d9/df/f1d9df71e76b63041a0532e5f40da4b1.jpg",
  "https://images.pexels.com/photos/2983466/pexels-photo-2983466.jpeg",
  "https://i.pinimg.com/736x/be/e6/e2/bee6e28b158ff6a3bcdbe29fb67e465d.jpg",
  "https://i.pinimg.com/736x/21/1d/dd/211ddd9c37e190038cb3b575c777daad.jpg",
];
// Add this array above the component
const avatarImages = [
  "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg",
  "https://img.freepik.com/free-vector/smiling-woman-traditional-attire_1308-175670.jpg", // cat
  "https://img.freepik.com/free-vector/smiling-redhaired-boy-illustration_1308-176664.jpg", // dog
  "https://img.freepik.com/free-vector/smiling-woman-traditional-attire_1308-175837.jpg", // panda
  "https://img.freepik.com/free-vector/young-man-traditional-attire_1308-173539.jpg", // bunny
  "https://img.freepik.com/free-vector/woman-floral-costume-illustration_1308-173492.jpg", // monkey
];

const Onboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    profilePic: null,
    bio: "",
    snapchat: "",
    instagram: "",
    interests: [],
    name: "",
    onboardingCompleted: true,
  });

  const handleNext = () => setStep((s) => Math.min(s + 1, 5));
  const handlePrev = () => setStep((s) => Math.max(s - 1, 1));

  const handleChange = (e) =>
    setFormData((fd) => ({ ...fd, [e.target.name]: e.target.value }));

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result; // this is the base64 image
      setFormData((fd) => ({ ...fd, profilePic: base64String }));
      setUploading(false);
    };
    reader.onerror = () => {
      alert("Image conversion failed");
      setUploading(false);
    };

    reader.readAsDataURL(file);
  };

  const toggleInterest = (tag) =>
    setFormData((fd) => ({
      ...fd,
      interests: fd.interests.includes(tag)
        ? fd.interests.filter((t) => t !== tag)
        : [...fd.interests, tag],
    }));

  const handleSubmit = async () => {
    await saveUserData(user.uid, formData);

    // Fetch updated data
    const updatedUser = await getUserData(user.uid);

    if (updatedUser?.onboardingCompleted) {
      navigate("/");
    }
  };

  const progress = (step / 5) * 100;

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-white">
      {/* Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img
            src={stepImages[step - 1]}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/25" />
        </motion.div>
      </AnimatePresence>

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-white/10 z-20">
        <motion.div
          className="h-full bg-gradient-to-r from-pink-500 to-purple-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Floating Glass Card */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[20%] w-full flex justify-center"
        >
          <div className="p-6 rounded-2xl shadow-2xl w-full max-w-sm border border-white/20 bg-white/20 backdrop-blur-sm">
            <AnimatePresence mode="wait">
              {/* Step 1 */}
              {step === 1 && (
                <motion.div
                  key="1"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-xl font-extrabold mb-4 text-center">
                    Tell us about you
                  </h2>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="w-full mb-3 p-3 rounded-full bg-white/20 border border-white/30 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="@username"
                    className="w-full p-3 rounded-full bg-white/20 border border-white/30 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </motion.div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <motion.div
                  key="2"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center justify-center"
                >
                  <h2 className="text-xl font-extrabold mb-4">
                    📸 Upload Profile Pic
                  </h2>

                  {/* Upload Option */}
                  <label className="cursor-pointer group mb-4">
                    <div className="w-20 h-20 rounded-full bg-white/20 border-4 border-dashed border-white/30 flex items-center justify-center overflow-hidden hover:border-pink-500 transition-all duration-300">
                      {uploading ? (
                        <div className="loader border-2 border-t-2 border-gray-200 rounded-full w-6 h-6 animate-spin"></div>
                      ) : formData.profilePic ? (
                        <img
                          src={formData.profilePic}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FiCamera className="text-3xl text-gray-300 group-hover:text-pink-400" />
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>

                  {/* Avatar Image Slider */}
                  <h3 className="text-sm font-semibold mb-2">
                    Or choose an avatar
                  </h3>
                  <div className="flex items-center gap-3">
                    {/* Back Button */}
                    <button
                      onClick={() =>
                        setAvatarIndex(
                          (prev) =>
                            (prev - 1 + avatarImages.length) %
                            avatarImages.length
                        )
                      }
                      className="p-2 rounded-full bg-white/20 hover:bg-white/30"
                    >
                      ⬅
                    </button>

                    {/* Image Display */}
                    <motion.img
                      key={avatarImages[avatarIndex]}
                      src={avatarImages[avatarIndex]}
                      alt="avatar"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.4 }}
                      className={`w-20 h-20 rounded-full border-2 cursor-pointer transition-all ${
                        formData.profilePic === avatarImages[avatarIndex]
                          ? "border-pink-500 scale-105"
                          : "border-white/30 hover:border-pink-300"
                      }`}
                      onClick={() =>
                        setFormData((fd) => ({
                          ...fd,
                          profilePic: avatarImages[avatarIndex],
                        }))
                      }
                    />

                    {/* Next Button */}
                    <button
                      onClick={() =>
                        setAvatarIndex(
                          (prev) => (prev + 1) % avatarImages.length
                        )
                      }
                      className="p-2 rounded-full bg-white/20 hover:bg-white/30"
                    >
                      ➡
                    </button>
                  </div>
                  <div className="text-sm font-semibold mt-2">
                    click to choose
                  </div>
                </motion.div>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <motion.div
                  key="3"
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-2xl font-extrabold mb-4">
                    ✍️ Write your bio
                  </h2>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Tell your vibe..."
                    className="w-full p-3 rounded-2xl bg-white/20 border border-white/30 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </motion.div>
              )}

              {/* Step 4 */}
              {step === 4 && (
                <motion.div
                  key="4"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-2xl font-extrabold mb-4">
                    📱 Social Handles
                  </h2>
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <FaSnapchat className="w-7 h-7 mr-2 mb-2" />
                      <input
                        type="text"
                        name="snapchat"
                        value={formData.snapchat}
                        onChange={handleChange}
                        placeholder="Snapchat"
                        className="w-full p-3 mb-3 rounded-full bg-white/20 border border-white/30 placeholder-gray-300 focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                    <div className="flex items-center">
                      <FaInstagram className="w-7 h-7 mr-2" />
                      <input
                        type="text"
                        name="instagram"
                        value={formData.instagram}
                        onChange={handleChange}
                        placeholder="Instagram"
                        className="w-full p-3 rounded-full bg-white/20 border border-white/30 placeholder-gray-300 focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 5 */}
              {/* Step 5 */}
              {step === 5 && (
                <motion.div
                  key="5"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-2xl font-extrabold mb-4">
                    🎯 Pick your fashion interests
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {fashionTags.map((tag) => (
                      <motion.button
                        key={tag}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleInterest(tag)}
                        className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                          formData.interests.includes(tag)
                            ? "bg-gradient-to-r from-pink-500 to-purple-500 border-pink-300"
                            : "bg-white/20 border-white/30 hover:bg-white/30"
                        }`}
                      >
                        {tag}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Nav Buttons */}
            <div className="mt-6 flex justify-between">
              {step > 1 ? (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePrev}
                  className="px-4 py-2 rounded-full bg-white/20 border border-white/30 hover:bg-white/30 text-sm"
                >
                  ⬅ Back
                </motion.button>
              ) : (
                <div />
              )}
              {step < 5 ? (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNext}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-90 text-sm"
                >
                  Next ➡
                </motion.button>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmit}
                  className="px-4 py-2 rounded-full bg-green-500 hover:bg-green-400 text-sm"
                >
                  ✅ Finish
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Onboarding;
