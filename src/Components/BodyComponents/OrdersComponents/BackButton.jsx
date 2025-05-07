import React from "react";

export const BackButton = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer text-[#ffafa1] mb-12 flex items-center gap-2"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15 18L9 12L15 6"
          stroke="#ffafa1"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      Back to Orders
    </div>
  );
};