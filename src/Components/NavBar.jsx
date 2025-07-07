import React, { useState, useEffect, useContext } from "react";
import Icon from "../assets/Icon";
import icons from "../assets/icons.json";
import { AppContext } from "../Service/Context/AppContext";

export const NavBar = ({ activeIndex, setActiveIndex }) => {
  // const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const {
    isMobile,
    setIsMobile,
    isCartOpen,
    setIsCartOpen,
    items,
    setActiveTab,
    setShowPayment,
    businessData
  } = useContext(AppContext);

  useEffect(() => {
    setShowPayment(false);
  }, [activeIndex]);

  console.log(businessData, "jkbebck")

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0); // here is the item count

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Desktop options
  const options = [
    { name: "Home", iconName: icons.home },
    { name: "Cart", iconName: icons.cart },
    { name: "Orders", iconName: icons.orders },
    { name: "Profile", iconName: icons.profile },
  ];

  const triggerLogout = () => {
    localStorage.removeItem("aftoAuthToken");
    localStorage.removeItem("aftoSignupForm");
    // localStorage.removeItem("orderHistory");
    localStorage.removeItem("cartItems");
    localStorage.removeItem("cartOrderId");

    // localStorage.clear();
    window.location.reload();
  };

  // Desktop positioning
  const topOffset = 136; // height of logo section
  const topPosition = topOffset + activeIndex * 136;

  // Mobile positioning - now properly calculated for 5 items
  const mobileItemWidth = window.innerWidth / options.length;
  const leftPosition = activeIndex * mobileItemWidth;

  // Generic cart icon component for mobile
  const CartIcon = ({ width = 24, height = 24, fill = "#EA7C69" }) => (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7 18C5.9 18 5.01 18.9 5.01 20S5.9 22 7 22 9 21.1 9 20 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5H5.21L4.27 2H1ZM17 18C15.9 18 15.01 18.9 15.01 20S15.9 22 17 22 19 21.1 19 20 18.1 18 17 18Z"
        fill={fill}
      />
    </svg>
  );

  return (
    // <div className="h-full w-full flex sm:flex-col flex-row bg-[#1F1D2B] relative">
    <div
      className="
        fixed bottom-0 left-0
        sm:static
        flex sm:flex-col flex-row
        w-full sm:w-[5%]
        h-16 sm:h-full
        bg-[#1F1D2B]
        overflow-hidden
        z-20
      "
    >
      {/* Logo - only visible on desktop */}
      <div className="sm:h-34 sm:w-full aspect-square sm:flex hidden items-center justify-center z-10">
        {
          <img className="w-[60%] rounded-xl bg-white shadow-md shadow-white" src={businessData?.logoUrl}/>
        }
      </div>

      {/* Moving box (desktop - vertical) */}
      {/* Moving box (desktop - vertical, left aligned) */}
      {!isMobile && (
        <div
          className="absolute hidden sm:flex flex-col h-34 w-16 left-3 bg-transparent transition-all duration-300 ease-in-out z-0"
          style={{ top: `${topPosition}px` }}
        >
          <div className="w-full h-6 bg-[#1F1D2B] rounded-br-4xl"></div>
          <div className="w-full flex-1 bg-[#1F1D2B] flex justify-start">
            <div className="h-full w-[132%] aspect-square bg-[#252836] p-4 pr-5 rounded-l-3xl">
              <div className="bg-[#EA7C69] rounded-2xl h-full aspect-square"></div>
            </div>
          </div>
          <div className="w-full h-6 bg-[#1F1D2B] rounded-tr-4xl"></div>
        </div>
      )}

      {/* this is not alligned  */}
      {isMobile && (
        <div
          className="absolute sm:hidden bottom-0 h-16 transition-all duration-300 ease-in-out z-0 "
          // className="absolute bottom-0 sm:hidden h-16 transition-all duration-300 ease-in-out z-0"
          style={{
            left: `${leftPosition}px`,
            width: `${mobileItemWidth}px`,
          }}
        >
          <div className="w-full h-2 bg-[#1F1D2B]"></div>
          <div className="w-full flex-1 bg-[#1F1D2B] flex items-start justify-center">
            <div
              className="bg-[#EA7C69] rounded-xl"
              style={{
                width: `${Math.min(mobileItemWidth * 0.7, 48)}px`,
                height: `${Math.min(mobileItemWidth * 0.7, 48)}px`,
              }}
            ></div>
          </div>
        </div>
      )}

      {/* Menu icons */}
      {options.map((option, index) => {
        const isActive = index === activeIndex;
        return (
          <div
            key={index}
            className={`flex items-center justify-center sm:h-34 h-16 cursor-pointer z-10 relative ${
              isMobile ? "flex-1" : "w-16 sm:w-full"
            }`}
            onClick={() => {
              setActiveIndex(index);
              if (option.name === "Cart") {
                setActiveTab("Cart");
                setIsCartOpen(true);
              } else {
                setIsCartOpen(false);
              }
            }}
          >
            <div className="w-full sm:ml-2 flex items-center justify-center flex-col sm:flex-row gap-1 sm:gap-0">
              {option.name === "See Cart" ? (
                <CartIcon
                  width={isMobile ? 20 : 32}
                  height={isMobile ? 20 : 32}
                  fill={isActive ? "#FFFFFF" : "#EA7C69"}
                />
              ) : (
                <div className="relative">
                  <Icon
                    name={option.iconName}
                    width={isMobile ? 20 : 32}
                    height={isMobile ? 20 : 32}
                    fill={isActive ? "#FFFFFF" : "#EA7C69"}
                  />
                  {option.name === "Cart" && itemCount > 0 && (
                    <div
                      className={`
                        absolute 
                        ${isMobile ? "-top-1 -right-1" : "-top-2 -right-2"}
                        ${
                          isMobile
                            ? "h-4 min-w-[16px] px-1"
                            : "h-5 min-w-[20px] px-1.5"
                        }
                        bg-gradient-to-br from-[#EA7C69] to-[#EA6969]
                        text-white 
                        ${isMobile ? "text-[9px]" : "text-xs"}
                        font-bold 
                        rounded-full 
                        flex items-center justify-center
                        shadow-lg
                        border-2 border-[#1F1D2B]
                      `}
                    >
                      {itemCount > 99 ? "99+" : itemCount}
                    </div>
                  )}
                </div>
              )}
              {/* Label for mobile - optional */}
              {isMobile && (
                <span
                  className={`text-xs font-medium ${
                    isActive ? "text-white" : "text-[#EA7C69]"
                  }`}
                  style={{ fontSize: "10px" }}
                >
                  {option.name === "See Cart" ? "Cart" : option.name}
                </span>
              )}
            </div>
          </div>
        );
      })}

      {/* Auth section - only visible on desktop */}
      {!isMobile && (
        <>
          {!localStorage.getItem("aftoAuthToken")?.length ? (
            <div className="sm:h-34 sm:w-auto pl-7 flex-col absolute bottom-0 aspect-square sm:flex hidden items-start justify-center z-10">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="pl-2"
              >
                <g clipPath="url(#clip0_6_14602)">
                  <path
                    d="M12 5.9C13.16 5.9 14.1 6.84 14.1 8C14.1 9.16 13.16 10.1 12 10.1C10.84 10.1 9.9 9.16 9.9 8C9.9 6.84 10.84 5.9 12 5.9ZM12 14.9C14.97 14.9 18.1 16.36 18.1 17V18.1H5.9V17C5.9 16.36 9.03 14.9 12 14.9ZM12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4ZM12 13C9.33 13 4 14.34 4 17V20H20V17C20 14.34 14.67 13 12 13Z"
                    fill="#ea7c69"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_6_14602">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <div className="text-[#ea7c69] w-full font-semibold text-start">
                Guest
              </div>
            </div>
          ) : (
            <div className="sm:h-34 sm:w-auto cursor-pointer pl-7 flex-col absolute bottom-0 aspect-square sm:flex hidden items-start justify-center z-10">
              <svg
                onClick={triggerLogout}
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="#ea7c69"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 17L8.41 15.59L5.83 13L16 13L16 11L5.83 11L8.41 8.42L7 7L2 12L7 17ZM20 19L12 19L12 21L20 21C21.1 21 22 20.1 22 19L22 5C22 3.9 21.1 3 20 3L12 3L12 5L20 5L20 19Z"
                  fill="#ea7c69"
                />
              </svg>
            </div>
          )}
        </>
      )}
    </div>
  );
};
