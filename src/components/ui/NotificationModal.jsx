import React from "react";
import {
  BellIcon,
  BadgeCheck,
  Users,
  Palette,
  VideoIcon,
} from "lucide-react";

const notifications = [
  {
    id: 1,
    type: "Design Challenge",
    title: "Urban Fusion 2025",
    description: "New challenge by Zara for Gen Z streetwear designers.",
    icon: <Palette className="text-pink-500" size={22} />,
    time: "3 days left",
    tag: "Upcoming",
  },
  {
    id: 2,
    type: "Brand Collab",
    title: "KapdaSwag x H&M",
    description: "H&M is looking for indie designers to co-create.",
    icon: <Users className="text-green-500" size={22} />,
    time: "Apply by July 30",
    tag: "Collab",
  },
  {
    id: 3,
    type: "Model Hunt",
    title: "Looking for Models",
    description: "Puma is hiring college models for its next campaign.",
    icon: <BadgeCheck className="text-blue-500" size={22} />,
    time: "Limited slots",
    tag: "Casting",
  },
  {
    id: 4,
    type: "Content Creation",
    title: "Content Creators Wanted",
    description: "Reebok wants student creators to promote a new shoe drop.",
    icon: <VideoIcon className="text-yellow-500" size={22} />,
    time: "Rolling basis",
    tag: "Content",
  },
];

const Notifications = () => {
  return (
    <div className="px-4 py-5 space-y-5">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold text-black">Notifications</h2>
      </div>

      <div className="space-y-4">
        {notifications.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl border bg-white/5 backdrop-blur-md shadow hover:shadow-lg transition flex items-start gap-3"
          >
            <div className="mt-1">{item.icon}</div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-base text-black">{item.title}</h3>
                <div className="px-2 py-0.5 text-xs rounded-md bg-muted text-muted-foreground border">
                  {item.tag}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {item.description}
              </p>
              <p className="text-xs mt-2 text-muted-foreground">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
