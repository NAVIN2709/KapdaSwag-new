import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../../../../firebase'; // Adjust path to your firebase config
import { useAuth } from 'context/AuthContext';

const SearchBar = ({ onSearch, onUserSelect }) => {
  const {user}=useAuth();
  const [queryText, setQueryText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Close dropdown when clicking outside
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

  // Fetch matching users from Firestore
  const fetchUsers = async (searchTerm) => {
  try {
    setIsLoading(true);

    const usersRef = collection(db, 'users');

    const q = query(
      usersRef,
      where('username', '>=', searchTerm.toLowerCase()),
      where('username', '<=', searchTerm.toLowerCase() + '\uf8ff'),
      orderBy('username'),
      limit(10)
    );

    const snapshot = await getDocs(q);

    let users = snapshot.docs
      .filter((doc) => doc.id !== user.uid) // 👈 filter out current user
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

    const q2 = query(
      usersRef,
      where('name', '>=', searchTerm),
      where('name', '<=', searchTerm + '\uf8ff'),
      orderBy('name'),
      limit(10)
    );

    const snapshot2 = await getDocs(q2);

    snapshot2.docs.forEach((doc) => {
      if (doc.id !== user.uid && !users.some((u) => u.id === doc.id)) {
        users.push({ id: doc.id, ...doc.data() });
      }
    });

    setSuggestions(users);
    setShowSuggestions(true);
  } catch (error) {
    console.error('Error searching users:', error);
  } finally {
    setIsLoading(false);
  }
};


  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQueryText(value);

    if (value.trim().length > 0) {
      fetchUsers(value.trim());
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (queryText.trim()) {
      onSearch(queryText.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (user) => {
    setQueryText('');
    setShowSuggestions(false);
    onUserSelect(user);
  };

  const clearSearch = () => {
    setQueryText('');
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
            value={queryText}
            onChange={handleInputChange}
            onFocus={() => queryText && setShowSuggestions(true)}
            className="w-full pl-10 pr-10 py-3 bg-input border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          />
          {queryText && (
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
          className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto"
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
                  onClick={() => handleSuggestionClick(user.id)}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 text-left"
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                      <Image
                        src={user.avatar || user.profilePic || 'https://i.pravatar.cc/150'}
                        alt={user.username}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">@{user.username}</p>
                    <p className="text-sm text-muted-foreground truncate">{user.name}</p>
                  </div>
                  {user.followersCount && (
                    <div className="flex-shrink-0 text-right">
                      <p className="text-xs text-muted-foreground font-mono">{user.followersCount}</p>
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : queryText ? (
            <div className="p-6 text-center">
              <Icon name="Search" size={24} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No users found for "{queryText}"</p>
              <p className="text-sm text-muted-foreground mt-1">Try searching with a different username</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
