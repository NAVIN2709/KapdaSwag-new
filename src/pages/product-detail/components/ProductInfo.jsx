import React, { useState } from "react";
import Icon from "../../../components/AppIcon";


const ProductInfo = ({ product }) => {

  return (
    <div className="p-4 space-y-6">
      {/* Brand and Title */}
      <div>
        <p className="text-sm text-primary font-medium mb-1">{product.brand}</p>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {product.name}
        </h1>
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Icon
                key={star}
                name="Star"
                size={16}
                className={
                  star <= product.rating
                    ? "text-warning"
                    : "text-muted-foreground"
                }
                fill={star <= product.rating ? "currentColor" : "none"}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="flex items-center space-x-4">
        <span className="text-3xl font-bold text-foreground font-mono">
          ₹{product.price}
        </span>
        {product.originalPrice && product.originalPrice > product.price && (
          <>
            <span className="text-lg text-muted-foreground line-through font-mono">
              ₹{product.originalPrice}
            </span>
            <span className="bg-error text-error-foreground px-2 py-1 rounded-md text-sm font-medium">
              {Math.round(
                ((product.originalPrice - product.price) /
                  product.originalPrice) *
                  100
              )}
              % OFF
            </span>
          </>
        )}
      </div>

      {/* Community Stats */}
      <div className="flex items-center space-x-6 py-3 border-y border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Heart" size={16} className="text-error" />
          <span className="text-sm text-muted-foreground font-mono">
            {product.likes || 0}
          </span>
          <span className="text-xs text-muted-foreground">likes</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="MessageCircle" size={16} className="text-primary" />
          <span className="text-sm text-muted-foreground font-mono">
            {Array.isArray(product.comments?.text) ||
            Array.isArray(product.comments?.video)
              ? (product.comments?.text?.length || 0) +
                (product.comments?.video?.length || 0)
              : 0}
          </span>

          <span className="text-xs text-muted-foreground">comments</span>
        </div>
      </div>

      {/* Product Description */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3">
          Description
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          {product.description || "Not Mentioned"}
        </p>
      </div>

      {/* Product Details */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3">Details</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Material</span>
            <span className="text-foreground">
              {product.material || "Not Mentioned"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Care</span>
            <span className="text-foreground">
              {product.care || "Not Mentioned"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Origin</span>
            <span className="text-foreground">
              {product.origin || "Not Mentioned"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
