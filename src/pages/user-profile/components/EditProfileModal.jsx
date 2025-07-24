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
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, avatar: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addStyleTag = () => {
    const trimmed = newTag.trim();
    if (trimmed && !formData.styleTags.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        styleTags: [...prev.styleTags, trimmed],
      }));
      setNewTag('');
    }
  };

  const removeStyleTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      styleTags: prev.styleTags.filter(tag => tag !== tagToRemove),
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
      <div className="w-full max-w-2xl h-[90vh] bg-background rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-border bg-card sticky top-0 z-10">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={22} />
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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <div className="w-28 h-28 rounded-full overflow-hidden bg-muted cursor-pointer" onClick={handleAvatarClick}>
                <Image src={formData.avatar} alt="avatar" className="w-full h-full object-cover" />
              </div>
              <div
                onClick={handleAvatarClick}
                className="absolute bottom-0 right-0 w-9 h-9 bg-primary text-primary-foreground rounded-full flex items-center justify-center border-2 border-background shadow-lg group-hover:scale-105 transition-transform"
              >
                <Icon name="Camera" size={16} />
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
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
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter your full name"
              required
            />
            <Input
              label="Username"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              placeholder="@username"
              required
            />
            <div>
              <label className="block text-sm font-medium mb-2">Bio</label>
              <textarea
                rows={4}
                value={formData.bio}
                maxLength={150}
                onChange={(e) => handleInputChange('bio', e.target.value)}
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
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="City, Country"
            />
          </div>

          {/* Style Tags */}
          <div>
            <label className="block text-sm font-medium mb-2">Style Tags</label>
            <div className="flex items-center gap-2 mb-3">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addStyleTag()}
                placeholder="Add tag e.g. streetwear"
                className="flex-1 bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground"
              />
              <Button variant="outline" onClick={addStyleTag} disabled={!newTag.trim()}>
                Add
              </Button>
            </div>
            {formData.styleTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.styleTags.map((tag, idx) => (
                  <div
                    key={idx}
                    className="flex items-center space-x-2 px-3 py-1 rounded-full text-sm bg-primary/10 text-primary border border-primary/20"
                  >
                    <span>#{tag}</span>
                    <button
                      onClick={() => removeStyleTag(tag)}
                      className="hover:text-primary/70 transition"
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
  );
};

export default EditProfileModal;
