import React, { useContext } from "react";
import { AppContext } from "../../../../Service/Context/AppContext";

// Improved TemplateTabs Component
export const TemplateTabs = () => {
  const { templates, activeTemplateId, setActiveTemplateId } =
    useContext(AppContext);
  return (
    <div className="w-full px-4 sm:px-6">
      <div className="relative">
        {/* Gradient fade for overflow indication */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-900 to-transparent pointer-events-none"></div>

        <div className="flex gap-1 sm:gap-2 overflow-x-auto scrollbar-hide border-b border-gray-700 pb-0">
          {templates?.map((template, index) => (
            <button
              key={template.id}
              className={`relative flex-shrink-0 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 cursor-pointer transition-all duration-200 hover:bg-gray-800/50 rounded-t-lg group ${
                activeTemplateId === template.id ? "bg-gray-800/30" : ""
              }`}
              onClick={() => setActiveTemplateId(template.id)}
            >
              <span
                className={`text-sm sm:text-base lg:text-lg font-medium whitespace-nowrap transition-colors duration-200 ${
                  activeTemplateId === template.id
                    ? "text-[#EA7C69]"
                    : "text-gray-300 group-hover:text-white"
                }`}
              >
                {template.metaTemplateName}
              </span>

              {/* Active indicator */}
              <div
                className={`absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-[#EA7C69] transition-all duration-200 ${
                  activeTemplateId === template.id
                    ? "opacity-100 scale-x-100"
                    : "opacity-0 scale-x-0"
                }`}
              />
            </button>
          ))}

          {/* Show indication that there are more tabs if needed */}
          {templates?.length > 3 && (
            <div className="flex-shrink-0 w-2 flex items-center justify-center">
              <div className="text-gray-500 text-xs">...</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
