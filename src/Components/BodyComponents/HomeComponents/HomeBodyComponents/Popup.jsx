import React from "react";

export const Popup = ({ showPopup, popupMessage, closePopup }) => {
  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0000008a] bg-opacity-50 z-20">
      <div className="bg-[#252836] text-white px-6 py-16 w-[400px] rounded-2xl shadow-lg relative">
        <button
          onClick={closePopup}
          className="absolute cursor-pointer top-2 right-2 text-[#EA7C69] hover:text-white"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <p className="text-center">{popupMessage}</p>
      </div>
    </div>
  );
};