import React, { useState } from "react";
import { db } from "../../../../firebase";
import { collection, addDoc } from "firebase/firestore";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { useAuth } from "../../../context/AuthContext";

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const NewPost = ({ onClose }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    brand: "",
    brandLogo: "",
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

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileBase64 = async (file, field, multiple = false) => {
    try {
      const base64 = await toBase64(file);
      setFormData((prev) => ({
        ...prev,
        [field]: multiple ? [...prev[field], base64] : base64,
      }));
    } catch (err) {
      console.error("Base64 conversion failed:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "products"), {
        brand: formData.brand,
        brandLogo: formData.brandLogo,
        category: formData.category,
        comments: { text: [], video: [] },
        description: formData.description,
        designer: formData.designer,
        image: formData.image,
        extraImages: formData.extraImages,
        videos: formData.videos,
        likes: 0,
        name: formData.name,
        originalPrice: parseFloat(formData.originalPrice),
        price: parseFloat(formData.price),
        productlink: formData.productlink,
        tags: formData.tags.split(",").map((tag) => tag.trim()),
        createdAt: new Date(),
        createdBy: user?.uid || null,
        material: formData.material,
        care: formData.care,
        origin: formData.origin,
      });

      alert("Product posted successfully!");
      setFormData({
        brand: "",
        brandLogo: "",
        category: "",
        description: "",
        designer: "",
        image: "",
        extraImages: [],
        videos: [],
        name: "",
        originalPrice: "",
        price: "",
        productlink: "",
        tags: "",
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
              !formData.price.trim()
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
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <Icon name="Image" size={16} /> Brand Logo
            </label>

            {/* Clickable Camera Icon */}
            <div
              className="w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center rounded-full cursor-pointer hover:scale-105 transition"
              onClick={() => document.getElementById("brandLogoInput").click()}
            >
              <Icon name="Camera" size={18} />
            </div>

            {/* Hidden File Input */}
            <input
              id="brandLogoInput"
              type="file"
              accept="image/*"
              onChange={async (e) => {
                if (e.target.files[0]) {
                  const base64 = await toBase64(e.target.files[0]);
                  setFormData((prev) => ({
                    ...prev,
                    brandLogo: base64,
                  }));
                }
              }}
              className="hidden"
            />

            {/* Preview */}
            {formData.brandLogo && (
              <img
                src={formData.brandLogo}
                alt="Brand Logo Preview"
                className="mt-2 w-20 h-20 object-cover rounded-full border"
              />
            )}
          </div>

          <Input
            label="Category"
            value={formData.category}
            onChange={(e) => handleChange("category", e.target.value)}
            required
          />

          {/* Main Image Upload */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <Icon name="Image" size={16} /> Main Product Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                e.target.files[0] &&
                handleFileBase64(e.target.files[0], "image")
              }
              className="block w-full text-sm text-muted-foreground"
            />
            {formData.image && (
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
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) =>
                Array.from(e.target.files).forEach((file) =>
                  handleFileBase64(file, "extraImages", true)
                )
              }
              className="block w-full text-sm text-muted-foreground"
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
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <Icon name="Video" size={16} /> Product Videos
            </label>
            <input
              type="file"
              accept="video/*"
              multiple
              onChange={(e) =>
                Array.from(e.target.files).forEach((file) =>
                  handleFileBase64(file, "videos", true)
                )
              }
              className="block w-full text-sm text-muted-foreground"
            />
            <div className="flex gap-2 mt-2 flex-wrap">
              {formData.videos.map((vid, i) => (
                <video
                  key={i}
                  src={vid}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-28 h-28 object-cover rounded-lg"
                />
              ))}
            </div>
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
              className="w-full bg-input border border-border rounded-lg p-3 text-foreground placeholder-muted-foreground resize-none"
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
              className="w-full bg-input border border-border rounded-lg p-3 text-foreground placeholder-muted-foreground"
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
              className="w-full bg-input border border-border rounded-lg p-3 text-foreground placeholder-muted-foreground mb-4"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPost;
