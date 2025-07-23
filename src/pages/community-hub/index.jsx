import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../components/AppIcon";
import Header from "../../components/ui/Header";
import BottomNavigation from "../../components/ui/BottomNavigation";
import Button from "../../components/ui/Button";
import OpportunityCard from "./components/OpportunityCard";
import FilterTabs from "./components/FilterTabs";
import FilterChips from "./components/FilterChips";
import SearchBar from "./components/SearchBar";
import TrendingSection from "./components/TrendingSection";

const CommunityHub = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Mock data
  const mockOpportunities = [
    {
      id: 1,
      title: "Summer Collection Campaign",
      brandName: "Urban Threads",
      brandLogo:
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=center",
      headerImage:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
      type: "Collaboration",
      compensation: "$2,500",
      deadline: "2025-08-15",
      location: "Remote",
      applicants: 127,
      views: 1543,
      isTrending: true,
      isBookmarked: false,
      requirements: [
        "Fashion Photography",
        "Instagram 10K+",
        "Portfolio Required",
      ],
      description: `Join Urban Threads for an exciting summer collection campaign. We're looking for creative content creators to showcase our latest sustainable fashion line through authentic storytelling and stunning visuals.`,
      guidelines: [
        "Submit 3-5 sample photos showcasing your style",
        "Include engagement metrics from recent posts",
        "Provide a brief creative concept proposal",
        "Must be available for 2-week campaign period",
      ],
    },
    {
      id: 2,
      title: "Sustainable Fashion Design Contest",
      brandName: "EcoStyle",
      brandLogo:
        "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=100&h=100&fit=crop&crop=center",
      headerImage:
        "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&h=300&fit=crop",
      type: "Contest",
      compensation: "$5,000",
      deadline: "2025-08-01",
      location: "Global",
      applicants: 89,
      views: 2156,
      isTrending: true,
      isBookmarked: true,
      requirements: [
        "Design Experience",
        "Sustainability Focus",
        "Original Concepts",
      ],
      description: `Design the future of sustainable fashion! Create innovative eco-friendly clothing designs that combine style with environmental consciousness.`,
      guidelines: [
        "Submit original design sketches or digital mockups",
        "Include sustainability statement and material choices",
        "Designs must be production-ready",
        "Winner receives mentorship and production support",
      ],
    },
    {
      id: 3,
      title: "Brand Ambassador Program",
      brandName: "StyleCo",
      brandLogo:
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100&h=100&fit=crop&crop=center",
      headerImage:
        "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop",
      type: "Gig",
      compensation: "$800/month",
      deadline: "2025-07-30",
      location: "US Only",
      applicants: 234,
      views: 3421,
      isTrending: false,
      isBookmarked: false,
      requirements: [
        "Social Media Presence",
        "Fashion Content",
        "Monthly Posts",
      ],
      description: `Become a StyleCo brand ambassador and represent our trendy fashion line across social media platforms with monthly content requirements.`,
      guidelines: [
        "Post 4 times per month featuring StyleCo products",
        "Maintain consistent brand aesthetic",
        "Engage with community and respond to comments",
        "Attend virtual brand events and training sessions",
      ],
    },
    {
      id: 4,
      title: "Model Casting Call",
      brandName: "Luxe Fashion",
      brandLogo:
        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=100&h=100&fit=crop&crop=center",
      headerImage:
        "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=300&fit=crop",
      type: "Collaboration",
      compensation: "$1,200",
      deadline: "2025-08-10",
      location: "New York",
      applicants: 156,
      views: 1876,
      isTrending: false,
      isBookmarked: false,
      requirements: ["Modeling Experience", "NYC Based", "Height 5'8\"+"],
      description: `Luxe Fashion is casting models for our upcoming fall runway show and lookbook photoshoot in New York City.`,
      guidelines: [
        "Submit professional headshots and full-body photos",
        "Include measurements and modeling experience",
        "Must be available for fittings and shoot dates",
        "Professional attitude and punctuality required",
      ],
    },
    {
      id: 5,
      title: "Content Creator Partnership",
      brandName: "TrendSet",
      brandLogo:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=center",
      headerImage:
        "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=300&fit=crop",
      type: "Collaboration",
      compensation: "$1,500",
      deadline: "2025-08-20",
      location: "Remote",
      applicants: 98,
      views: 1234,
      isTrending: false,
      isBookmarked: true,
      requirements: ["Video Content", "TikTok/Instagram", "Fashion Focus"],
      description: `Partner with TrendSet to create engaging video content showcasing our latest fashion collections across social media platforms.`,
      guidelines: [
        "Create 5 video posts featuring TrendSet products",
        "Include trending hashtags and music",
        "Maintain authentic personal style",
        "Provide analytics and engagement reports",
      ],
    },
  ];

  const tabs = [
    { id: "all", label: "All", count: mockOpportunities.length },
    {
      id: "contests",
      label: "Contests",
      count: mockOpportunities.filter((o) => o.type === "Contest").length,
    },
    {
      id: "collaborations",
      label: "Collabs",
      count: mockOpportunities.filter((o) => o.type === "Collaboration").length,
    },
    {
      id: "gigs",
      label: "Gigs",
      count: mockOpportunities.filter((o) => o.type === "Gig").length,
    },
  ];

  const filterOptions = [
    {
      id: "category",
      label: "Category",
      options: [
        { value: "modeling", label: "Modeling", count: 45 },
        { value: "content", label: "Content Creation", count: 67 },
        { value: "design", label: "Design", count: 23 },
        { value: "photography", label: "Photography", count: 34 },
      ],
    },
    {
      id: "compensation",
      label: "Compensation",
      options: [
        { value: "under-500", label: "Under $500", count: 12 },
        { value: "500-1500", label: "$500 - $1,500", count: 34 },
        { value: "1500-3000", label: "$1,500 - $3,000", count: 28 },
        { value: "over-3000", label: "Over $3,000", count: 15 },
      ],
    },
    {
      id: "location",
      label: "Location",
      options: [
        { value: "remote", label: "Remote", count: 56 },
        { value: "us", label: "United States", count: 23 },
        { value: "global", label: "Global", count: 34 },
        { value: "europe", label: "Europe", count: 12 },
      ],
    },
    {
      id: "deadline",
      label: "Deadline",
      options: [
        { value: "today", label: "Today", count: 3 },
        { value: "week", label: "This Week", count: 12 },
        { value: "month", label: "This Month", count: 45 },
        { value: "later", label: "Later", count: 23 },
      ],
    },
  ];

  const trendingOpportunities = mockOpportunities.filter((o) => o.isTrending);

  // Filter opportunities based on active tab and filters
  const filteredOpportunities = mockOpportunities.filter((opportunity) => {
    // Tab filter
    if (activeTab !== "all") {
      const tabType = activeTab.slice(0, -1); // Remove 's' from plural
      if (opportunity.type.toLowerCase() !== tabType) {
        return false;
      }
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        opportunity.title.toLowerCase().includes(query) ||
        opportunity.brandName.toLowerCase().includes(query) ||
        opportunity.type.toLowerCase().includes(query) ||
        opportunity.requirements.some((req) =>
          req.toLowerCase().includes(query)
        )
      );
    }

    return true;
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const handleBookmark = (opportunityId, isBookmarked) => {
    console.log(
      `${isBookmarked ? "Bookmarked" : "Unbookmarked"} opportunity:`,
      opportunityId
    );
  };

  const handleApply = (opportunity) => {
    console.log("Applying to opportunity:", opportunity);
    // Navigate to application page or show modal
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filterId, values) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterId]: values,
    }));
  };

  const handleClearAllFilters = () => {
    setActiveFilters({});
  };

  const handleOpportunityClick = (opportunity) => {
    console.log("Clicked opportunity:", opportunity);
    // Navigate to detailed view or expand
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-16 pb-20">
        {/* Hero Section */}
        <div className="sticky top-16 z-30 bg-background/90 backdrop-blur-md border-b border-border">
          <div className="px-4 py-6 bg-background/95">
            <div className="max-w-4xl mx-auto">
              <div className="text-center space-y-3">
                <h1 className="text-2xl font-bold text-foreground">
                  Community Hub
                </h1>
                <p className="text-muted-foreground">
                  Discover brand collaborations, contests, and creator
                  opportunities
                </p>
              </div>

              {/* Search Bar */}
              <div className="mt-6">
                <SearchBar onSearch={handleSearch} />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {/* Trending Section */}
          {trendingOpportunities.length > 0 && (
            <TrendingSection
              trendingOpportunities={trendingOpportunities}
              onOpportunityClick={handleOpportunityClick}
            />
          )}

          {/* Filter Tabs */}
          <div className="space-y-4 sticky top-[265px] z-10 bg-background/90 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <FilterTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                tabs={tabs}
              />

              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? "text-primary border-primary" : ""}
              >
                <Icon name="Filter" size={20} />
              </Button>
            </div>

            {/* Filter Chips */}
            {showFilters && (
              <div className="bg-card border border-border rounded-xl p-4 animate-fade-in">
                <FilterChips
                  filters={filterOptions}
                  activeFilters={activeFilters}
                  onFilterChange={handleFilterChange}
                  onClearAll={handleClearAllFilters}
                />
              </div>
            )}
          </div>

          {/* Pull to Refresh Indicator */}
          {isRefreshing && (
            <div className="flex items-center justify-center py-4">
              <div className="flex items-center space-x-2 text-primary">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm font-medium">
                  Refreshing opportunities...
                </span>
              </div>
            </div>
          )}

          {/* Opportunities Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                {activeTab === "all"
                  ? "All Opportunities"
                  : tabs.find((t) => t.id === activeTab)?.label}
                <span className="ml-2 text-sm text-muted-foreground font-mono">
                  ({filteredOpportunities.length})
                </span>
              </h2>

              <Button
                variant="ghost"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="text-muted-foreground hover:text-foreground"
              >
                <Icon
                  name="RefreshCw"
                  size={16}
                  className={isRefreshing ? "animate-spin" : ""}
                />
              </Button>
            </div>

            {filteredOpportunities.length > 0 ? (
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
            )}
          </div>

          {/* Load More */}
          {filteredOpportunities.length > 0 && (
            <div className="text-center pt-6">
              <Button variant="outline" className="w-full sm:w-auto">
                Load More Opportunities
              </Button>
            </div>
          )}
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default CommunityHub;
