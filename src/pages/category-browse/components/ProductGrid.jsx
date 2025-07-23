import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import Icon from '../../../components/AppIcon';

const ProductGrid = ({ 
  products, 
  viewMode, 
  loading, 
  hasMore, 
  onLoadMore 
}) => {
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 1000
        && hasMore && !loading && !isLoadingMore
      ) {
        setIsLoadingMore(true);
        onLoadMore().finally(() => setIsLoadingMore(false));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading, isLoadingMore, onLoadMore]);

  const getGridClasses = () => {
    if (viewMode === 'list') {
      return 'space-y-3';
    }
    return 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3';
  };

  const SkeletonCard = ({ viewMode }) => {
    if (viewMode === 'list') {
      return (
        <div className="flex space-x-3 p-3 bg-card/30 rounded-xl border border-border/30 animate-pulse">
          <div className="w-20 h-20 bg-muted/30 rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted/30 rounded w-3/4" />
            <div className="h-3 bg-muted/30 rounded w-1/2" />
            <div className="h-4 bg-muted/30 rounded w-1/4" />
          </div>
        </div>
      );
    }

    return (
      <div className="bg-card/30 rounded-xl border border-border/30 overflow-hidden animate-pulse">
        <div className="aspect-square bg-muted/30" />
        <div className="p-3 space-y-2">
          <div className="h-4 bg-muted/30 rounded w-3/4" />
          <div className="h-3 bg-muted/30 rounded w-1/2" />
          <div className="h-4 bg-muted/30 rounded w-1/3" />
        </div>
      </div>
    );
  };

  if (loading && products.length === 0) {
    return (
      <div className={`p-4 ${getGridClasses()}`}>
        {Array.from({ length: viewMode === 'list' ? 8 : 12 }).map((_, index) => (
          <SkeletonCard key={index} viewMode={viewMode} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mb-4">
          <Icon name="Search" size={24} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No products found</h3>
        <p className="text-muted-foreground text-center max-w-sm">
          Try adjusting your filters or search terms to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className={getGridClasses()}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            viewMode={viewMode}
          />
        ))}
      </div>

      {/* Load More Indicator */}
      {(isLoadingMore || (hasMore && !loading)) && (
        <div className="flex justify-center py-8">
          {isLoadingMore ? (
            <div className="flex items-center space-x-2 text-muted-foreground">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              <span>Loading more...</span>
            </div>
          ) : (
            <div className={`${getGridClasses()} w-full`}>
              {Array.from({ length: viewMode === 'list' ? 4 : 6 }).map((_, index) => (
                <SkeletonCard key={`skeleton-${index}`} viewMode={viewMode} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductGrid;