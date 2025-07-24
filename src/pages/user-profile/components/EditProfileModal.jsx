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
    location: user?.location || '',
    styleTags: user?.styleTags || [],
    avatar: user?.avatar || '',
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
    setTimeout(() => {
      onSave(formData);
      setIsLoading(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="w-full max-w-2xl h-[90vh] bg-white rounded-xl shadow-xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-border bg-white sticky top-0 z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-black"
          >
            <Icon name="X" size={24} />
          </Button>

          <h1 className="text-lg font-semibold text-black">Edit Profile</h1>

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
        <div className="flex-1 overflow-y-scroll p-4 space-y-6 text-black">
          {/* Avatar */}
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
                className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center border-2 border-white"
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

          {/* Form Inputs */}
          <div className="space-y-4">
            <Input
              label="Display Name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Your display name"
              required
              className='text-white'
            />

            <Input
              label="Username"
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              placeholder="@username"
              required
              className='text-white'
            />

            <div>
              <label className="block text-sm font-medium mb-2">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Tell the community about your style..."
                rows={4}
                maxLength={150}
                className="w-full p-3 bg-input border border-border rounded-lg text-white placeholder-muted-foreground resize-none"
              />
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-muted-foreground">
                  {formData.bio.length}/150 characters
                </span>
              </div>
            </div>

            <Input
              label="Location"
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="City, Country"
              className='text-white'
            />
          </div>

          {/* Style Tags */}
          <div>
            <label className="block text-sm font-medium mb-3">Style Tags</label>
            <div className="space-y-3">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a style tag..."
                  className="flex-1 p-2 bg-input border border-border rounded-lg text-white placeholder-muted-foreground"
                  onKeyDown={(e) => e.key === 'Enter' && addStyleTag()}
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
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
