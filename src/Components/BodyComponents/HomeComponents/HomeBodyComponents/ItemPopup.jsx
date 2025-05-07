import React, { useState, useEffect } from "react";
import Icon from "../../../../assets/Icon";
import icons from "../../../../assets/icons.json";

export const ItemPopup = ({
  item,
  onClose,
  handleAddToCart,
  itemLoading,
  itemAdded,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isInCart, setIsInCart] = useState(false);

  // Check if the item exists in the cart on mount and when itemAdded changes
  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const itemExists = cartItems.some((cartItem) => cartItem.id === item.id);
    setIsInCart(itemExists);
  }, [item.id, itemAdded]);

  const handleQuantityChange = (change) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  const handleQuantityInput = (e) => {
    const value = e.target.value;
    // Allow only positive integers
    if (value === "" || (/^\d+$/.test(value) && parseInt(value) >= 1)) {
      setQuantity(value === "" ? 1 : parseInt(value));
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0000008a] bg-opacity-50 z-20">
      <div className="bg-[#252836] text-white w-[1200px] h-[800px] rounded-2xl shadow-lg relative flex p-6">
        {/* Back Button */}
        <button
          onClick={onClose}
          className="absolute cursor-pointer top-4 left-4 text-[#EA7C69] hover:text-white flex items-center gap-2"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          Back
        </button>

        {/* Item Image (Left Side) */}
        <div className="w-[40%] h-full flex items-center justify-center ">
          <div className="w-[80%] h-[80%] overflow-hidden">
            <img
              className="w-full h-full object-contain"
              src={item.imageURL}
              alt={item.itemName}
            />
          </div>
        </div>

        {/* Item Details (Right Side) */}
        <div className="w-[60%] h-full flex flex-col p-6">
          {/* Title and Price */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-semibold mb-2">{item.itemName}</h2>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[#ffffffb4] text-sm">
                  Section: <b>{item.sectionTitle}</b>
                </span>
              </div>
            </div>
            <div className="text-2xl font-semibold text-[#EA7C69]">
              $ {item.regPrice}
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Description</h3>
            <p className="text-[#ffffff9c] text-sm">{item.itemDescription}</p>
          </div>

          {/* Quantity Selector and Add to Cart */}
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-8">
              <h3 className="text-lg font-medium">Qty</h3>
              <div className="flex items-center bg-[#393C49] rounded-lg">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="px-3 py-4 text-2xl cursor-pointer text-[#EA7C69]"
                >
                  -
                </button>
                <input
                  type="text"
                  value={quantity}
                  onChange={handleQuantityInput}
                  className="w-12 text-center bg-[#393C49] text-white border-none outline-none"
                />
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="px-3 py-1 text-2xl cursor-pointer text-[#EA7C69]"
                >
                  +
                </button>
              </div>
            </div>
            <div
              onClick={() => {
                if (!isInCart && !itemLoading[item.id]) {
                  handleAddToCart(item);
                }
              }}
              className={`px-6 py-3 rounded-2xl flex gap-2 items-center cursor-pointer hover:shadow-emerald-500 hover:shadow ${
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
                    {itemLoading[item.id] ? "Adding..." : "Add to Cart"}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
