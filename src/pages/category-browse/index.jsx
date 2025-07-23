import React, { useState, useEffect, useCallback } from 'react';
import Header from '../../components/ui/Header';
import BottomNavigation from '../../components/ui/BottomNavigation';
import CategoryHeader from './components/CategoryHeader';
import CategoryTabs from './components/CategoryTabs';
import SearchBar from './components/SearchBar';
import ActiveFilters from './components/ActiveFilters';
import FilterPanel from './components/FilterPanel';
import SortModal from './components/SortModal';
import ProductGrid from './components/ProductGrid';

const CategoryBrowse = () => {
  const [selectedCategory, setSelectedCategory] = useState('tops');
  const [viewMode, setViewMode] = useState('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState('trending');
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [products, setProducts] = useState([]);
  
  const [filters, setFilters] = useState({
    priceRange: null,
    brands: [],
    sizes: [],
    colors: [],
    styleTags: [],
    minRating: 0
  });

  // Mock categories data
  const categories = [
    { id: 'tops', name: 'Tops', icon: 'Shirt', count: 1247 },
    { id: 'bottoms', name: 'Bottoms', icon: 'Zap', count: 892 },
    { id: 'dresses', name: 'Dresses', icon: 'Heart', count: 634 },
    { id: 'shoes', name: 'Shoes', icon: 'Footprints', count: 1156 },
    { id: 'accessories', name: 'Accessories', icon: 'Watch', count: 743 },
    { id: 'outerwear', name: 'Outerwear', icon: 'Coat', count: 421 }
  ];

  // Mock products data
  const mockProducts = [
    {
      id: 1,
      name: "Vintage Oversized Denim Jacket",
      brand: "Urban Threads",
      price: 89.99,
      originalPrice: 129.99,
      image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop",
      likes: 1247,
      boosts: 89,
      reviews: 156,
      rating: 4.8,
      isTrending: true,
      isLiked: false,
      isSaved: false,
      category: 'tops',
      tags: ['vintage', 'casual', 'streetwear'],
      colors: ['Blue'],
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      id: 2,
      name: "Floral Summer Midi Dress",
      brand: "Bloom & Co",
      price: 64.50,
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop",
      likes: 892,
      boosts: 67,
      reviews: 89,
      rating: 4.6,
      isTrending: false,
      isLiked: true,
      isSaved: false,
      category: 'dresses',
      tags: ['floral', 'summer', 'feminine'],
      colors: ['Pink', 'White'],
      sizes: ['XS', 'S', 'M', 'L']
    },
    {
      id: 3,
      name: "Classic White Sneakers",
      brand: "StepForward",
      price: 125.00,
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
      likes: 2156,
      boosts: 234,
      reviews: 445,
      rating: 4.9,
      isTrending: true,
      isLiked: false,
      isSaved: true,
      category: 'shoes',
      tags: ['classic', 'minimalist', 'casual'],
      colors: ['White'],
      sizes: ['6', '7', '8', '9', '10', '11']
    },
    {
      id: 4,
      name: "High-Waisted Black Jeans",
      brand: "Denim Dreams",
      price: 78.00,
      originalPrice: 98.00,
      image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=400&fit=crop",
      likes: 1534,
      boosts: 123,
      reviews: 267,
      rating: 4.7,
      isTrending: false,
      isLiked: false,
      isSaved: false,
      category: 'bottoms',
      tags: ['high-waisted', 'classic', 'versatile'],
      colors: ['Black'],
      sizes: ['24', '25', '26', '27', '28', '29', '30']
    },
    {
      id: 5,
      name: "Chunky Gold Chain Necklace",
      brand: "Luxe Accessories",
      price: 45.99,
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop",
      likes: 678,
      boosts: 45,
      reviews: 78,
      rating: 4.5,
      isTrending: false,
      isLiked: false,
      isSaved: false,
      category: 'accessories',
      tags: ['gold', 'statement', 'trendy'],
      colors: ['Gold'],
      sizes: ['One Size']
    },
    {
      id: 6,
      name: "Cropped Leather Jacket",
      brand: "Rebel Style",
      price: 189.99,
      originalPrice: 249.99,
      image: "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=400&h=400&fit=crop",
      likes: 945,
      boosts: 78,
      reviews: 134,
      rating: 4.6,
      isTrending: true,
      isLiked: true,
      isSaved: true,
      category: 'outerwear',
      tags: ['leather', 'edgy', 'cropped'],
      colors: ['Black'],
      sizes: ['XS', 'S', 'M', 'L']
    }
  ];

  // Filter products based on current filters and search
  const getFilteredProducts = useCallback(() => {
    let filtered = [...mockProducts];

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Price range filter
    if (filters.priceRange) {
      filtered = filtered.filter(product =>
        product.price >= filters.priceRange.min &&
        product.price <= filters.priceRange.max
      );
    }

    // Brand filter
    if (filters.brands.length > 0) {
      filtered = filtered.filter(product =>
        filters.brands.includes(product.brand)
      );
    }

    // Size filter
    if (filters.sizes.length > 0) {
      filtered = filtered.filter(product =>
        product.sizes.some(size => filters.sizes.includes(size))
      );
    }

    // Color filter
    if (filters.colors.length > 0) {
      filtered = filtered.filter(product =>
        product.colors.some(color => filters.colors.includes(color))
      );
    }

    // Style tags filter
    if (filters.styleTags.length > 0) {
      filtered = filtered.filter(product =>
        product.tags.some(tag => filters.styleTags.includes(tag))
      );
    }

    // Rating filter
    if (filters.minRating > 0) {
      filtered = filtered.filter(product =>
        product.rating >= filters.minRating
      );
    }

    // Sort products
    switch (selectedSort) {
      case 'newest':
        filtered.sort((a, b) => b.id - a.id);
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'boosts':
        filtered.sort((a, b) => b.boosts - a.boosts);
        break;
      case 'trending':
      default:
        filtered.sort((a, b) => {
          if (a.isTrending && !b.isTrending) return -1;
          if (!a.isTrending && b.isTrending) return 1;
          return b.likes - a.likes;
        });
        break;
    }

    return filtered;
  }, [selectedCategory, searchQuery, filters, selectedSort]);

  // Load products
  const loadProducts = useCallback(async () => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const filtered = getFilteredProducts();
    setProducts(filtered);
    setHasMore(false); // For demo, we're loading all at once
    setLoading(false);
  }, [getFilteredProducts]);

  // Load more products (for infinite scroll)
  const loadMoreProducts = useCallback(async () => {
    // In a real app, this would load the next page
    return Promise.resolve();
  }, []);

  // Effects
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Event handlers
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleRemoveFilter = (filterType, value) => {
    if (filterType === 'priceRange' || filterType === 'minRating') {
      setFilters(prev => ({
        ...prev,
        [filterType]: filterType === 'minRating' ? 0 : null
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [filterType]: prev[filterType].filter(item => item !== value)
      }));
    }
  };

  const handleClearAllFilters = () => {
    setFilters({
      priceRange: null,
      brands: [],
      sizes: [],
      colors: [],
      styleTags: [],
      minRating: 0
    });
    setSearchQuery('');
  };

  const getCurrentCategory = () => {
    return categories.find(cat => cat.id === selectedCategory) || categories[0];
  };

  const isMobile = window.innerWidth < 1024;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-16 pb-20">
        {/* Category Header */}
        <CategoryHeader
          selectedCategory={getCurrentCategory().name}
          productCount={products.length}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onFilterToggle={() => setIsFilterOpen(true)}
          onSortToggle={() => setIsSortOpen(true)}
        />

        {/* Category Navigation */}
        <CategoryTabs
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

        {/* Search Bar */}
        <SearchBar
          onSearch={handleSearch}
          placeholder={`Search in ${getCurrentCategory().name.toLowerCase()}...`}
        />

        {/* Active Filters */}
        <ActiveFilters
          filters={filters}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={handleClearAllFilters}
        />

        {/* Main Content */}
        <div className="flex">
          {/* Desktop Filter Sidebar */}
          {!isMobile && (
            <FilterPanel
              isOpen={true}
              onClose={() => {}}
              filters={filters}
              onFiltersChange={handleFiltersChange}
              isMobile={false}
            />
          )}

          {/* Product Grid */}
          <div className="flex-1">
            <ProductGrid
              products={products}
              viewMode={viewMode}
              loading={loading}
              hasMore={hasMore}
              onLoadMore={loadMoreProducts}
            />
          </div>
        </div>
      </div>

      {/* Mobile Filter Panel */}
      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        isMobile={isMobile}
      />

      {/* Sort Modal */}
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