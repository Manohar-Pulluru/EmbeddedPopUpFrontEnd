import React from "react";

export const OrderTabs = ({ tabs, activeTab, setActiveTab, isTabDisabled }) => {
  return (
    <div className="flex gap-4 font-medium text-md">
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        const disabled = isTabDisabled(tab);
        return (
          <div
            key={tab}
            className={`w-fit px-4 py-2 rounded-2xl ${
              isActive
                ? "bg-[#EA7C69] text-white"
                : "border border-[#EA7C69] text-[#EA7C69]"
            } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            onClick={() => !disabled && setActiveTab(tab)}
          >
            {tab}
          </div>
        );
      })}
    </div>
  );
};