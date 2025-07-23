import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TrendingSection = ({ trendingOpportunities, onOpportunityClick }) => {
  if (!trendingOpportunities || trendingOpportunities.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Icon name="TrendingUp" size={20} className="text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Trending Now</h2>
      </div>

      <div className="flex space-x-3 overflow-x-scroll pb-2">
        {trendingOpportunities.map((opportunity) => (
          <div
            key={opportunity.id}
            onClick={() => onOpportunityClick(opportunity)}
            className="
              flex-shrink-0 w-64 bg-card border border-border rounded-xl overflow-hidden
              cursor-pointer animation-spring hover:border-primary/30 hover:shadow-lg
              ring-2 ring-primary/20 shadow-glow
            "
          >
            {/* Header */}
            <div className="relative aspect-video bg-muted/20 overflow-hidden">
              <Image
                src={opportunity.headerImage}
                alt={opportunity.title}
                className="w-full h-full object-cover"
              />
              
              {/* Trending Badge */}
              <div className="absolute top-2 left-2 bg-primary/90 backdrop-blur-xs text-primary-foreground px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                <Icon name="Flame" size={10} />
                <span>Hot</span>
              </div>

              {/* Type Badge */}
              <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-white px-2 py-1 rounded-full text-xs font-medium">
                {opportunity.type}
              </div>
            </div>

            {/* Content */}
            <div className="p-3 space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-muted rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={opportunity.brandLogo}
                    alt={opportunity.brandName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground text-sm truncate">{opportunity.title}</h3>
                  <p className="text-xs text-muted-foreground">{opportunity.brandName}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-accent font-mono">{opportunity.compensation}</span>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Icon name="Users" size={12} />
                  <span className="font-mono">{opportunity.applicants}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-warning font-medium">
                  {Math.ceil((new Date(opportunity.deadline) - new Date()) / (1000 * 60 * 60 * 24))} days left
                </span>
                <div className="flex items-center space-x-1 text-muted-foreground">
                  <Icon name="MapPin" size={10} />
                  <span>{opportunity.location}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingSection;