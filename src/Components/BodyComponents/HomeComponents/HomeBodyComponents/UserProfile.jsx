// UserProfile.jsx
import React, { useContext } from "react";
import { AppContext } from "../../../../Service/Context/AppContext";

const UserProfile = ({
  userName = "Guest User",
  userEmail = "guest@example.com",
}) => {
  const { setIsCartOpen, setActiveIndex, items, isMobile } = useContext(AppContext);

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleGoToCart = () => {
    setIsCartOpen(true);
    setActiveIndex(1);
    console.log("Navigating to cart from profile.");
  };

  return (
    <div className="fixed top-4 right-4 z-20">
      {/* Mobile View - Cart Button Only */}
      <div className="block md:hidden">
        <button
          onClick={handleGoToCart}
          className="
            relative w-12 h-12 
            bg-gradient-to-br from-[#EA7C69] to-[#EA6969]
            hover:from-[#d96b57] hover:to-[#d96b57]
            rounded-full shadow-lg hover:shadow-xl
            transition-all duration-300
            transform hover:scale-105 active:scale-95
            flex items-center justify-center
            group
          "
        >
          {/* Cart Icon */}
          <svg
            className="w-5 h-5 text-white z-10"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M7 18C5.9 18 5.01 18.9 5.01 20S5.9 22 7 22 9 21.1 9 20 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5H5.21L4.27 2H1ZM17 18C15.9 18 15.01 18.9 15.01 20S15.9 22 17 22 19 21.1 19 20 18.1 18 17 18Z" />
          </svg>
          
          {/* Item Count Badge */}
          {itemCount > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
              {itemCount > 9 ? '9+' : itemCount}
            </div>
          )}
        </button>
      </div>

      {/* Desktop View - Full Profile */}
      <div className="hidden md:block">
        <div className="bg-gradient-to-br from-[#252836] via-[#2a2f3f] to-[#252836] border border-[#393C49] rounded-xl shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl w-72 overflow-hidden">
          
          {/* Header Section */}
          <div className="p-3">
            <div className="flex items-center gap-3 mb-3">
              {/* Profile Avatar */}
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-[#EA7C69] to-[#EA6969] rounded-full flex items-center justify-center shadow-md">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-[#252836]"></div>
              </div>

              {/* User Details */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white text-sm truncate mb-0.5">
                  {userName}
                </h3>
                <p className="text-[#ABBBC2] text-xs truncate">
                  {userEmail}
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-[#393C49] mb-3"></div>

            {/* Cart Section */}
            <div className="flex items-center justify-between">
              {/* Cart Info */}
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#ABBBC2]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 18C5.9 18 5.01 18.9 5.01 20S5.9 22 7 22 9 21.1 9 20 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5H5.21L4.27 2H1ZM17 18C15.9 18 15.01 18.9 15.01 20S15.9 22 17 22 19 21.1 19 20 18.1 18 17 18Z" />
                </svg>
                <span className="text-[#ABBBC2] text-xs">Items: {itemCount}</span>
              </div>

              {/* Cart Button */}
              <button
                onClick={handleGoToCart}
                className="
                  px-3 py-1.5
                  bg-gradient-to-r from-[#EA7C69] to-[#EA6969]
                  hover:from-[#d96b57] hover:to-[#d96b57]
                  text-white font-medium text-xs
                  rounded-lg
                  transition-all duration-300
                  transform hover:scale-105 active:scale-95
                  shadow-md hover:shadow-lg
                  flex items-center gap-1.5
                "
              >
                <span>Cart</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
