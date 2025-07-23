import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const EditProfileModal = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    username: user?.username || '',
    bio: user?.bio || '',
    website: user?.website || '',
    location: user?.location || '',
    styleTags: user?.styleTags || [],
    avatar: user?.avatar || '',
    isPrivate: user?.isPrivate || false
  });
  const [newTag, setNewTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          avatar: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addStyleTag = () => {
    if (newTag.trim() && !formData.styleTags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        styleTags: [...prev.styleTags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeStyleTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      styleTags: prev.styleTags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      onSave(formData);
      setIsLoading(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-300 bg-background/95 backdrop-blur-sm animate-fade-in">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between h-16 px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <Icon name="X" size={24} />
          </Button>
          
          <h1 className="text-lg font-semibold text-foreground">Edit Profile</h1>
          
          <Button
            variant="default"
            onClick={handleSave}
            loading={isLoading}
            disabled={!formData.name.trim() || !formData.username.trim()}
          >
            Save
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="p-4 space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-muted cursor-pointer" onClick={handleAvatarClick}>
                <Image
                  src={formData.avatar}
                  alt="Profile avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={handleAvatarClick}
                className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center border-2 border-background"
              >
                <Icon name="Camera" size={16} />
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button variant="outline" size="sm" onClick={handleAvatarClick}>
              Change Photo
            </Button>
          </div>

          {/* Basic Info */}
          <div className="space-y-4">
            <Input
              label="Display Name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Your display name"
              required
            />

            <Input
              label="Username"
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              placeholder="@username"
              description="This is how others will find you"
              required
            />

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Tell the community about your style..."
                rows={4}
                maxLength={150}
                className="w-full p-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground resize-none"
              />
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-muted-foreground">
                  {formData.bio.length}/150 characters
                </span>
              </div>
            </div>

            <Input
              label="Website"
              type="url"
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              placeholder="https://your-website.com"
            />

            <Input
              label="Location"
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="City, Country"
            />
          </div>

          {/* Style Tags */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Style Tags</label>
            <div className="space-y-3">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a style tag..."
                  className="flex-1 p-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground"
                  onKeyPress={(e) => e.key === 'Enter' && addStyleTag()}
                />
                <Button variant="outline" onClick={addStyleTag} disabled={!newTag.trim()}>
                  Add
                </Button>
              </div>
              
              {formData.styleTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.styleTags.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 px-3 py-1 bg-primary/10 text-primary rounded-full border border-primary/20"
                    >
                      <span className="text-sm">#{tag}</span>
                      <button
                        onClick={() => removeStyleTag(tag)}
                        className="text-primary hover:text-primary/70"
                      >
                        <Icon name="X" size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="space-y-4">
            <h3 className="text-md font-semibold text-foreground">Privacy Settings</h3>
            
            <div className="flex items-center justify-between p-3 bg-card rounded-xl border border-border">
              <div>
                <h4 className="font-medium text-foreground">Private Account</h4>
                <p className="text-sm text-muted-foreground">
                  Only approved followers can see your content
                </p>
              </div>
              <button
                onClick={() => handleInputChange('isPrivate', !formData.isPrivate)}
                className={`
                  relative w-12 h-6 rounded-full animation-spring
                  ${formData.isPrivate ? 'bg-primary' : 'bg-muted'}
                `}
              >
                <div
                  className={`
                    absolute top-0.5 w-5 h-5 bg-white rounded-full shadow animation-spring
                    ${formData.isPrivate ? 'left-6' : 'left-0.5'}
                  `}
                />
              </button>
            </div>
          </div>

          {/* Account Actions */}
          <div className="space-y-3 pt-4 border-t border-border">
            <Button variant="outline" className="w-full" iconName="Settings" iconPosition="left">
              Account Settings
            </Button>
            <Button variant="outline" className="w-full" iconName="Shield" iconPosition="left">
              Privacy & Safety
            </Button>
            <Button variant="destructive" className="w-full" iconName="LogOut" iconPosition="left">
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;