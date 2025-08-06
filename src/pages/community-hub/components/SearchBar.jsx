import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const SearchBar = ({ onSearch, placeholder = "Search opportunities, brands..." }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value); // Real-time search
  };

  const handleClear = () => {
    setSearchQuery('');
    onSearch('');
    setIsExpanded(false);
  };

  const handleFocus = () => {
    setIsExpanded(true);
  };

  const handleBlur = () => {
    if (!searchQuery) {
      setIsExpanded(false);
    }
  };

  return (
    <div className={`
      relative animation-spring
      ${isExpanded ? 'w-full' : 'w-full'}
    `}>
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Icon 
            name="Search" 
            size={20} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
          />
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            className="
              w-full pl-10 pr-10 py-3 bg-muted/20 border border-border rounded-xl
              text-muted-foreground placeholder-muted-foreground
              focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
              animation-spring
            "
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground animation-spring"
            >
              <Icon name="X" size={16} />
            </button>
          )}
        </div>
      </form>

      {/* Search Suggestions */}
      {isExpanded && searchQuery && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg z-50 animate-fade-in">
          <div className="p-3">
            <div className="text-xs text-muted-foreground mb-2">Popular searches</div>
            <div className="space-y-1">
              {['Fashion photography', 'Brand ambassador', 'Content creation', 'Model casting'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setSearchQuery(suggestion);
                    onSearch(suggestion);
                    setIsExpanded(false);
                  }}
                  className="w-full text-left px-2 py-1 text-sm text-foreground hover:bg-muted/50 rounded animation-spring"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;