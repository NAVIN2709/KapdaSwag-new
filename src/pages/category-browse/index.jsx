import React, { useState, useEffect, useCallback } from "react";
import Header from "../../components/ui/Header";
import BottomNavigation from "../../components/ui/BottomNavigation";
import CategoryHeader from "./components/CategoryHeader";
import CategoryTabs from "./components/CategoryTabs";
import SearchBar from "./components/SearchBar";
import ActiveFilters from "./components/ActiveFilters";
import FilterPanel from "./components/FilterPanel";
import SortModal from "./components/SortModal";
import ProductGrid from "./components/ProductGrid";
import { getProducts } from "functions/Userfunctions";

const CategoryBrowse = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSort, setSelectedSort] = useState("trending");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // 🔹 Keep full dataset

  const [filters, setFilters] = useState({
    priceRange: null,
    brands: [],
    sizes: [],
    colors: [],
    styleTags: [],
    minRating: 0,
  });

  const categories = [
  // General Category
  { id: "all", name: "All", icon: "Globe" },
  
  // Top Selling Categories (Based on Indian E-commerce Data)
  { id: "tshirts", name: "T-Shirts", icon: "Shirt" },        // #1 bestseller across all platforms
  { id: "jeans", name: "Jeans", icon: "Kanban" },            // #2 most searched & bought
  { id: "kurtas", name: "Kurtas", icon: "IndianRupee" },     // #3 ethnic wear leader
  
  // High-Volume Essentials
  { id: "shirts", name: "Shirts", icon: "Shirt" },           // Daily office wear essential
  { id: "hoodies", name: "Hoodies", icon: "Shirt" },         // Gen Z favorite, huge growth
  { id: "trousers", name: "Trousers", icon: "AlignVerticalJustifyCenter" },
  
  // Traditional Wear (Strong in Tier 2/3 cities)
  { id: "sarees", name: "Sarees", icon: "Flower2" },
  { id: "suits", name: "Suits", icon: "User" },              // Ethnic suits/salwar sets
  
  // Gen Z Trendy Categories
  { id: "cargo-pants", name: "Cargo Pants", icon: "Package" }, // Trending with Gen Z
  { id: "shorts", name: "Shorts", icon: "StretchHorizontal" },
  { id: "polo-shirts", name: "Polo Shirts", icon: "Shirt" },
  { id: "tank-tops", name: "Tank Tops", icon: "AlignHorizontalDistributeCenter" },
  
  // Athleisure & Comfort (Growing Category)
  { id: "tracksuits", name: "Tracksuits", icon: "Activity" },
  
  // Women's Specific
  { id: "skirts", name: "Skirts", icon: "Scissors" },
  
  // Seasonal Wear
  { id: "jackets", name: "Jackets", icon: "Shirt" },
  { id: "sweaters", name: "Sweaters", icon: "Snowflake" },
  { id: "cardigans", name: "Cardigans", icon: "Layers" },
  { id: "overcoats", name: "Overcoats", icon: "CloudRain" },
  
  // Professional Wear
  { id: "blazers", name: "Blazers", icon: "Briefcase" },
  
  // Additional Items
  { id: "accessories", name: "Accessories", icon: "Flower2" },
];

  // 🔹 Fetch products from Firestore/API
const fetchProducts = useCallback(async () => {
  setLoading(true);
  try {
    const data = await getProducts();
    setAllProducts(data);
    setHasMore(false);
  } catch (error) {
    console.error("❌ Error fetching products:", error);
  }
  setLoading(false);
}, []);


  // 🔹 Apply filters & search
  const getFilteredProducts = useCallback(() => {
    let filtered = [...allProducts];

    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }
if (searchQuery) {
  filtered = filtered.filter(
    (p) =>
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );
}
    if (filters.priceRange) {
      filtered = filtered.filter(
        (p) =>
          p.price >= filters.priceRange.min && p.price <= filters.priceRange.max
      );
    }
    if (filters.brands.length > 0) {
      filtered = filtered.filter((p) => filters.brands.includes(p.brand));
    }
    if (filters.sizes.length > 0) {
      filtered = filtered.filter(
        (p) => p.sizes && p.sizes.some((size) => filters.sizes.includes(size))
      );
    }
    if (filters.colors.length > 0) {
      filtered = filtered.filter(
        (p) =>
          p.colors && p.colors.some((color) => filters.colors.includes(color))
      );
    }
    if (filters.styleTags.length > 0) {
      filtered = filtered.filter(
        (p) => p.tags && p.tags.some((tag) => filters.styleTags.includes(tag))
      );
    }
    if (filters.minRating > 0) {
      filtered = filtered.filter((p) => p.rating >= filters.minRating);
    }

    // Sorting
    switch (selectedSort) {
      case "newest":
        filtered.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "boosts":
        filtered.sort((a, b) => (b.boosts || 0) - (a.boosts || 0));
        break;
      case "trending":
      default:
        filtered.sort((a, b) => {
          if (a.isTrending && !b.isTrending) return -1;
          if (!a.isTrending && b.isTrending) return 1;
          return (b.likes || 0) - (a.likes || 0);
        });
        break;
    }

    return filtered;
  }, [allProducts, selectedCategory, searchQuery, filters, selectedSort]);

  // 🔹 Whenever products or filters change → update list
useEffect(() => {
  if (allProducts.length > 0) {
    setProducts(getFilteredProducts());
  }
}, [getFilteredProducts, allProducts.length]);


  // 🔹 Load products initially
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16 pb-20">
        <CategoryHeader
          selectedCategory={
            categories.find((cat) => cat.id === selectedCategory)?.name || "All"
          }
          productCount={products.length}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onFilterToggle={() => setIsFilterOpen(true)}
          onSortToggle={() => setIsSortOpen(true)}
        />

        <CategoryTabs
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <SearchBar
          onSearch={setSearchQuery}
          placeholder={`Search in ${selectedCategory}...`}
        />

        <ActiveFilters
          filters={filters}
          onRemoveFilter={(filterType, value) => {
            if (filterType === "priceRange" || filterType === "minRating") {
              setFilters((prev) => ({
                ...prev,
                [filterType]: filterType === "minRating" ? 0 : null,
              }));
            } else {
              setFilters((prev) => ({
                ...prev,
                [filterType]: prev[filterType].filter((item) => item !== value),
              }));
            }
          }}
          onClearAll={() => {
            setFilters({
              priceRange: null,
              brands: [],
              sizes: [],
              colors: [],
              styleTags: [],
              minRating: 0,
            });
            setSearchQuery("");
          }}
        />

        <div className="flex">
          {window.innerWidth >= 1024 && (
            <FilterPanel
              isOpen={true}
              onClose={() => {}}
              filters={filters}
              onFiltersChange={setFilters}
              isMobile={false}
            />
          )}

          <div className="flex-1">
            <ProductGrid
              products={products}
              viewMode={viewMode}
              loading={loading}
              hasMore={hasMore}
              onLoadMore={() => {}}
            />
          </div>
        </div>
      </div>

      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
        isMobile={window.innerWidth < 1024}
      />

      <SortModal
        isOpen={isSortOpen}
        onClose={() => setIsSortOpen(false)}
        selectedSort={selectedSort}
        onSortChange={setSelectedSort}
      />

      <BottomNavigation />
    </div>
  );
};

export default CategoryBrowse;
