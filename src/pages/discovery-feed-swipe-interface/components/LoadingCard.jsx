import React from 'react';
import { motion } from 'framer-motion';

const LoadingCard = ({ delay = 0 }) => {
  return (
    <motion.div
      className="absolute inset-0 w-full h-full bg-muted/20 rounded-2xl overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3 }}
    >
      {/* Shimmer Effect */}
      <div className="relative w-full h-full">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
        
        {/* Skeleton Content */}
        <div className="absolute inset-0 p-6">
          {/* Top Section - Brand Logo */}
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-muted/40 rounded-full animate-pulse" />
            <div className="w-20 h-6 bg-muted/40 rounded-full animate-pulse" />
          </div>
          
          {/* Side Actions */}
          <div className="absolute right-6 top-1/2 transform -translate-y-1/2 space-y-3">
            <div className="w-12 h-12 bg-muted/40 rounded-full animate-pulse" />
            <div className="w-12 h-12 bg-muted/40 rounded-full animate-pulse" />
          </div>
          
          {/* Bottom Section - Product Info */}
          <div className="absolute bottom-6 left-6 right-6">
            {/* Stats */}
            <div className="flex space-x-4 mb-3">
              <div className="w-12 h-4 bg-muted/40 rounded animate-pulse" />
              <div className="w-12 h-4 bg-muted/40 rounded animate-pulse" />
              <div className="w-12 h-4 bg-muted/40 rounded animate-pulse" />
            </div>
            
            {/* Product Name */}
            <div className="w-3/4 h-6 bg-muted/40 rounded mb-2 animate-pulse" />
            <div className="w-1/2 h-4 bg-muted/40 rounded mb-3 animate-pulse" />
            
            {/* Price */}
            <div className="flex justify-between items-center">
              <div className="w-20 h-8 bg-muted/40 rounded animate-pulse" />
              <div className="w-16 h-6 bg-muted/40 rounded-full animate-pulse" />
            </div>
            
            {/* Tags */}
            <div className="flex space-x-2 mt-3">
              <div className="w-12 h-5 bg-muted/40 rounded-full animate-pulse" />
              <div className="w-16 h-5 bg-muted/40 rounded-full animate-pulse" />
              <div className="w-14 h-5 bg-muted/40 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingCard;