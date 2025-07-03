import React, { useContext } from "react";
import { AppContext } from "../../../../Service/Context/AppContext";

const CartButton = () => {
  const { setIsCartOpen, setActiveIndex, items, isMobile } = useContext(AppContext);

  const size = isMobile ? "small" : "default"; // Use small size for mobile

  const onClick = () => {
    setActiveTab("Cart");
    setIsCartOpen(true);
    setActiveIndex(1);
    console.log("Go to cart clicked");
  };

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const sizeClasses = {
    small: "w-10 h-10",
    default: "w-12 h-12 sm:w-14 sm:h-14",
    large: "w-14 h-14 sm:w-16 sm:h-16",
  };

  const iconSizes = {
    small: "w-4 h-4",
    default: "w-5 h-5 sm:w-6 sm:h-6",
    large: "w-6 h-6 sm:w-7 sm:h-7",
  };

  const badgeSizes = {
    small: "w-4 h-4 text-xs",
    default: "w-5 h-5 sm:w-6 sm:h-6 text-xs sm:text-sm",
    large: "w-6 h-6 sm:w-7 sm:h-7 text-sm sm:text-base",
  };

  return (
    <button
      onClick={onClick}
      className={`
        fixed top-4 right-4 z-10
        ${sizeClasses[size]}
        bg-gradient-to-br from-[#EA7C69] to-[#EA6969]
        hover:from-[#d96b57] hover:to-[#d96b57]
        active:from-[#c75a47] active:to-[#c75a47]
        rounded-full
        flex items-center justify-center
        shadow-2xl hover:shadow-xl
        transition-all duration-300
        transform hover:scale-105 active:scale-95
        border-2 border-[#393C49]
        group
      `}
      aria-label="Open Cart"
    >
      <div className="relative">
        <svg
          className={`${iconSizes[size]} text-white transition-transform duration-200 group-hover:scale-110`}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M7 18C5.9 18 5.01 18.9 5.01 20S5.9 22 7 22 9 21.1 9 20 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5H5.21L4.27 2H1ZM17 18C15.9 18 15.01 18.9 15.01 20S15.9 22 17 22 19 21.1 19 20 18.1 18 17 18Z" />
        </svg>

        {/* Cart Item Count Badge */}
        {itemCount > 0 && (
          <div
            className={`
            absolute -top-2 -right-2
            ${badgeSizes[size]}
            bg-[#252836]
            border-2 border-white
            rounded-full
            flex items-center justify-center
            text-white font-bold
            animate-bounce
          `}
          >
            {itemCount > 99 ? "99+" : itemCount}
          </div>
        )}
      </div>
    </button>
  );
};

export default CartButton;
