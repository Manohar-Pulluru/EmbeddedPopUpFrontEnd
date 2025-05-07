import React from "react";

export const HomeHeader = ({
  businessData,
  searchQuery,
  handleSearch,
  setLoginPage,
}) => {
  return (
    <div className="w-full h-[13%] flex justify-between items-center">
      <div className="flex-1 h-full flex flex-col gap-4 pt-4">
        <div className="text-4xl font-semibold">{businessData?.name}</div>
        {/* <div className="text-lg text-[#ffffff9c]">Tuesday, 2 Feb 2021</div> */}
        <div className="text-lg text-[#ffffff9c]">
          {/* show current date and day */}
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>
      <div className="h-16 px-6 gap-4 bg-[#2D303E] flex rounded-2xl w-fit items-center justify-center">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_6_12270)">
            <path
              d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"
              fill="#ffffff"
            />
          </g>
          <defs>
            <clipPath id="clip0_6_12270">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
        <input
          placeholder="Search for food, coffee, etc..."
          className="hover:outline-none focus:outline-none h-full w-full pb-1 bg-transparent text-white placeholder:text-[#ffffff9c]"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      {localStorage.getItem("aftoAuthToken")?.length ? (
        <></>
      ) : (
        <button
          onClick={() => setLoginPage(true)}
          className="px-8 h-16 text-lg ml-8 rounded-2xl cursor-pointer font-semibold bg-[#ea7c69] hover:bg-[#c27f73]"
        >
          Login
        </button>
      )}
    </div>
  );
};
