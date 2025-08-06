import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const OpportunityCard = ({ opportunity, onBookmark, onApply }) => {
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(opportunity.isBookmarked || false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleBookmark = (e) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    onBookmark?.(opportunity.id, !isBookmarked);
  };

  const handleApply = (e) => {
    e.stopPropagation();
    onApply?.(opportunity);
  };

  const handleCardClick = () => {
    setIsExpanded(!isExpanded);
  };

  const getUrgencyColor = (daysLeft) => {
    if (daysLeft <= 1) return 'text-error';
    if (daysLeft <= 3) return 'text-warning';
    return 'text-muted-foreground';
  };

  const formatDeadline = (deadline) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Expired';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day left';
    return `${diffDays} days left`;
  };

  return (
    <div 
      className={`
        bg-card border border-border rounded-xl overflow-hidden cursor-pointer
        animation-spring hover:border-primary/30 hover:shadow-lg
        ${opportunity.isTrending ? 'ring-2 ring-primary/20 shadow-glow' : ''}
      `}
      onClick={handleCardClick}
    >
      {/* Header Image */}
      <div className="relative aspect-video bg-muted/20 overflow-hidden">
        <Image
          src={opportunity.headerImage}
          alt={opportunity.title}
          className="w-full h-full object-cover"
        />
        
        {/* Trending Badge */}
        {opportunity.isTrending && (
          <div className="absolute top-3 left-3 bg-primary/90 backdrop-blur-xs text-primary-foreground px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
            <Icon name="TrendingUp" size={12} />
            <span>Trending</span>
          </div>
        )}

        {/* Bookmark Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBookmark}
          className={`
            absolute top-3 right-3 backdrop-blur-xs
            ${isBookmarked 
              ? 'bg-warning/90 text-warning-foreground' 
              : 'bg-black/20 text-white hover:bg-black/40'
            }
          `}
        >
          <Icon name={isBookmarked ? 'Bookmark' : 'BookmarkPlus'} size={16} />
        </Button>

        {/* Type Badge */}
        <div className={`absolute bottom-3 left-3 px-2 py-1 rounded-full text-xs border bg-black/60 font-bold `}>
          {opportunity.type}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Brand Info */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-muted rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={opportunity.brandLogo}
              alt={opportunity.brandName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{opportunity.title}</h3>
            <p className="text-sm text-muted-foreground">{opportunity.brandName}</p>
          </div>
        </div>

        {/* Compensation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="DollarSign" size={16} className="text-accent" />
            <span className="font-semibold text-foreground font-mono">{opportunity.compensation}</span>
          </div>
          <div className={`text-sm font-medium ${getUrgencyColor(Math.ceil((new Date(opportunity.deadline) - new Date()) / (1000 * 60 * 60 * 24)))}`}>
            {formatDeadline(opportunity.deadline)}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Icon name="Users" size={14} />
              <span className="font-mono">{opportunity.applicants}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="MapPin" size={14} />
            <span>{opportunity.location}</span>
          </div>
        </div>

        {/* Requirements Preview */}
        <div className="flex flex-wrap gap-1">
          {opportunity.requirements.slice(0, 3).map((req, index) => (
            <span key={index} className="px-2 py-1 bg-muted/50 text-muted-foreground text-xs rounded-full">
              {req}
            </span>
          ))}
          {opportunity.requirements.length > 3 && (
            <span className="px-2 py-1 bg-muted/50 text-muted-foreground text-xs rounded-full">
              +{opportunity.requirements.length - 3} more
            </span>
          )}
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="space-y-3 pt-3 border-t border-border animate-fade-in">
            <div>
              <h4 className="font-medium text-foreground mb-2">Description</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {opportunity.description}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground mb-2">All Requirements</h4>
              <div className="flex flex-wrap gap-1">
                {opportunity.requirements.map((req, index) => (
                  <span key={index} className="px-2 py-1 bg-muted/50 text-muted-foreground text-xs rounded-full">
                    {req}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-foreground mb-2">Submission Guidelines</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {opportunity.guidelines.map((guideline, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <Icon name="Check" size={14} className="text-accent mt-0.5 flex-shrink-0" />
                    <span>{guideline}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Button
            variant="default"
            className="flex-1"
            onClick={handleApply}
          >
            Quick Apply
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OpportunityCard;