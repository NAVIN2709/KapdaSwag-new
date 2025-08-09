import React, { useState, useRef } from "react";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/AppIcon";
import { createNewEvent } from "functions/Userfunctions";
import { useNavigate } from "react-router-dom";
import { useAuth } from "context/AuthContext";

const NewEvent = () => {
  const {user}=useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    brandName: "",
    deadline: "",
    description: "",
    type: "Contest",
    reward: "",
    location: "Remote",
    guidelines: "",
    requirements: "",
    eventImage: "",
    brandLogo: "",
    hosted_by:user.uid
  });

  const [previewEvent, setPreviewEvent] = useState(null);
  const eventRef = useRef();
  const brandLogoRef = useRef();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewEvent(reader.result);
        setForm({ ...form, eventImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.deadline) {
      alert("Title and Deadline are required!");
      return;
    }

    setLoading(true);
    try {
      await createNewEvent(form);
      alert("✅ Event created successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Error creating event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-white">
      <div className="flex-1 overflow-y-auto px-4 pb-32 space-y-8">
        {/* Header */}
        <div className="pt-4">
          <h1 className="text-2xl font-bold">Create New Event</h1>
          <p className="text-sm text-muted-foreground">
            Fill out the details below to post your event.
          </p>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium mb-2">Event Image</label>
          <div
            className="w-full h-56 bg-white/10 rounded-2xl border border-white/20 
                       flex flex-col items-center justify-center cursor-pointer relative group overflow-hidden"
            onClick={() => eventRef.current.click()}
          >
            {previewEvent ? (
              <>
                <img
                  src={previewEvent}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <Icon name="Camera" size={28} className="text-white" />
                </div>
              </>
            ) : (
              <>
                <Icon name="Camera" size={32} className="text-white/80 mb-2" />
                <p className="text-sm text-white/70">
                  Tap to upload event image
                </p>
              </>
            )}
            <input
              type="file"
              ref={eventRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageSelect}
            />
          </div>
        </div>

        {/* Basic Info */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Event Title
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 bg-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Brand Name
              </label>
              <input
                type="text"
                name="brandName"
                value={form.brandName}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 bg-transparent"
              />
            </div>
            
            {/* Brand Logo Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Brand Logo
              </label>
              <div
                className="w-28 h-28 bg-white/10 rounded-full border border-white/20 
               flex flex-col items-center justify-center cursor-pointer relative group overflow-hidden"
                onClick={() => brandLogoRef.current.click()}
              >
                {form.brandLogo ? (
                  <>
                    <img
                      src={form.brandLogo}
                      alt="Brand Logo"
                      className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <Icon name="Camera" size={20} className="text-white" />
                    </div>
                  </>
                ) : (
                  <>
                    <Icon
                      name="Camera"
                      size={24}
                      className="text-white/80 mb-1"
                    />
                    <p className="text-xs text-white/70">Upload Logo</p>
                  </>
                )}
                <input
                  type="file"
                  ref={brandLogoRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setForm({ ...form, brandLogo: reader.result });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 bg-transparent"
              >
                <option value="Contest">Contest</option>
                <option value="Collaboration">Collaboration</option>
                <option value="Gig">Gig</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Deadline</label>
              <input
                type="date"
                name="deadline"
                value={form.deadline}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 bg-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Reward</label>
              <input
                type="text"
                name="reward"
                value={form.reward}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 bg-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 bg-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Event Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe the event..."
                className="w-full border rounded-lg px-3 py-2 bg-transparent"
              />
            </div>
          </div>
        </section>

        {/* Guidelines */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Guidelines</h2>
          <textarea
            name="guidelines"
            value={form.guidelines}
            onChange={handleChange}
            rows={4}
            placeholder="Write your guidelines..."
            className="w-full border rounded-lg px-3 py-2 bg-transparent"
          />
        </section>

        {/* Requirements */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Requirements</h2>
          <textarea
            name="requirements"
            value={form.requirements}
            onChange={handleChange}
            rows={4}
            placeholder="Write your requirements..."
            className="w-full border rounded-lg px-3 py-2 bg-transparent"
          />
        </section>

        {/* Submit */}
        <div className="pt-6">
          <Button
            onClick={handleSubmit}
            className="w-full bg-primary text-white rounded-xl py-3 font-bold shadow-lg shadow-primary/30 hover:scale-[1.01] transition"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Event"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewEvent;
