import React, { useContext } from "react";
import { AppContext } from "../../../../Service/Context/AppContext";

export const OrderTabs = () => {
  const { tabs, activeTab, setActiveTab, isTabDisabled, setShowPayment } =
    useContext(AppContext);
  return (
    <div className="flex gap-4 font-medium text-xs sm:text-base">
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        const disabled = isTabDisabled(tab);
        return (
          <div
            key={tab}
            className={`w-fit px-4 py-2 rounded-xl sm:rounded-2xl ${
              isActive
                ? "bg-[#EA7C69] text-white"
                : "border border-[#EA7C69] text-[#EA7C69]"
            } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            onClick={() => {
              !disabled && setActiveTab(tab);
              setShowPayment(false);
            }}
          >
            {tab}
          </div>
        );
      })}
    </div>
  );
};
