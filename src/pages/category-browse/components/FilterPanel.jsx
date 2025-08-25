import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import { Checkbox } from "../../../components/ui/Checkbox";

const FilterPanel = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  isMobile = false,
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const priceRanges = [
    { id: "under-500", label: "Under ₹500", min: 0, max: 500 },
    { id: "500-700", label: "₹500 - ₹700", min: 500, max: 700 },
    { id: "700-1000", label: "₹700 - ₹1000", min: 700, max: 1000 },
    { id: "1000-1500", label: "₹1000 - ₹1500", min: 1000, max: 1500 },
    { id: "1500-2000", label: "₹1500 - ₹2000", min: 1500, max: 2000 },
    { id: "2000-2500", label: "₹2000 - ₹2500", min: 2000, max: 2500 },
    { id: "over-2500", label: "Over ₹2500", min: 2500, max: 999999 },
  ];

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    if (isMobile) onClose();
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      priceRange: null,
      sizes: [],
      styleTags: [],
      minRating: 0,
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const updateFilter = (key, value) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const toggleArrayFilter = (key, value) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((item) => item !== value)
        : [...prev[key], value],
    }));
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">Price Range</h3>
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <label
              key={range.id}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="radio"
                name="priceRange"
                checked={localFilters.priceRange?.id === range.id}
                onChange={() => updateFilter("priceRange", range)}
                className="w-4 h-4 text-primary border-border focus:ring-primary"
              />
              <span className="text-sm text-foreground">{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">Minimum Rating</h3>
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              onClick={() => updateFilter("minRating", rating)}
              className={`flex items-center space-x-1 px-2 py-1 rounded-lg animation-spring ${
                localFilters.minRating >= rating
                  ? "text-warning"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon
                name="Star"
                size={16}
                fill={
                  localFilters.minRating >= rating ? "currentColor" : "none"
                }
              />
              <span className="text-sm">{rating}+</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        {/* Mobile Overlay */}
        {isOpen && (
          <div className="fixed inset-0 z-200 bg-background/80 backdrop-blur-sm animate-fade-in">
            <div className="absolute bottom-0 left-0 right-0 bg-background border-t border-border rounded-t-2xl animate-slide-up max-h-[80vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-lg font-bold text-foreground">Filters</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Icon name="X" size={20} />
                </Button>
              </div>

              {/* Content */}
              <div className="p-4 overflow-y-auto max-h-[calc(80vh-120px)]">
                <FilterContent />
              </div>

              {/* Actions */}
              <div className="p-4 border-t border-border bg-background">
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={handleClearFilters}
                    className="flex-1"
                  >
                    Clear All
                  </Button>
                  <Button
                    variant="default"
                    onClick={handleApplyFilters}
                    className="flex-1"
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Desktop Sidebar
  return (
    <div className="w-80 bg-card/30 border-r border-border p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-foreground">Filters</h2>
        <Button
          variant="ghost"
          onClick={handleClearFilters}
          className="text-muted-foreground hover:text-foreground text-sm"
        >
          Clear All
        </Button>
      </div>

      <FilterContent />

      <div className="mt-6 pt-6 border-t border-border">
        <Button
          variant="default"
          onClick={handleApplyFilters}
          className="w-full"
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default FilterPanel;
