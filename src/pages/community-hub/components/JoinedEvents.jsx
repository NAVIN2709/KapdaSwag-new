import React, { useEffect, useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import { getJoinedEvents } from "functions/Userfunctions";
import { useNavigate } from "react-router-dom";

const JoinedEvents = ({ user }) => {
  const navigate = useNavigate();
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch joined events
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getJoinedEvents(user);
        setJoinedEvents(data || []);
      } catch (error) {
        console.error("Error fetching joined events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleView = (eventId) => {
    navigate(`/community-hub/${eventId}`);
  };

  if (loading) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        Loading your events...
      </div>
    );
  }

  if (!loading && joinedEvents.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <Icon name="CalendarX" size={24} className="mx-auto mb-3" />
        You haven't joined any events yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {joinedEvents.map((event) => (
        <div
          key={event.id}
          className="border border-border rounded-lg p-4 flex items-center gap-4 hover:shadow-md transition"
        >
          {/* Event Image */}
          <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={event.eventImage}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Event Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{event.title}</h3>
            <p className="text-sm text-muted-foreground">{event.brandName}</p>
            <p className="text-xs text-muted-foreground">
              Deadline: {new Date(event.deadline).toLocaleDateString()}
            </p>
          </div>

          {/* View Button */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleView(event.id)}
          >
            View
          </Button>
        </div>
      ))}
    </div>
  );
};

export default JoinedEvents;
