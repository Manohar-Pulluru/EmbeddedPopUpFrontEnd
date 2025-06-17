import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../../../../Service/Context/AppContext";

const AlertCard = ({
  isVisible,
  onClose,
  // onGoToCart,
  itemName = "Item",
  autoCloseDelay = 5000,
}) => {
  // const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const { setIsCartOpen, setActiveIndex } = useContext(AppContext);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      // Auto close after delay
      const timer = setTimeout(() => {
        handleClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [isVisible, autoCloseDelay]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300); // Wait for animation to complete
  };

  const onGoToCart = () => {
    setIsCartOpen(true);
    setActiveIndex(1);
    console.log("Go to cart clicked");
  };

  if (!isVisible && !isAnimating) return null;

  return (
    <div
      className={`
        fixed top-2 sm:top-5 left-1/2 transform -translate-x-1/2 z-50
        transition-all duration-300 ease-out
        px-2 sm:px-0
        ${
          isAnimating && isVisible
            ? "translate-y-0 opacity-100 scale-100"
            : "-translate-y-full opacity-0 scale-95"
        }
      `}
    >
      <div
        className="
        bg-[#252836] 
        border border-[#393C49] 
        rounded-lg sm:rounded-2xl 
        shadow-2xl 
        p-2 sm:p-4 md:p-6 
        w-full sm:min-w-[380px] md:min-w-[400px] 
        max-w-[calc(100vw-16px)] sm:max-w-[90vw]
        backdrop-blur-sm
        relative
        overflow-hidden
      "
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="
            absolute top-1.5 right-1.5 sm:top-3 sm:right-3 
            w-4 h-4 sm:w-6 sm:h-6 
            flex items-center justify-center
            text-[#ABBBC2] hover:text-white
            transition-colors duration-200
            rounded-full hover:bg-[#393C49]
          "
          aria-label="Close"
        >
          <svg width="10" height="10" className="sm:w-[14px] sm:h-[14px]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>

        {/* Success icon and content */}
        <div className="flex items-start gap-1.5 sm:gap-3 md:gap-4">
          <div
            className="
            flex-shrink-0
            w-6 h-6 sm:w-10 sm:h-10 md:w-12 md:h-12
            bg-gradient-to-br from-[#EA7C69] to-[#EA6969]
            rounded-full
            flex items-center justify-center
            shadow-lg
            animate-bounce
          "
          >
            <svg
              width="12"
              height="12"
              className="sm:w-5 sm:h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20,6 9,17 4,12" />
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            {/* Success message */}
            <h3
              className="
              text-white font-semibold 
              text-xs sm:text-base md:text-lg 
              mb-0 sm:mb-1
              leading-tight
            "
            >
              Added to Cart!
            </h3>

            <p
              className="
              text-[#ABBBC2] 
              text-[10px] sm:text-sm md:text-base 
              mb-2 sm:mb-4
              leading-tight sm:leading-relaxed
              truncate sm:whitespace-normal
            "
            >
              <span className="text-[#EA7C69] font-medium">{itemName}</span> added
            </p>

            {/* Action buttons - Horizontal on mobile for super compact */}
            <div className="flex gap-1.5 sm:gap-3 md:gap-4">
              <button
                onClick={() => {
                  handleClose();
                  console.log("continue shopping clicked");
                }}
                className="
                  px-2 py-1 sm:px-4 sm:py-2 md:px-5 md:py-2.5
                  bg-[#393C49] hover:bg-[#4A4E5C] 
                  text-[#ABBBC2] hover:text-white
                  font-medium
                  rounded-md sm:rounded-lg md:rounded-xl
                  transition-all duration-200
                  text-[10px] sm:text-sm md:text-base
                  border border-[#4A4E5C]
                  hover:border-[#5A5E6C]
                  flex-1 sm:flex-none
                  min-w-0
                "
              >
                <span className="hidden sm:inline">Continue Shopping</span>
                <span className="sm:hidden">Continue</span>
              </button>

              <button
                onClick={() => {
                  onGoToCart();
                  handleClose();
                  console.log("Go to cart clicked");
                }}
                className="
                  px-2 py-1 sm:px-4 sm:py-2 md:px-6 md:py-2.5
                  bg-gradient-to-r from-[#EA7C69] to-[#EA6969]
                  hover:from-[#d96b57] hover:to-[#d96b57]
                  active:from-[#c75a47] active:to-[#c75a47]
                  text-white font-semibold
                  rounded-md sm:rounded-lg md:rounded-xl
                  transition-all duration-200
                  transform hover:scale-[1.02] active:scale-[0.98]
                  shadow-lg hover:shadow-xl
                  text-[10px] sm:text-sm md:text-base
                  flex items-center justify-center gap-1 sm:gap-2
                  flex-1 sm:flex-none
                  min-w-0
                "
              >
                <span className="hidden sm:inline">View Cart</span>
                <span className="sm:hidden">Cart</span>
                <svg
                  width="10"
                  height="10"
                  className="sm:w-4 sm:h-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M7 18C5.9 18 5.01 18.9 5.01 20S5.9 22 7 22 9 21.1 9 20 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5H5.21L4.27 2H1ZM17 18C15.9 18 15.01 18.9 15.01 20S15.9 22 17 22 19 21.1 19 20 18.1 18 17 18Z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Progress bar for auto-close */}
        <div
          className="
          absolute bottom-0 left-0 right-0 
          h-0.5 sm:h-1 
          bg-[#393C49] 
          overflow-hidden
          rounded-b-xl sm:rounded-b-2xl
        "
        >
          <div
            className="
              h-full 
              bg-gradient-to-r from-[#EA7C69] to-[#EA6969]
              animate-[shrink_5s_linear_forwards]
            "
            style={{
              animation: isVisible ? "shrink 5s linear forwards" : "none",
            }}
          />
        </div>
      </div>

      {/* Custom keyframes for progress bar */}
      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};

export default AlertCard;
