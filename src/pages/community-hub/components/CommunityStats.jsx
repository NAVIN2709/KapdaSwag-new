import React from 'react';
import Icon from '../../../components/AppIcon';

const CommunityStats = ({ stats }) => {
  const statItems = [
    {
      id: 'active_opportunities',
      label: 'Active Opportunities',
      value: stats.activeOpportunities || 0,
      icon: 'Briefcase',
      color: 'text-primary'
    },
    {
      id: 'total_brands',
      label: 'Partner Brands',
      value: stats.totalBrands || 0,
      icon: 'Building2',
      color: 'text-accent'
    },
    {
      id: 'successful_matches',
      label: 'Successful Matches',
      value: stats.successfulMatches || 0,
      icon: 'Handshake',
      color: 'text-success'
    },
    {
      id: 'community_members',
      label: 'Community Members',
      value: stats.communityMembers || 0,
      icon: 'Users',
      color: 'text-secondary'
    }
  ];

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="BarChart3" size={20} className="text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Community Stats</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {statItems.map((item) => (
          <div key={item.id} className="text-center space-y-2">
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full bg-muted/20 ${item.color}`}>
              <Icon name={item.icon} size={20} />
            </div>
            <div>
              <div className={`text-2xl font-bold font-mono ${item.color}`}>
                {formatNumber(item.value)}
              </div>
              <div className="text-xs text-muted-foreground">
                {item.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityStats;