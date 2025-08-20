import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";
import { deleteEvent } from "functions/Userfunctions";

const OpportunityCard = ({ opportunity, onApply, userId, onDelete }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (opportunity?.participants?.includes(userId)) {
      setHasJoined(true);
    }
  }, [opportunity, userId]);

  const handleApply = async (e) => {
    e.stopPropagation();
    if (hasJoined || loading) return;

    try {
      setLoading(true);
      await onApply?.(opportunity);
      setHasJoined(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = () => {
    setIsExpanded(!isExpanded);
  };

  const getUrgencyColor = (daysLeft) => {
    if (daysLeft <= 1) return "text-error";
    if (daysLeft <= 3) return "text-warning";
    return "text-muted-foreground";
  };

  const formatDeadline = (deadline) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Expired";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day left";
    return `${diffDays} days left`;
  };

  const handleDelete = async (e) => {
    e.stopPropagation();

    const confirmed = window.confirm(
      "Are you sure you want to delete this event? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      await deleteEvent(opportunity.id, opportunity);
      onDelete?.(opportunity.id);
      alert("Event deleted successfully ✅");
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event ❌");
    }
  };

  return (
    <div
      className={`bg-card border border-border rounded-xl overflow-hidden cursor-pointer animation-spring hover:border-primary/30 hover:shadow-lg ${
        opportunity.isTrending ? "ring-2 ring-primary/20 shadow-glow" : ""
      }`}
      onClick={handleCardClick}
    >
      {/* Header Image */}
      <div className="relative aspect-video bg-muted/20 overflow-hidden">
        <Image
          src={opportunity.eventImage}
          alt={opportunity.title}
          className="w-full h-full object-cover"
        />

        {/* Trending Badge */}
        {opportunity.isTrending && (
          <div className="absolute top-3 left-3 bg-primary/90 text-primary-foreground px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
            <Icon name="TrendingUp" size={12} />
            <span>Trending</span>
          </div>
        )}
        {/* Delete button for host */}
        {opportunity.hosted_by === userId && (
          <button
            onClick={handleDelete}
            className="absolute top-3 right-3 bg-black/60 p-1 rounded-full hover:bg-black/80 transition"
          >
            <Icon name="Trash2" size={16} className="text-white" />
          </button>
        )}

        {/* Type Badge */}
        <div className="absolute bottom-3 left-3 px-2 py-1 rounded-full text-xs border bg-black/60 font-bold">
          {opportunity.type}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Brand Info */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-muted rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={opportunity.brandLogo}
              alt={opportunity.brandName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{opportunity.title}</h3>
            <p className="text-sm text-muted-foreground">
              {opportunity.brandName}
            </p>
          </div>
        </div>

        {/* Compensation & Deadline */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="IndianRupee" size={16} className="text-accent" />
            <span className="font-semibold">{opportunity.reward}</span>
          </div>
          <div
            className={`text-sm font-medium ${getUrgencyColor(
              Math.ceil(
                (new Date(opportunity.deadline) - new Date()) /
                  (1000 * 60 * 60 * 24)
              )
            )}`}
          >
            {formatDeadline(opportunity.deadline)}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Icon name="Users" size={14} />
              <span>{opportunity.applicants}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="MapPin" size={14} />
            <span>{opportunity.location}</span>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="space-y-3 pt-3 border-t border-border">
            <div>
              <h4 className="font-medium mb-1">Description</h4>
              <p className="text-sm text-muted-foreground break-words">
                {opportunity.description}
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-1">Requirements</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-line break-words">
                {opportunity.requirements}
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-1">Guidelines</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-line break-words">
                {opportunity.guidelines}
              </p>
            </div>
          </div>
        )}

        {/* Apply / Joined Button */}
        <div className="flex space-x-2 pt-2">
          {hasJoined ? (
            <Button variant="primary" className="flex-1" disabled>
              Joined
            </Button>
          ) : (
            <Button
              variant="default"
              className="flex-1 flex items-center justify-center gap-2"
              onClick={handleApply}
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
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
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                    />
                  </svg>
                  Applying...
                </>
              ) : (
                "Quick Apply"
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OpportunityCard;
