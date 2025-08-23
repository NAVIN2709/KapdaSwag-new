import React, { useEffect, useState } from "react";
import Icon from "../AppIcon";
import Image from "../AppImage";
import { useNavigate } from "react-router-dom";
import { getUserProducts } from "functions/Userfunctions";

const BrandProducts = ({ uid }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const userProducts = await getUserProducts(uid);
        setProducts(userProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    if (uid) fetchProducts();
  }, [uid]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <svg
          className="animate-spin h-6 w-6 mb-2 text-primary"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
        <p className="text-muted-foreground">Loading products...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No Products
        </h3>
        <p className="text-muted-foreground text-center mb-6">
          This creator hasn’t posted any products yet.
        </p>
      </div>
    );
  }

  return (
    <div className="p-2">
      <div className="grid grid-cols-2 gap-2">
        {products.map((product) => (
  <div
    key={product.id}
    className="rounded-xl overflow-hidden bg-[#0f172a] shadow-md border border-gray-800 max-w-xs"
    onClick={() =>
      navigate(`/product-detail/${product.id}`, { state: { product } })
    }
  >
    {/* Image */}
    <Image
      src={product.image}
      alt={product.name || product.productName}
      className="w-full aspect-square object-cover"
    />

    {/* Details */}
    <div className="p-3">
      {/* Product name + brand */}
      <p className="text-sm font-bold text-white">
        {product.name || product.productName}
      </p>
      <p className="text-xs text-gray-400">
        {product.brand || "Unknown Brand"}
      </p>

      {/* Bottom row: Price + Likes */}
      <div className="flex justify-between items-center mt-2">
        <p className="text-sm font-semibold text-white flex items-center">
          <Icon name="IndianRupee" className="mr-1" size={14} />
          {product.price || product.productPrice}
        </p>
        {product.likes !== undefined && (
          <p className="text-sm text-red-500 flex items-center">
            ❤️ {product.likes}
          </p>
        )}
      </div>
    </div>
  </div>
))}

      </div>
    </div>
  );
};

export default BrandProducts;
