import React from "react";
import Icon from "../AppIcon"; // update the path if needed

const LeaderBoardModal = ({ data }) => {

  return (
    <div className="fixed inset-0 z-150 bg-black/30 backdrop-blur-sm flex justify-center items-start pt-24 px-4">
      <div className="w-full max-w-md bg-white dark:bg-background border rounded-2xl shadow-lg p-4 relative">

        {/* Header */}
        <h2 className="text-xl font-semibold text-center mb-4 text-black">
          🏆 Leaderboard
          Coming Soon !
        </h2>

        {/* Leaderboard List */}
      </div>
    </div>
  );
};

export default LeaderBoardModal;
