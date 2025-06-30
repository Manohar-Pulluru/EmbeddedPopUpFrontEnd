// ItemCard.js
import React, { useState, useEffect } from "react";
import { ItemPopup } from "./ItemPopup";
import Icon from "../../../../assets/Icon";
import icons from "../../../../assets/icons.json";
import { useAppContext } from "../../../../Service/Context/AppContext";
import { addItemToCart, updateCart } from "../../../../Service/api";

export const ItemCard = ({
  item,
  showPayment,
  handleAddToCart,
  itemLoading,
  itemAdded,
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const { isCartChanged, setShowAlert, setLoginPage, mode } = useAppContext();

  useEffect(() => {
    console.log("Cart Items Changed Reset by Checking the Add to Button");
  }, [isCartChanged]);

  // Function to check if item exists in cart
  const checkItemInCart = () => {
    try {
      const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
      const itemExists = cartItems.some((cartItem) => cartItem.id === item.id);
      setIsInCart(itemExists);
    } catch (error) {
      console.error("Error checking cart items:", error);
      setIsInCart(false);
    }
  };

  // Run on mount and when itemAdded changes
  useEffect(() => {
    checkItemInCart();
  }, [item.id, itemAdded, isCartChanged]);

  // Listen for cart update events
  useEffect(() => {
    const handleCartUpdate = () => {
      checkItemInCart();
    };

    // Listen for custom cart update event
    window.addEventListener("cartUpdated", handleCartUpdate);
    // Also listen for storage event for cross-tab updates
    window.addEventListener("storage", (e) => {
      if (e.key === "cartItems") {
        checkItemInCart();
      }
    });

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
      window.removeEventListener("storage", handleCartUpdate);
    };
  }, [item.id]);

  const handleCardClick = () => {
    setIsPopupOpen(true);
  };

  const handleAddToCartClick = async (e) => {
    e.stopPropagation();
    if (!isInCart && !itemLoading[item.id]) {
      const aftoAuthToken = localStorage.getItem("aftoAuthToken");
      if (!aftoAuthToken) {
        setLoginPage(true);
      } else {
        // handleAddToCart(item)

        // const isNewCart = localStorage.getItem("cartOrderId");

        // const userDataInLocal = localStorage.getItem("aftoSignupForm");
        // console.log("userDataInLocal", userDataInLocal);

        // if (!isNewCart) {
        //   localStorage.setItem("cartOrderId", "1308");
        // } else {
        //   const cartOrderId = localStorage.getItem("cartOrderId");
        //   const payload = {
        //     orderId: cartOrderId,
        //     items: [item],
        //   };
        //   const addItemToCartResponse = updateCart(payload);

        //   console.log(addItemToCartResponse, "addItemToCartResponse");
        // }

        const cartOrderId = localStorage.getItem("cartOrderId");

        if (!cartOrderId) {
          const signup = JSON.parse(
            localStorage.getItem("aftoSignupForm") || "{}"
          );

          const orderPayload = {
            customerName: signup.name,
            customerWhatsappNumber: signup.whatsapp,
            customerEmail: signup.email,
            businessAccountId: signup.businessAccountId,
            deliveryCharges: 0,
            deliveryType: mode,
            items: [item],
          };

          try {
            const { orderId } = await addItemToCart(orderPayload);
            localStorage.setItem("cartOrderId", orderId);
            setShowAlert(true);
            // window.dispatchEvent(new Event("cartUpdated"));
          } catch (err) {
            console.error("addItemToCart failed:", err);
          }
        } else {
          // --- add to an existing incomplete order ---
          const payload = {
            orderId: cartOrderId,
            items: [item],
          };
          try {
            await updateCart(payload);
            setShowAlert(true);
            // window.dispatchEvent(new Event("cartUpdated"));
          } catch (err) {
            console.error("updateCart failed:", err);
          }
        }

        // const payload = {};

        // addItemToCart(payload);
        // setShowAlert(true);
      }
    }
  };

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <>
      <div
        className="group relative cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
        onClick={handleCardClick}
      >
        <div
          className={`h-[150px] xs:h-[220px] sm:h-[250px] md:h-[280px] w-full aspect-[3/4]
          mt-8 xs:mt-10 sm:mt-12 md:mt-16 lg:mt-20 
          bg-[#1F1D2B] hover:bg-[#252332] 
          relative rounded-2xl sm:rounded-3xl 
          flex flex-col justify-end 
          p-4 sm:p-5 md:p-6 
          shadow-lg hover:shadow-2xl
          border border-gray-800 hover:border-gray-700
          transition-all duration-300
        `}
        >
          {/* Image container with improved responsive positioning */}
          <div
            className="
            w-22 h-22 xs:w-14 xs:h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-34 lg:h-34
            absolute 
            top-[-55px] xs:top-[-28px] sm:top-[-32px] md:top-[-40px] lg:top-[-48px] 
            left-1/2 transform -translate-x-1/2 
            overflow-hidden bg-white rounded-full 
            border-2 sm:border-4 border-white
            shadow-lg group-hover:shadow-xl
            transition-all duration-300 group-hover:scale-110
          "
          >
            <img
              className="w-full h-full object-cover rounded-full"
              src={
                item.imageURL?.length
                  ? item.imageURL
                  : "https://via.placeholder.com/150"
              }
              alt={item.itemName || "Food item"}
              loading="lazy"
            />
          </div>

          {/* Content container with improved spacing */}
          <div className="text-center flex-1 flex flex-col justify-between items-center pt-2 xs:pt-3 sm:pt-4 md:pt-6">
            {/* Item name with responsive text and better line clamping */}
            <h3
              className="
              text-xs xs:text-sm mt-4 sm:mt-16 sm:text-base md:text-lg lg:text-xl 
              font-medium text-white 
              mb-1 xs:mb-2 sm:mb-3 
              leading-tight
              text-center w-full
              line-clamp-2
              group-hover:text-[#EA7C69] transition-colors duration-300
            "
            >
              {/* {truncateText(item.itemName, showPayment ? 30 : 35)} */}
              {truncateText(item.itemName, 35)}
            </h3>

            {/* Price with better typography */}
            <div
              className="
              text-sm xs:text-base sm:text-lg md:text-xl 
              font-semibold text-white 
              mb-2 xs:mb-3 sm:mb-4
              group-hover:text-[#EA7C69] transition-colors duration-300
            "
            >
              ${item.itemRegPrice}
            </div>

            {/* Add to cart button with improved responsive design */}
            <button
              onClick={handleAddToCartClick}
              disabled={itemLoading[item.id]}
              className={`
                px-2 xs:px-3 sm:px-4 md:px-5 
                py-1 xs:py-1.5 sm:py-2 
                rounded-lg xs:rounded-xl sm:rounded-2xl 
                text-xs xs:text-sm sm:text-base 
                font-medium
                flex items-center gap-1 xs:gap-1.5 sm:gap-2 
                transition-all duration-300 
                shadow-md hover:shadow-lg
                transform hover:scale-105 active:scale-95
                ${
                  itemLoading[item.id]
                    ? "bg-[#d68475] cursor-not-allowed opacity-70"
                    : isInCart
                    ? "bg-[#58685c] cursor-default"
                    : "bg-[#EA7C69] hover:bg-[#d96b57] hover:shadow-orange-500/25"
                }
              `}
            >
              {isInCart ? (
                <span className="text-white whitespace-nowrap">
                  Added to Cart
                </span>
              ) : (
                <>
                  {/* <Icon 
                    height={showPayment ? 12 : 14} 
                    width={showPayment ? 12 : 14} 
                    name={icons.plus} 
                    fill="white" 
                  /> */}
                  <Icon height={14} width={14} name={icons.plus} fill="white" />
                  <span className="text-white whitespace-nowrap">
                    {itemLoading[item.id] ? "Adding..." : "Add to Cart"}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {isPopupOpen && (
        <ItemPopup
          item={item}
          onClose={() => setIsPopupOpen(false)}
          handleAddToCart={handleAddToCart}
          itemAdded={itemAdded}
          itemLoading={itemLoading}
        />
      )}
    </>
  );
};
