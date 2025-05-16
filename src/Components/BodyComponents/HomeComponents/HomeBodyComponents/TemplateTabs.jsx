import React from "react";

export const TemplateTabs = ({ templates, activeTemplateId, setActiveTemplateId }) => {
  return (
    <div className="w-full min-h-[5%] border-b border-[#5a5858] flex gap-4 overflow-scroll scrollbar-hide">
      {templates?.map((template) => (
        <div
          key={template.id}
          className={`flex px-4 h-full items-center cursor-pointer ${
            activeTemplateId === template.id
              ? "border-b-2 border-[#EA7C69]"
              : "border-b-2 border-transparent"
          }`}
          onClick={() => setActiveTemplateId(template.id)}
        >
          <div
            className={`text-lg text-nowrap font-semibold ${
              activeTemplateId === template.id ? "text-[#EA7C69]" : "text-white"
            }`}
          >
            {template.metaTemplateName}
          </div>
        </div>
      ))}
    </div>
  );
};