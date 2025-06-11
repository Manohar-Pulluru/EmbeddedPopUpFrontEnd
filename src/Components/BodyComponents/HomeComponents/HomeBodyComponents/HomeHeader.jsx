import React from "react";

export const HomeHeader = ({
  businessData,
  searchQuery,
  handleSearch,
  setLoginPage,
}) => {
  return (
    <div className="w-full px-4 sm:px-6 py-4 sm:py-6">
      {/* Business Info Section */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mb-2 sm:mb-3">
          <span className="block truncate">
            {businessData?.name || "Business Name"}
          </span>
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-gray-300 leading-relaxed">
          {businessData?.address || "Business Address"}
        </p>
      </div>

      {/* Search and Login Section */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-stretch sm:items-center">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <div className="bg-[#2D303E] rounded-xl sm:rounded-2xl flex items-center px-4 py-3 sm:py-4 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 mr-3 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" />
            </svg>
            <input
              placeholder="Search items..."
              className="flex-1 bg-transparent text-white placeholder:text-gray-400 text-sm sm:text-base focus:outline-none"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>

        {/* Login Button */}
        {!localStorage.getItem("aftoAuthToken")?.length && (
          <button
            onClick={() => setLoginPage(true)}
            className="bg-[#ea7c69] hover:bg-[#d96b57] active:bg-[#c75a47] text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl text-sm sm:text-base whitespace-nowrap"
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
};
