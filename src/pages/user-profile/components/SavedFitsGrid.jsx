import React, { useState, useEffect } from "react";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { getProductData } from "functions/Userfunctions";
import { handleUnsaveProduct } from "functions/Userfunctions";
import { useAuth } from "context/AuthContext";

const SavedFitsGrid = ({
  products: productIds,
  onProductClick,
  onRemoveProduct,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loadedProducts, setLoadedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    productId: null,
  });

  // 🔹 Move fetchProducts OUTSIDE useEffect so it's reusable
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const fetched = await Promise.all(
        productIds.map(async (id) => {
          const data = await getProductData(id);
          return data ? { ...data, id } : null;
        })
      );
      setLoadedProducts(fetched.filter(Boolean));
    } catch (err) {
      console.error("❌ Error fetching saved products:", err);
    }
    setLoading(false);
  };

  // Fetch products when IDs change
  useEffect(() => {
    if (productIds?.length) {
      fetchProducts();
    } else {
      setLoadedProducts([]);
      setLoading(false);
    }
  }, [productIds]);

  const handleOpenProduct = async (product) => {
    try {
      const latestData = await getProductData(product.id);
      if (latestData) {
        onProductClick(latestData);
      } else {
        console.warn("⚠️ Product no longer exists");
      }
    } catch (err) {
      console.error("❌ Error loading product:", err);
    }
  };

const handleRemove = async (productId, e) => {
  e.stopPropagation();

  // 🚀 Optimistic UI update - remove from UI instantly
  setLoadedProducts((prev) => prev.filter((p) => p.id !== productId));
  onRemoveProduct(productId);

  // Show loading spinner while processing
  setLoading(true);

  try {
    setTimeout(async () => {
      // Call API to actually remove from backend
      await handleUnsaveProduct(user.uid, productId);

      // Fetch updated list from backend
      await fetchProducts();
    }, 2000); // 2 second delay
  } catch (err) {
    console.error("❌ Error removing saved product:", err);
  }
};

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Icon
          name="Loader2"
          size={24}
          className="animate-spin text-muted-foreground"
        />
      </div>
    );
  }

  if (loadedProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
          <Icon name="Bookmark" size={24} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No Saved Fits Yet
        </h3>
        <p className="text-muted-foreground mb-6 max-w-xs">
          Start swiping and save your favorite fashion finds to build your
          personal collection.
        </p>
        <Button
          variant="default"
          iconName="Zap"
          iconPosition="left"
          onClick={() => navigate("/")}
        >
          Discover Fashion
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-4">
        {loadedProducts.map((product) => (
          <div
            key={product.id}
            onClick={() => handleOpenProduct(product)}
            className={`relative bg-card rounded-xl overflow-hidden border border-border cursor-pointer transition-all duration-200 ease-out hover:scale-[1.02] hover:shadow-lg ${
              removingId === product.id ? "opacity-50 scale-95" : ""
            }`}
          >
            {/* Product Image */}
            <div className="aspect-[3/4] bg-muted/20 relative overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {/* Remove Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmModal({ open: true, productId: product.id });
                }}
                disabled={removingId === product.id}
                className="absolute top-2 right-2 bg-black/50 backdrop-blur-xs text-white hover:bg-black/70"
              >
                {removingId === product.id ? (
                  <Icon name="Loader2" size={16} className="animate-spin" />
                ) : (
                  <Icon name="X" size={16} />
                )}
              </Button>

              {/* Price Badge */}
              <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-xs text-white px-2 py-1 rounded-lg">
                <span className="text-sm font-semibold font-mono">
                  ₹{product.price}
                </span>
              </div>

              {/* Like Count */}
              <div className="absolute bottom-2 right-2 flex items-center space-x-1 bg-black/70 backdrop-blur-xs text-white px-2 py-1 rounded-lg">
                <Icon name="Heart" size={12} className="text-error" />
                <span className="text-xs font-mono">{product.likes}</span>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-3">
              <h3 className="font-semibold text-foreground text-sm mb-1 truncate">
                {product.name}
              </h3>
              <p className="text-muted-foreground text-xs mb-2 truncate">
                {product.brand}
              </p>

              {/* Saved Date */}
              {product.savedDate && (
                <div className="flex items-center space-x-1">
                  <Icon
                    name="Clock"
                    size={12}
                    className="text-muted-foreground"
                  />
                  <span className="text-xs text-muted-foreground">
                    Saved {product.savedDate}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {confirmModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-card p-6 rounded-xl shadow-lg w-80">
            <h2 className="text-lg font-semibold mb-3 text-black">
              Remove Saved Product
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to remove this product from your saved fits?
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="ghost"
                onClick={() =>
                  setConfirmModal({ open: false, productId: null })
                }
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={async () => {
                  await handleRemove(confirmModal.productId, {
                    stopPropagation: () => {},
                  });
                  setConfirmModal({ open: false, productId: null });
                }}
              >
                Remove
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedFitsGrid;
