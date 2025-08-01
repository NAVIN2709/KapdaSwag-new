import React, { useState, useRef } from "react";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { saveUserData } from "functions/Userfunctions"; // <-- Import Firestore function
import { useAuth } from "../../../context/AuthContext"; // <-- To get logged-in user

const EditProfileModal = ({ isOpen, onClose, user, onSave }) => {
  const { user: authUser } = useAuth(); // current logged in user
  const [formData, setFormData] = useState({
    name: user?.name || "",
    username: user?.username || "",
    bio: user?.bio || "",
    location: user?.location || "",
    interests: user?.interests || [],
    profilePic: user?.avatar || "",
    instagram: user?.instagram || "",
    snapchat: user?.snapchat || "",
  });
  const [newTag, setNewTag] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({ ...prev, profilePic: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addStyleTag = () => {
    const trimmed = newTag.trim();
    if (trimmed && !formData.interests.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        interests: [...prev.interests, trimmed],
      }));
      setNewTag("");
    }
  };

  const removeStyleTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSave = async () => {
    if (!authUser?.uid) {
      console.error("No authenticated user found");
      return;
    }

    setIsLoading(true);
    try {
      await saveUserData(authUser.uid, formData); // Save to Firestore
      if (onSave) onSave(formData); // Optional: update UI without refetch
      onClose();
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="w-full max-w-2xl h-[90vh] bg-background rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-border bg-card sticky top-0 z-10">
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
                className="w-28 h-28 rounded-full overflow-hidden bg-muted cursor-pointer"
                onClick={handleAvatarClick}
              >
                <Image
                  src={formData.profilePic}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
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
