import React, { useContext } from "react";
import { AppContext } from "../../../../Service/Context/AppContext";

export const Popup = () => {
  const { showPopup, popupMessage, closePopup } = useContext(AppContext);
  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20 px-4">
      <div
        className="
          relative
          bg-[#252836] text-white
          w-full max-w-sm
          sm:max-w-md
          mx-auto
          rounded-2xl
          shadow-lg
          px-4 py-6
          sm:px-6 sm:py-10
        "
      >
        <button
          onClick={closePopup}
          className="
            absolute
            top-3 right-3
            text-[#EA7C69]
            hover:text-white
            focus:outline-none
          "
          aria-label="Close popup"
        >
          <svg
            className="w-6 h-6 sm:w-8 sm:h-8"
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

        <p className="text-center text-sm sm:text-base">
          {popupMessage}
        </p>
      </div>
    </div>
  );
};
