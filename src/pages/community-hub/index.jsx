import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../components/AppIcon";
import Header from "../../components/ui/Header";
import BottomNavigation from "../../components/ui/BottomNavigation";
import Button from "../../components/ui/Button";
import OpportunityCard from "./components/OpportunityCard";
import FilterTabs from "./components/FilterTabs";
import SearchBar from "./components/SearchBar";
import TrendingSection from "./components/TrendingSection";
import { getEvents } from "functions/Userfunctions";
import JoinedEvents from "./components/JoinedEvents";
import { useAuth } from "context/AuthContext";
import { joinEvent } from "functions/Userfunctions";

const CommunityHub = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isJoinedEventsOpen, setIsJoinedEventsOpen] = useState(false); // NEW: modal state

  // Fetch events from API
  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const data = await getEvents();
      setOpportunities(data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const tabs = [
    { id: "all", label: "All", count: opportunities.length },
    {
      id: "contests",
      label: "Contests",
      count: opportunities.filter((o) => o.type === "Contest").length,
    },
    {
      id: "collaborations",
      label: "Collabs",
      count: opportunities.filter((o) => o.type === "Collaboration").length,
    },
    {
      id: "gigs",
      label: "Gigs",
      count: opportunities.filter((o) => o.type === "Gig").length,
    },
  ];

  const trendingOpportunities = opportunities.filter((o) => o.isTrending);

  const filteredOpportunities = opportunities.filter((opportunity) => {
    if (activeTab !== "all") {
      const tabType = activeTab.slice(0, -1);
      if (opportunity.type?.toLowerCase() !== tabType) return false;
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        opportunity.title?.toLowerCase().includes(query) ||
        opportunity.brandName?.toLowerCase().includes(query) ||
        opportunity.type?.toLowerCase().includes(query) ||
        (opportunity.requirements || []).some((req) =>
          req.toLowerCase().includes(query)
        )
      );
    }
    return true;
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchOpportunities();
    setIsRefreshing(false);
  };

  const handleBookmark = (opportunityId, isBookmarked) => {
    console.log(
      `${isBookmarked ? "Bookmarked" : "Unbookmarked"} opportunity:`,
      opportunityId
    );
  };

  const handleApply = async (opportunity) => {
    if (!user) {
      console.error("User not logged in");
      return;
    }

    const success = await joinEvent(opportunity.id, user.uid);
    if (success) {
      console.log(`✅ Joined event: ${opportunity.title}`);
      // Optional: show toast/snackbar
    } else {
      console.error("❌ Failed to join event");
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-16 pb-20">
        {/* Hero Section */}
        <div className="sticky top-16 z-30 bg-background/90 backdrop-blur-md border-b border-border">
          <div className="px-4 py-6 bg-background/95">
            <div className="max-w-4xl mx-auto text-center space-y-3">
              <h1 className="text-2xl font-bold text-foreground">
                Community Hub
              </h1>
              <p className="text-muted-foreground">
                Discover brand collaborations, contests, and creator
                opportunities
              </p>

              <div className="flex justify-center gap-3 mt-6">
                <SearchBar onSearch={handleSearch} />
                <Button
                  variant="default"
                  onClick={() => setIsJoinedEventsOpen(true)}
                >
                  <Icon name="Users" size={16} className="mr-1" />
                  Joined Events
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {/* Trending Section */}
          {trendingOpportunities.length > 0 && (
            <TrendingSection
              trendingOpportunities={trendingOpportunities}
              onOpportunityClick={(opp) => console.log("Clicked:", opp)}
            />
          )}

          {/* Filter Tabs */}
          <div className="space-y-4 sticky top-[265px] z-10 bg-background/90 backdrop-blur-md">
            <FilterTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              tabs={tabs}
            />
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center py-6 text-muted-foreground">
              Loading opportunities...
            </div>
          )}

          {/* Pull to Refresh */}
          {isRefreshing && (
            <div className="flex items-center justify-center py-4 text-primary space-x-2">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium">
                Refreshing opportunities...
              </span>
            </div>
          )}

          {/* Opportunities List */}
          {!loading && filteredOpportunities.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {filteredOpportunities.map((opportunity) => (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                  onBookmark={handleBookmark}
                  onApply={handleApply}
                />
              ))}
            </div>
          ) : (
            !loading && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon
                    name="Search"
                    size={24}
                    className="text-muted-foreground"
                  />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No opportunities found
                </h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search terms
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveFilters({});
                    setActiveTab("all");
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            )
          )}
        </div>
      </main>

      <BottomNavigation />

      {/* Modal */}
      {isJoinedEventsOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999] p-4">
          <div className="bg-background rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
            <button
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
              onClick={() => setIsJoinedEventsOpen(false)}
            >
              <Icon name="X" size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4">My Joined Events</h2>
            <JoinedEvents user={user.uid} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityHub;
