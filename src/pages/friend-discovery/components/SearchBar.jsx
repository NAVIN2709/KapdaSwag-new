import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const SearchBar = ({ onSearch, onUserSelect }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Mock suggestions data
  const mockSuggestions = [
    {
      id: 1,
      username: 'styleicon_maya',
      displayName: 'Maya Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      followers: '12.5K',
      isVerified: true,
      styleMatch: 94
    },
    {
      id: 2,
      username: 'vintage_vibes_alex',
      displayName: 'Alex Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      followers: '8.2K',
      isVerified: false,
      styleMatch: 87
    },
    {
      id: 3,
      username: 'minimalist_sam',
      displayName: 'Sam Taylor',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      followers: '15.1K',
      isVerified: true,
      styleMatch: 91
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.trim().length > 0) {
      setIsLoading(true);
      // Simulate API call delay
      setTimeout(() => {
        const filtered = mockSuggestions.filter(user => 
          user.username.toLowerCase().includes(value.toLowerCase()) ||
          user.displayName.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestions(filtered);
        setShowSuggestions(true);
        setIsLoading(false);
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (user) => {
    setQuery('');
    setShowSuggestions(false);
    onUserSelect(user);
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      {/* Search Input */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Icon 
            name="Search" 
            size={20} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
          />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search users by username or name..."
            value={query}
            onChange={handleInputChange}
            onFocus={() => query && setShowSuggestions(true)}
            className="w-full pl-10 pr-10 py-3 bg-input border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent animation-spring"
          />
          
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={clearSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <Icon name="X" size={16} />
            </Button>
          )}
        </div>
      </form>

      {/* Search Suggestions */}
      {showSuggestions && (
        <div 
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto animate-slide-down"
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : suggestions.length > 0 ? (
            <div className="p-2">
              {suggestions.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleSuggestionClick(user)}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 animation-spring text-left"
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                      <Image
                        src={user.avatar}
                        alt={user.username}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {user.isVerified && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                        <Icon name="Check" size={10} className="text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-foreground truncate">@{user.username}</p>
                      <div className="flex items-center space-x-1">
                        <Icon name="Sparkles" size={12} className="text-primary" />
                        <span className="text-xs text-primary font-medium">{user.styleMatch}%</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{user.displayName}</p>
                  </div>
                  
                  <div className="flex-shrink-0 text-right">
                    <p className="text-xs text-muted-foreground font-mono">{user.followers}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : query ? (
            <div className="p-6 text-center">
              <Icon name="Search" size={24} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No users found for "{query}"</p>
              <p className="text-sm text-muted-foreground mt-1">Try searching with a different username</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;