import React, { useState } from "react";
import { db } from "../../../../firebase";
import { collection, addDoc } from "firebase/firestore";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { useAuth } from "../../../context/AuthContext";
import axios from "axios";

const uploadFileAndGetUrl = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const res = await axios.post(
      "https://kapdaswag-upload.onrender.com/upload-products",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return res.data.url; // URL from backend
  } catch (error) {
    console.error("File upload failed:", error);
    throw error;
  }
};

const NewPost = ({ onClose, userdata }) => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState({
    brandLogo: false,
    image: false,
    extraImages: false,
    video: false,
  });
  const [formData, setFormData] = useState({
    brand: userdata?.name || "",
    brandLogo: userdata?.profilePic || "",
    category: "",
    description: "",
    designer: "",
    name: "",
    originalPrice: "",
    price: "",
    productlink: "",
    tags: "",
    image: "",
    extraImages: [],
    videos: [],
    material: "",
    care: "",
    origin: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const categories = [
  { id: "hoodies", name: "Hoodies", icon: "Shirt" }, // Hoodie (using Shirt icon)
  { id: "tshirts", name: "T-Shirts", icon: "Shirt" },
  { id: "shirts", name: "Shirts", icon: "Shirt" },
  { id: "jeans", name: "Jeans", icon: "Kanban" }, // no jeans icon, using Kanban-like folded
  { id: "trousers", name: "Trousers", icon: "AlignVerticalJustifyCenter" },
  { id: "shorts", name: "Shorts", icon: "StretchHorizontal" },
  { id: "skirts", name: "Skirts", icon: "Scissors" },
  { id: "jackets", name: "Jackets", icon: "Shirt" },
  { id: "sweaters", name: "Sweaters", icon: "Snowflake" },
  { id: "blazers", name: "Blazers", icon: "Briefcase" },
  { id: "suits", name: "Suits", icon: "User" },
  { id: "tracksuits", name: "Tracksuits", icon: "Activity" },
  { id: "polo-shirts", name: "Polo Shirts", icon: "Shirt" },
  { id: "tank-tops", name: "Tank Tops", icon: "AlignHorizontalDistributeCenter" },
  { id: "cargo-pants", name: "Cargo Pants", icon: "Package" },
  { id: "overcoats", name: "Overcoats", icon: "CloudRain" },
  { id: "cardigans", name: "Cardigans", icon: "Layers" },
  { id: "kurtas", name: "Kurtas", icon: "IndianRupee" }, 
  { id: "sarees", name: "Sarees", icon: "Flower2" },
  { id: "accessories", name: "Accessories", icon: "Flower2" },
];

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (file, field, multiple = false) => {
    try {
      setUploading((prev) => ({ ...prev, [field]: true })); // start loader
      const uploadedUrl = await uploadFileAndGetUrl(file);
      setFormData((prev) => ({
        ...prev,
        [field]: multiple ? [...prev[field], uploadedUrl] : uploadedUrl,
      }));
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed, please try again.");
    } finally {
      setUploading((prev) => ({ ...prev, [field]: false })); // stop loader
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "products"), {
        ...formData,
        comments: { text: [], video: [] },
        likes: 0,
        originalPrice: parseFloat(formData.originalPrice),
        price: parseFloat(formData.price),
        tags: formData.tags.split(",").map((tag) => tag.trim()),
        createdAt: new Date(),
        createdBy: user?.uid || null,
        brandLogo: formData.brandLogo,
      });

      alert("Product posted successfully!");
      setFormData({
        brand: userdata?.name || "",
        brandLogo: userdata?.profilePic || "",
        category: "",
        description: "",
        designer: "",
        image: "",
        extraImages: [],
        video: "",
        name: "",
        originalPrice: "",
        price: "",
        productlink: "",
        tags: "",
        material: "",
        care: "",
        origin: "",
      });
      onClose();
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="w-full max-w-2xl h-[90vh] bg-background rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-border bg-card sticky top-0 z-10">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={22} />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">
            Add New Product
          </h1>
          <Button
            variant="default"
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={
              !formData.brand.trim() ||
              !formData.name.trim() ||
              !formData.price.toString().trim()
            }
          >
            Post
          </Button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          <Input
            label="Brand Name"
            value={formData.brand}
            onChange={(e) => handleChange("brand", e.target.value)}
            required
          />

          {/* Brand Logo Upload */}
          {/* Brand Logo Upload */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <Icon name="Image" size={16} /> Brand Logo
            </label>
            {uploading.brandLogo ? (
              <p className="text-sm text-gray-500">Uploading...</p>
            ) : formData.brandLogo ? (
              <div className="flex items-center gap-2">
                <img
                  src={formData.brandLogo}
                  alt="Brand Logo"
                  className="h-16 w-16 rounded-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, brandLogo: null })}
                  className="px-2 py-1 text-sm bg-red-500 text-white rounded"
                >
                  Remove
                </button>
              </div>
            ) : (
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  e.target.files[0] &&
                  handleFileUpload(e.target.files[0], "brandLogo")
                }
              />
            )}
          </div>

          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            value={formData.category}
            onChange={(e) => handleChange("category", e.target.value)}
            required
            className="w-full rounded-lg border p-2 bg-transparent"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Main Product Image */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <Icon name="Image" size={16} /> Main Product Image
            </label>
            {uploading.image && (
              <p className="text-sm text-gray-500">Uploading...</p>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                e.target.files[0] &&
                handleFileUpload(e.target.files[0], "image")
              }
            />
            {formData.image && !uploading.image && (
              <img
                src={formData.image}
                alt="Preview"
                className="mt-2 w-28 h-28 object-cover rounded-lg"
              />
            )}
          </div>

          {/* Extra Images */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <Icon name="ImagePlus" size={16} /> Extra Images
            </label>
            {uploading.extraImages && (
              <p className="text-sm text-gray-500">Uploading...</p>
            )}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) =>
                Array.from(e.target.files).forEach((file) =>
                  handleFileUpload(file, "extraImages", true)
                )
              }
            />
            <div className="flex gap-2 mt-2 flex-wrap">
              {formData.extraImages.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>

          {/* Videos */}
          {/* Video */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <Icon name="Video" size={16} /> Product Video
            </label>
            {uploading.video && (
              <p className="text-sm text-gray-500">Uploading...</p>
            )}
            <input
              type="file"
              accept="video/*"
              onChange={
                (e) =>
                  e.target.files[0] &&
                  handleFileUpload(e.target.files[0], "video") // single video
              }
            />
            {formData.video && !uploading.video && (
              <video
                src={formData.video}
                controls
                className="mt-2 w-40 h-40 object-cover rounded-lg"
              />
            )}
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <Icon name="FileText" size={16} /> Description
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full bg-input border border-border rounded-lg p-3"
              placeholder="Enter product description..."
              required
            />
          </div>

          <Input
            label="Designer"
            value={formData.designer}
            onChange={(e) => handleChange("designer", e.target.value)}
          />
          <Input
            label="Product Name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
          />
          <Input
            label="Original Price"
            type="number"
            value={formData.originalPrice}
            onChange={(e) => handleChange("originalPrice", e.target.value)}
            required
          />
          <Input
            label="Sale Price"
            type="number"
            value={formData.price}
            onChange={(e) => handleChange("price", e.target.value)}
            required
          />

          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <Icon name="Link" size={16} /> Product Link
            </label>
            <input
              type="text"
              value={formData.productlink}
              onChange={(e) => handleChange("productlink", e.target.value)}
              className="w-full bg-input border border-border rounded-lg p-3"
            />
          </div>
          <Input
            label="Material"
            value={formData.material}
            onChange={(e) => handleChange("material", e.target.value)}
          />
          <Input
            label="Care Instructions"
            value={formData.care}
            onChange={(e) => handleChange("care", e.target.value)}
          />
          <Input
            label="Made In (Origin)"
            value={formData.origin}
            onChange={(e) => handleChange("origin", e.target.value)}
          />
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <Icon name="Tag" size={16} /> Tags (comma separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => handleChange("tags", e.target.value)}
              className="w-full bg-input border border-border rounded-lg p-3 mb-4"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPost;
