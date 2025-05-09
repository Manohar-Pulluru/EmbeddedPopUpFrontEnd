import React, { useState, useEffect } from "react";
import { ItemPopup } from "./ItemPopup";
import Icon from "../../../../assets/Icon";
import icons from "../../../../assets/icons.json";
import { useAppContext } from "../../../../Service/Context/AppContext";

export const ItemCard = ({
  item,
  showPayment,
  handleAddToCart,
  itemLoading,
  itemAdded,
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const { isCartChanged} = useAppContext(); // Access context

  useEffect(()=>{
    console.log("Cart Items Changed Reset by Checing the Add to Buttion")
  },[isCartChanged])


  // Function to check if item exists in cart
  const checkItemInCart = () => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const itemExists = cartItems.some((cartItem) => cartItem.id === item.id);
    setIsInCart(itemExists);
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

  return (
    <>
      <div
        className={`${
          showPayment ? "w-[45%] h-[250px]" : "w-[30%] h-[300px]"
        } mt-[150px] bg-[#1F1D2B] hover:bg-[#23212e] cursor-pointer relative rounded-4xl flex flex-col justify-end p-4`}
        onClick={() => setIsPopupOpen(true)}
      >
        <div className="w-[70%] absolute top-[-50%] left-[50%] translate-x-[-50%] translate-y-[20%] mx-auto overflow-hidden aspect-square p-0.5 bg-white rounded-full border">
          <img
            className="w-full h-full object-cover rounded-full"
            src={item.imageURL}
            alt={item.itemName}
          />
        </div>
        <div className="text-center min-h-[45%] max-h-[50%] mt-4 flex-col items-center flex justify-between">
          <div className="text-xl w-full text-center text-nowrap line-clamp-0 font-medium text-white">
            {item.itemName.length > 25
              ? item.itemName.substring(0, 25) + "..."
              : item.itemName}
          </div>
          <div className="text-lg font-normal w-full text-center text-white">
            $ {item.regPrice}
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation();
              if (!isInCart && !itemLoading[item.id]) {
                handleAddToCart(item);
              }
            }}
            className={`px-4 py-2 rounded-2xl w-fit flex gap-2 items-center cursor-pointer hover:shadow-emerald-500 hover:shadow ${
              itemLoading[item.id]
                ? "bg-[#d68475] cursor-not-allowed"
                : isInCart
                ? "bg-[#58685c] cursor-default"
                : "bg-[#EA7C69]"
            }`}
            disabled={itemLoading[item.id]}
          >
            {isInCart ? (
              <span>Added to Cart</span>
            ) : (
              <>
                <Icon height={16} width={16} name={icons.plus} fill="white" />
                <span>
                  {itemLoading[item.id] ? "Adding..." : "Cart"}
                </span>
              </>
            )}
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