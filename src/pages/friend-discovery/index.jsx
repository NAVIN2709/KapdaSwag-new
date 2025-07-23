import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import BottomNavigation from '../../components/ui/BottomNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import UserCard from './components/UserCard';
import FilterBar from './components/FilterBar';
import SearchBar from './components/SearchBar';
import ActivityFeed from './components/ActivityFeed';
import SuggestedUsers from './components/SuggestedUsers';

const FriendDiscovery = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('discover');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    style: 'all',
    location: 'global',
    activity: null
  });

  // Mock users data
  const mockUsers = [
    {
      id: 1,
      username: 'fashion_maven_alex',
      displayName: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      followers: '12.5K',
      likes: '45.2K',
      influence: '8.9K',
      styleMatch: 94,
      styleTags: ['streetwear', 'vintage', 'sneakers'],
      mutualConnections: 8,
      mutualAvatars: [
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50&h=50&fit=crop&crop=face'
      ],
      recentActivity: `Just shared a streetwear haul featuring vintage Nike pieces and got 2.1K likes in the first hour.`,
      isOnline: true,
      isFollowing: false
    },
    {
      id: 2,
      username: 'minimalist_maya',
      displayName: 'Maya Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      followers: '18.3K',
      likes: '67.8K',
      influence: '12.4K',
      styleMatch: 91,
      styleTags: ['minimalist', 'clean', 'modern'],
      mutualConnections: 12,
      mutualAvatars: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face'
      ],
      recentActivity: `Created a capsule wardrobe guide that's been saved by 5.2K users and featured in trending.`,
      isOnline: false,
      isFollowing: true
    },
    {
      id: 3,
      username: 'vintage_collector_zoe',displayName: 'Zoe Martinez',avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',followers: '24.7K',likes: '89.1K',influence: '15.6K',
      styleMatch: 88,
      styleTags: ['vintage', 'thrift', 'retro'],
      mutualConnections: 5,
      mutualAvatars: [
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50&h=50&fit=crop&crop=face'
      ],
      recentActivity: `Found an incredible 1970s leather jacket at a thrift store and the community is going wild over it.`,
      isOnline: true,
      isFollowing: false
    },
    {
      id: 4,
      username: 'boho_spirit_luna',displayName: 'Luna Thompson',avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',followers: '15.9K',likes: '52.3K',influence: '9.8K',
      styleMatch: 85,
      styleTags: ['boho', 'flowy', 'earthy'],
      mutualConnections: 3,
      mutualAvatars: [
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face'
      ],
      recentActivity: `Showcased a handmade jewelry collection that perfectly complements bohemian style aesthetics.`,
      isOnline: false,
      isFollowing: false
    },
    {
      id: 5,
      username: 'luxury_lifestyle_james',displayName: 'James Wilson',avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',followers: '31.2K',likes: '124.5K',influence: '22.1K',
      styleMatch: 82,
      styleTags: ['luxury', 'designer', 'formal'],
      mutualConnections: 15,
      mutualAvatars: [
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face','https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50&h=50&fit=crop&crop=face','https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face'
      ],
      recentActivity: `Reviewed the latest designer collection and provided styling tips for formal occasions.`,
      isOnline: true,
      isFollowing: false
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  const handleFilterChange = (filterId, category) => {
    if (category === 'reset') {
      setFilters({
        style: 'all',
        location: 'global',
        activity: null
      });
    } else {
      setFilters(prev => ({
        ...prev,
        [category]: filterId
      }));
    }
  };

  const handleSearch = (query) => {
    console.log('Searching for:', query);
    // Implement search logic
  };

  const handleUserSelect = (user) => {
    navigate('/user-profile', { state: { userId: user.id } });
  };

  const handleUserClick = (user) => {
    navigate('/user-profile', { state: { userId: user.id } });
  };

  const handleFollow = async (userId) => {
    console.log('Following user:', userId);
    // Implement follow logic
    return new Promise(resolve => setTimeout(resolve, 500));
  };

  const handleUnfollow = async (userId) => {
    console.log('Unfollowing user:', userId);
    // Implement unfollow logic
    return new Promise(resolve => setTimeout(resolve, 500));
  };

  const filteredUsers = users.filter(user => {
    if (filters.style !== 'all' && !user.styleTags.includes(filters.style)) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-2">Discover Friends</h1>
            <p className="text-muted-foreground">
              Connect with fashion enthusiasts who share your style and interests
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <SearchBar onSearch={handleSearch} onUserSelect={handleUserSelect} />
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-6 bg-muted/20 rounded-lg p-1">
            {[
              { id: 'discover', label: 'Discover', icon: 'Compass' },
              { id: 'suggested', label: 'Suggested', icon: 'Sparkles' },
              { id: 'activity', label: 'Activity', icon: 'Bell' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md animation-spring
                  ${activeTab === tab.id 
                    ? 'bg-background text-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                <Icon name={tab.icon} size={16} />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content based on active tab */}
          {activeTab === 'discover' && (
            <div className="space-y-6">
              {/* Filter Bar */}
              <FilterBar onFilterChange={handleFilterChange} activeFilters={filters} />

              {/* Users Grid */}
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Horizontal Scrollable User Cards */}
                  <div className="overflow-x-auto pb-4">
                    <div className="flex space-x-4" style={{ width: 'max-content' }}>
                      {filteredUsers.map((user) => (
                        <UserCard
                          key={user.id}
                          user={user}
                          onFollow={handleFollow}
                          onUnfollow={handleUnfollow}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Load More */}
                  <div className="text-center">
                    <Button variant="outline" size="lg">
                      Load More Users
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'suggested' && (
            <div className="max-w-2xl mx-auto">
              <SuggestedUsers onUserClick={handleUserClick} onFollow={handleFollow} />
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="max-w-2xl mx-auto">
              <ActivityFeed onUserClick={handleUserClick} />
            </div>
          )}
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default FriendDiscovery;