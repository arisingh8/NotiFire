"use client";
import React from "react";

interface ResponderSummaryProps {
  isOpen: boolean;
  onClose: () => void;
  summaries: { firefighter: string; emt: string; police: string } | null;
}

const ResponderSummarySidebar: React.FC<ResponderSummaryProps> = ({
  isOpen,
  onClose,
  summaries,
}) => {
  return (
    <div
      className={`fixed left-0 top-0 h-full w-80 bg-gray-900 shadow-lg transform ${isOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out`}
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-6 text-white flex justify-between items-center border-b border-gray-700">
          <h3 className="text-xl font-bold">Responder Summaries</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200"
          >
            &times;
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {summaries ? (
            <div className="space-y-4">
              <div className="p-4 bg-red-700/50 rounded-lg">
                <h4 className="text-lg font-bold">Firefighter</h4>
                <p>{summaries.firefighter || "No immediate concerns."}</p>
              </div>
              <div className="p-4 bg-blue-700/50 rounded-lg">
                <h4 className="text-lg font-bold">EMT</h4>
                <p>{summaries.emt || "No EMT assistance required."}</p>
              </div>
              <div className="p-4 bg-green-700/50 rounded-lg">
                <h4 className="text-lg font-bold">Police</h4>
                <p>{summaries.police || "No law enforcement action needed."}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-400">Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResponderSummarySidebar;
