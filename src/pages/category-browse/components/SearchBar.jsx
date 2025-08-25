import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SearchBar = ({ onSearch, placeholder = "Search products..." }) => {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [suggestions] = useState([
    'Vintage denim jacket',
    'Summer floral dress',
    'White sneakers',
    'Black leather boots',
    'Oversized hoodie',
    'High waisted jeans'
  ]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleSearch = (searchQuery = query) => {
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setIsExpanded(false);
      setQuery('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // ✅ Prevent default form submission
    e.stopPropagation(); // ✅ Stop event bubbling
    handleSearch();
    return false; // ✅ Additional prevention
  };

  const handleSuggestionClick = (suggestion) => {
    handleSearch(suggestion);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  if (!isExpanded) {
    return (
      <div className="px-4 py-3">
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full flex items-center space-x-3 p-3 bg-muted/30 rounded-xl text-left animation-spring hover:bg-muted/50"
        >
          <Icon name="Search" size={20} className="text-muted-foreground" />
          <span className="text-muted-foreground">{placeholder}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 py-3 border-b border-border">
      <form onSubmit={handleSubmit} className="relative" noValidate>
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Icon 
              name="Search" 
              size={20} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="w-full pl-10 pr-10 py-3 bg-muted/30 border border-border rounded-xl text-black placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent animation-spring"
            />
            {query && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleClear}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 text-muted-foreground hover:text-foreground"
              >
                <Icon name="X" size={16} />
              </Button>
            )}
          </div>
          
          <Button
            type="button"
            variant="ghost"
            onClick={() => setIsExpanded(false)}
            className="text-muted-foreground hover:text-foreground"
          >
            Cancel
          </Button>
        </div>

        {/* Search Suggestions */}
        {query.length === 0 && (
          <div className="mt-3 space-y-2">
            <div className="text-sm text-muted-foreground mb-2">Popular searches</div>
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-muted/30 text-left animation-spring"
              >
                <Icon name="TrendingUp" size={16} className="text-muted-foreground" />
                <span className="text-foreground">{suggestion}</span>
              </button>
            ))}
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar;