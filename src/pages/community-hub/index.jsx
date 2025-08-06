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
import { getEvents, joinEvent, getUserData } from "functions/Userfunctions";
import JoinedEvents from "./components/JoinedEvents";
import { useAuth } from "context/AuthContext";
import NewEvent from "./components/NewEvent";
import { User } from "lucide-react";

const CommunityHub = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isJoinedEventsOpen, setIsJoinedEventsOpen] = useState(false);
  const [isBrand, setIsBrand] = useState(false);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);

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

  // Fetch user data (check if brand)
  const fetchUserData = async () => {
    try {
      if (!user) return;
      const data = await getUserData(user.uid);
      setIsBrand(data?.isBrand || false);
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };

  useEffect(() => {
    fetchOpportunities();
    fetchUserData();
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

  const handleApply = async (opportunity) => {
    if (!user) {
      console.error("User not logged in");
      return;
    }
    const success = await joinEvent(opportunity.id, user.uid);
    if (success) {
      console.log(`✅ Joined event: ${opportunity.title}`);
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
                Discover brand collaborations, contests, and creator opportunities
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

          {/* Opportunities List */}
          {!loading && filteredOpportunities.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {filteredOpportunities.map((opportunity) => (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                  onApply={handleApply}
                  userId={user.uid}
                />
              ))}
            </div>
          ) : (
            !loading && (
              <div className="text-center py-12">
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

      {/* Joined Events Modal */}
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

      {/* Create New Event Modal */}
      {isCreateEventOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999] p-4">
          <div className="bg-background rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
            <button
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
              onClick={() => setIsCreateEventOpen(false)}
            >
              <Icon name="X" size={20} />
            </button>
            <NewEvent />
          </div>
        </div>
      )}

      {/* Floating Create Event Button for Brands */}
      {isBrand && (
        <button
          onClick={() => setIsCreateEventOpen(true)}
          className="fixed bottom-20 right-6 bg-primary text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition"
        >
          <Icon name="Plus" size={20} />
        </button>
      )}
    </div>
  );
};

export default CommunityHub;
