import React, { useContext } from "react";
import { AppContext } from "../../../../Service/Context/AppContext";

export const Popup = () => {
  const { showPopup, popupMessage, closePopup } = useContext(AppContext);
  if (!showPopup) return null;

  return (
    <div
      className="
        flex z-200
        px-4
        bg-black bg-opacity-50
        fixed inset-0 items-center justify-center
      "
    >
      <div
        className="
          w-full max-w-sm
          mx-auto px-4 py-6
          text-white
          bg-[#252836]
          rounded-2xl
          shadow-lg
          relative
          sm:max-w-md sm:px-6 sm:py-10
        "
      >
        <button
          onClick={closePopup}
          aria-label="Close popup"
          className="
            text-[#EA7C69]
            absolute top-3 right-3 hover:text-white focus:outline-none
          "
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="
              w-6 h-6
              sm:w-8 sm:h-8
            "
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

        <p
          className="
            text-center text-sm
            sm:text-base
          "
        >
          {popupMessage}
        </p>
      </div>
    </div>
  );
};
