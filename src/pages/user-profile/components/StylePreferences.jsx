import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const StylePreferences = ({ preferences, onUpdatePreferences, isOwnProfile }) => {
  const [editMode, setEditMode] = useState(false);
  const [tempPreferences, setTempPreferences] = useState(preferences);

  const styleCategories = [
    { id: 'casual', name: 'Casual', icon: 'Shirt' },
    { id: 'formal', name: 'Formal', icon: 'Crown' },
    { id: 'streetwear', name: 'Streetwear', icon: 'Zap' },
    { id: 'vintage', name: 'Vintage', icon: 'Clock' },
    { id: 'minimalist', name: 'Minimalist', icon: 'Minus' },
    { id: 'bohemian', name: 'Bohemian', icon: 'Flower' },
    { id: 'athletic', name: 'Athletic', icon: 'Activity' },
    { id: 'gothic', name: 'Gothic', icon: 'Moon' }
  ];

  const colorPalettes = [
    { id: 'neutral', name: 'Neutral Tones', colors: ['#F5F5F5', '#D4D4D4', '#A3A3A3', '#525252'] },
    { id: 'earth', name: 'Earth Tones', colors: ['#8B4513', '#D2691E', '#CD853F', '#F4A460'] },
    { id: 'jewel', name: 'Jewel Tones', colors: ['#4B0082', '#008B8B', '#B22222', '#FF8C00'] },
    { id: 'pastel', name: 'Pastels', colors: ['#FFB6C1', '#E0E6FF', '#F0FFF0', '#FFF8DC'] },
    { id: 'monochrome', name: 'Monochrome', colors: ['#000000', '#FFFFFF', '#808080', '#C0C0C0'] },
    { id: 'vibrant', name: 'Vibrant', colors: ['#FF1493', '#00CED1', '#FFD700', '#32CD32'] }
  ];

  const handleSave = () => {
    onUpdatePreferences(tempPreferences);
    setEditMode(false);
  };

  const handleCancel = () => {
    setTempPreferences(preferences);
    setEditMode(false);
  };

  const toggleStyleCategory = (categoryId) => {
    setTempPreferences(prev => ({
      ...prev,
      styles: prev.styles.includes(categoryId)
        ? prev.styles.filter(id => id !== categoryId)
        : [...prev.styles, categoryId]
    }));
  };

  const selectColorPalette = (paletteId) => {
    setTempPreferences(prev => ({
      ...prev,
      colorPalette: paletteId
    }));
  };

  const updateSizeRange = (type, value) => {
    setTempPreferences(prev => ({
      ...prev,
      sizeRange: {
        ...prev.sizeRange,
        [type]: value
      }
    }));
  };

  const currentPrefs = editMode ? tempPreferences : preferences;

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Style Preferences</h2>
        {isOwnProfile && (
          <div className="flex space-x-2">
            {editMode ? (
              <>
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button variant="default" size="sm" onClick={handleSave}>
                  Save
                </Button>
              </>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                iconName="Edit" 
                iconPosition="left"
                onClick={() => setEditMode(true)}
              >
                Edit
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Style Categories */}
      <div>
        <h3 className="text-md font-medium text-foreground mb-3">Favorite Styles</h3>
        <div className="grid grid-cols-2 gap-3">
          {styleCategories.map((category) => {
            const isSelected = currentPrefs.styles.includes(category.id);
            return (
              <button
                key={category.id}
                onClick={() => editMode && toggleStyleCategory(category.id)}
                disabled={!editMode}
                className={`
                  flex items-center space-x-3 p-3 rounded-xl border animation-spring
                  ${isSelected
                    ? 'border-primary bg-primary/10 text-primary' :'border-border bg-card text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                  }
                  ${editMode ? 'cursor-pointer' : 'cursor-default'}
                `}
              >
                <Icon name={category.icon} size={20} />
                <span className="font-medium">{category.name}</span>
                {isSelected && (
                  <Icon name="Check" size={16} className="ml-auto" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Preferences */}
      <div>
        <h3 className="text-md font-medium text-foreground mb-3">Color Palette</h3>
        <div className="space-y-3">
          {colorPalettes.map((palette) => {
            const isSelected = currentPrefs.colorPalette === palette.id;
            return (
              <button
                key={palette.id}
                onClick={() => editMode && selectColorPalette(palette.id)}
                disabled={!editMode}
                className={`
                  w-full flex items-center space-x-3 p-3 rounded-xl border animation-spring
                  ${isSelected
                    ? 'border-primary bg-primary/10' :'border-border bg-card hover:border-muted-foreground'
                  }
                  ${editMode ? 'cursor-pointer' : 'cursor-default'}
                `}
              >
                <div className="flex space-x-1">
                  {palette.colors.map((color, index) => (
                    <div
                      key={index}
                      className="w-4 h-4 rounded-full border border-border"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <span className={`font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                  {palette.name}
                </span>
                {isSelected && (
                  <Icon name="Check" size={16} className="ml-auto text-primary" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Size Preferences */}
      <div>
        <h3 className="text-md font-medium text-foreground mb-3">Size Range</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-2">Tops</label>
            <select
              value={currentPrefs.sizeRange.tops}
              onChange={(e) => editMode && updateSizeRange('tops', e.target.value)}
              disabled={!editMode}
              className="w-full p-2 bg-input border border-border rounded-lg text-foreground"
            >
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-2">Bottoms</label>
            <select
              value={currentPrefs.sizeRange.bottoms}
              onChange={(e) => editMode && updateSizeRange('bottoms', e.target.value)}
              disabled={!editMode}
              className="w-full p-2 bg-input border border-border rounded-lg text-foreground"
            >
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
            </select>
          </div>
        </div>
      </div>

      {/* Budget Range */}
      <div>
        <h3 className="text-md font-medium text-foreground mb-3">Budget Range</h3>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Price Range</span>
            <span className="text-sm font-medium text-foreground font-mono">
              ${currentPrefs.budgetRange.min} - ${currentPrefs.budgetRange.max}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <input
                type="range"
                min="0"
                max="500"
                value={currentPrefs.budgetRange.min}
                onChange={(e) => editMode && updateSizeRange('budgetRange', {
                  ...currentPrefs.budgetRange,
                  min: parseInt(e.target.value)
                })}
                disabled={!editMode}
                className="w-full"
              />
            </div>
            <div className="flex-1">
              <input
                type="range"
                min="50"
                max="1000"
                value={currentPrefs.budgetRange.max}
                onChange={(e) => editMode && updateSizeRange('budgetRange', {
                  ...currentPrefs.budgetRange,
                  max: parseInt(e.target.value)
                })}
                disabled={!editMode}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Style Inspiration */}
      <div>
        <h3 className="text-md font-medium text-foreground mb-3">Style Inspiration</h3>
        <div className="grid grid-cols-3 gap-3">
          {currentPrefs.inspirations.map((inspiration, index) => (
            <div key={index} className="aspect-square bg-muted/20 rounded-xl overflow-hidden">
              <img
                src={inspiration.image}
                alt={inspiration.name}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StylePreferences;