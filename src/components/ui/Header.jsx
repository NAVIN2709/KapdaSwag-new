import React, { useState } from "react";
import Icon from "../AppIcon";
import Button from "./Button";
import Notifications from "../ui/NotificationModal";
import { Import } from "lucide-react";
import LeaderBoardModal from "./LeaderBoardModal";

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const data = [
    {
      id: 1,
      username: "navin_swagger",
      avatar: "https://i.pravatar.cc/150?img=47",
      score: 1890,
    },
    {
      id: 2,
      username: "drip_goddess",
      avatar: "https://i.pravatar.cc/150?img=65",
      score: 1745,
    },
    {
      id: 3,
      username: "urban_legend",
      avatar: "https://i.pravatar.cc/150?img=33",
      score: 1680,
    },
    {
      id: 4,
      username: "trendsetter007",
      avatar: "https://i.pravatar.cc/150?img=28",
      score: 1595,
    },
    {
      id: 5,
      username: "aesthetic_boi",
      avatar: "https://i.pravatar.cc/150?img=15",
      score: 1530,
    },
    {
      id: 6,
      username: "vibe_chaser",
      avatar: "https://i.pravatar.cc/150?img=19",
      score: 1470,
    },
    {
      id: 7,
      username: "swag_machine",
      avatar: "https://i.pravatar.cc/150?img=38",
      score: 1410,
    },
    {
      id: 8,
      username: "sneakerheadx",
      avatar: "https://i.pravatar.cc/150?img=22",
      score: 1355,
    },
    {
      id: 9,
      username: "classy_queen",
      avatar: "https://i.pravatar.cc/150?img=44",
      score: 1290,
    },
    {
      id: 10,
      username: "fashion_nova",
      avatar: "https://i.pravatar.cc/150?img=59",
      score: 1235,
    },
  ];

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) setSearchQuery("");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Search query:", searchQuery);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-100 bg-background/95 backdrop-blur-sm border-b border-border safe-area-inset-top">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img src="/logo.png" className="h-14 w-14" />
            <div className="font-bold text-2xl">KapdaSwag</div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2">
            {/* Search Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSearchToggle}
              className="text-muted-foreground hover:text-foreground"
            >
              <Icon name="Search" size={20} />
            </Button>
            {/* Leaderboard Button */}
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => setIsLeaderboardOpen(true)}
            >
              <Icon name="Trophy" size={20} />
            </Button>

            {/* Notifications Button */}
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground relative"
              onClick={() => setIsNotificationsOpen(true)}
            >
              <Icon name="Bell" size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-warning rounded-full" />
            </Button>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-150 bg-background/80 backdrop-blur-sm animate-fade-in">
          <div className="absolute top-0 left-0 right-0 bg-background border-b border-border safe-area-inset-top animate-slide-up">
            <div className="flex items-center h-16 px-4">
              <form
                onSubmit={handleSearchSubmit}
                className="flex-1 flex items-center space-x-3"
              >
                <Icon
                  name="Search"
                  size={20}
                  className="text-muted-foreground"
                />
                <input
                  type="text"
                  placeholder="Search products, brands, or styles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-foreground placeholder-muted-foreground outline-none text-base"
                  autoFocus
                />
                {searchQuery && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setSearchQuery("")}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Icon name="X" size={16} />
                  </Button>
                )}
              </form>
              <Button
                variant="ghost"
                onClick={handleSearchToggle}
                className="ml-2 text-muted-foreground hover:text-foreground"
              >
                Cancel
              </Button>
            </div>

            {/* Suggestions */}
            {searchQuery && (
              <div className="px-4 pb-4">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground mb-2">
                    Popular searches
                  </div>
                  {[
                    "Vintage denim",
                    "Summer dresses",
                    "Sneakers",
                    "Accessories",
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => {
                        setSearchQuery(suggestion);
                        handleSearchSubmit({ preventDefault: () => {} });
                      }}
                      className="flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-muted/50 text-left animation-spring"
                    >
                      <Icon
                        name="TrendingUp"
                        size={16}
                        className="text-muted-foreground"
                      />
                      <span className="text-foreground">{suggestion}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notifications Modal */}
      {isNotificationsOpen && (
        <div className="fixed inset-0 z-150 bg-black/30 backdrop-blur-sm flex justify-center items-start pt-24 px-4">
          <div className="w-full max-w-md bg-white dark:bg-background border rounded-2xl shadow-lg p-4 relative">
            <button
              onClick={() => setIsNotificationsOpen(false)}
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
            >
              <Icon name="X" size={18} />
            </button>
            <Notifications />
          </div>
        </div>
      )}
      {/* Leaderboard Modal */}
      {isLeaderboardOpen && (
        <>
          <LeaderBoardModal data={data} />
          <button
            onClick={() => setIsLeaderboardOpen(false)}
            className="fixed top-28 right-6 z-[160] text-muted-foreground hover:text-foreground"
          >
            <Icon name="X" size={20} />
          </button>
        </>
      )}
    </>
  );
};

export default Header;
