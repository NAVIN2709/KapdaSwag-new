import React, { useState, useRef } from "react";
import axios from "axios";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { saveUserData, deleteCloudinaryByUrl } from "functions/Userfunctions";
import { useAuth } from "../../../context/AuthContext";

const EditProfileModal = ({ isOpen, onClose, user, onSave }) => {
  const { user: authUser } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    username: user?.username || "",
    bio: user?.bio || "",
    location: user?.location || "",
    interests: user?.interests || [],
    profilePic: user?.profilePic || "", // stored Cloudinary URL
    instagram: user?.instagram || "",
    snapchat: user?.snapchat || "",
    isBrand: user?.isBrand || false,
  });

  const [preview, setPreview] = useState(user?.profilePic || ""); // 🆕 for preview
  const [newFile, setNewFile] = useState(null); // 🆕 hold selected file until Save
  const [isLoading, setIsLoading] = useState(false);
  const [isprofilepicloading, setIsprofilepicloading] = useState(false);

  const fileInputRef = useRef(null);

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

  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsprofilepicloading(true); // show loading spinner
    setPreview(URL.createObjectURL(file)); // preview immediately

    try {
      // Delete old Cloudinary image if exists
      if (
        formData.profilePic &&
        formData.profilePic.includes("res.cloudinary.com")
      ) {
        await deleteCloudinaryByUrl(formData.profilePic);
      }

      // Upload new file to Cloudinary
      const uploadedUrl = await uploadFileAndGetUrl(file);

      if (!uploadedUrl) {
        alert("Image upload failed. Please try again.");
        setIsprofilepicloading(false);
        return;
      }

      // Update form data immediately
      setFormData((prev) => ({
        ...prev,
        profilePic: uploadedUrl,
      }));
    } catch (err) {
      console.error("Error uploading profile pic:", err);
      alert("Failed to upload image. Try again.");
    } finally {
      setIsprofilepicloading(false);
    }
  };

  const toggleBrandAccount = () => {
    const newValue = !formData.isBrand;
    const confirmMsg = newValue
      ? "Are you sure you want to switch to a Brand Account?"
      : "Are you sure you want to switch back to a Personal Account?";
    if (window.confirm(confirmMsg)) {
      setFormData((prev) => ({ ...prev, isBrand: newValue }));
    }
  };

  const uploadFileAndGetUrl = async (file) => {
    const data = new FormData();
    data.append("file", file);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_CLOUDINARY_URL}/upload-profilepic`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return res.data.url; // Cloudinary URL returned by backend
    } catch (error) {
      console.error("Upload failed:", error);
      throw error;
    }
  };

  const handleSave = async () => {
    if (!authUser?.uid) {
      console.error("No authenticated user found");
      return;
    }

    setIsLoading(true);
    try {
      await saveUserData(authUser.uid, formData);

      if (onSave) onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="w-full max-w-2xl h-[90vh] bg-background rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-border bg-card sticky top-3 z-10">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={22} />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">
            Edit Profile
          </h1>
          <Button
            variant="default"
            onClick={handleSave}
            loading={isLoading}
            disabled={!formData.name.trim() || !formData.username.trim()}
          >
            Save
          </Button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <div
                className="w-28 h-28 rounded-full overflow-hidden bg-muted cursor-pointer flex items-center justify-center"
                onClick={handleAvatarClick}
              >
                {isprofilepicloading ? (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <Icon
                      name="Loader2"
                      size={20}
                      className="animate-spin text-white mb-2"
                    />
                    <p className="text-sm text-white">Uploading...</p>
                  </div>
                ) : (
                  <Image
                    src={preview} // shows existing URL or local preview
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div
                onClick={handleAvatarClick}
                className="absolute bottom-0 right-0 w-9 h-9 bg-primary text-primary-foreground rounded-full flex items-center justify-center border-2 border-background shadow-lg group-hover:scale-105 transition-transform"
              >
                <Icon name="Camera" size={16} />
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <Button variant="outline" size="sm" onClick={handleAvatarClick}>
              Change Photo
            </Button>
          </div>

          {/* Brand Account Toggle */}
          <div className="flex items-center justify-between bg-muted/20 p-3 rounded-lg">
            <span className="text-foreground font-medium">
              Switch to Creator
            </span>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isBrand}
                onChange={toggleBrandAccount}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-checked:bg-primary rounded-full relative transition-colors">
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    formData.isBrand ? "translate-x-5" : ""
                  }`}
                ></div>
              </div>
            </label>
          </div>

          {/* Form Fields */}
          <div className="space-y-5">
            <Input
              label="Name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter your full name"
              required
            />
            <Input
              label="Username"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              placeholder="@username"
              required
            />
            <div>
              <label className="block text-sm font-medium mb-2">Bio</label>
              <textarea
                rows={4}
                value={formData.bio}
                maxLength={150}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="Tell the community about your style..."
                className="w-full bg-input border border-border rounded-lg p-3 text-foreground placeholder-muted-foreground resize-none"
              />
              <div className="text-right text-xs text-muted-foreground mt-1">
                {formData.bio.length}/150
              </div>
            </div>
            <Input
              label="Location"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="City, Country"
            />
          </div>

          <Input
            label="Instagram"
            value={formData.instagram}
            onChange={(e) => handleInputChange("instagram", e.target.value)}
            placeholder="your_instagram_handle"
          />
          <Input
            label="Snapchat"
            value={formData.snapchat}
            onChange={(e) => handleInputChange("snapchat", e.target.value)}
            placeholder="your_snapchat_username"
          />

          {/* Style Tags */}
          <div>
            <label className="block text-sm font-medium mb-2">Style Tags</label>
            <div className="flex flex-wrap gap-2">
              {fashionTags.map((tag, idx) => {
                const isSelected = formData.interests.includes(tag);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        interests: isSelected
                          ? prev.interests.filter((t) => t !== tag)
                          : [...prev.interests, tag],
                      }));
                    }}
                    className={`px-3 py-1 rounded-full border transition ${
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
