import React from "react";
import Icon from "../AppIcon"; // update the path if needed

const LeaderBoardModal = ({ data }) => {

  return (
    <div className="fixed inset-0 z-150 bg-black/30 backdrop-blur-sm flex justify-center items-start pt-24 px-4">
      <div className="w-full max-w-md bg-white dark:bg-background border rounded-2xl shadow-lg p-4 relative">

        {/* Header */}
        <h2 className="text-xl font-semibold text-center mb-4 text-black">
          🏆 Leaderboard
        </h2>

        {/* Leaderboard List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {data.map((user, index) => (
            <div
              key={user.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/10 transition"
            >
              <div className="w-8 text-right font-semibold text-muted-foreground">
                #{index + 1}
              </div>
              <img
                src={user.avatar}
                alt={user.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="font-medium text-background">{user.username}</p>
                <p className="text-xs text-muted-foreground">
                  {user.score} points
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeaderBoardModal;
