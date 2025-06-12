import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";

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
    // Since localStorage is not available in Claude artifacts, 
    // we'll simulate this with a state variable
    const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const itemExists = cartItems.some((cartItem) => cartItem.id === item.id);
    setIsInCart(itemExists);
    // setIsInCart(itemAdded);
  }, [item?.id, itemAdded]);

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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20 p-4">
      <div className="bg-[#252836] text-white w-full max-w-6xl h-full max-h-[90vh] md:max-h-[800px] rounded-2xl shadow-lg relative flex flex-col md:flex-row overflow-hidden">
        {/* Back Button */}
        <button
          onClick={onClose}
          className="absolute cursor-pointer top-4 left-4 text-[#EA7C69] hover:text-white flex items-center gap-2 z-10"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="md:w-6 md:h-6"
          >
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-sm md:text-base">Back</span>
        </button>

        {/* Item Image (Top on mobile, Left on desktop) */}
        <div className="w-full md:w-[40%] h-64 md:h-full flex items-center justify-center p-4 md:p-6">
          <div className="w-full h-full max-w-sm md:max-w-none md:w-[80%] md:h-[80%] overflow-hidden rounded-lg md:rounded-none">
            <img
              className="w-full h-full object-cover md:object-contain"
              src={item.imageURL}
              alt={item.itemName}
            />
          </div>
        </div>

        <div className="w-full md:w-[60%] flex-1 flex flex-col p-3 md:p-6 overflow-y-auto">
          {/* Title and Price */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-3">
            <div className="flex-1">
              <h2 className="text-lg md:text-3xl font-semibold mb-1">{item.itemName}</h2>
              <span className="text-[#ffffffb4] text-xs md:text-sm">
                Section: <b>{item.sectionTitle}</b>
              </span>
            </div>
            <div className="text-lg md:text-2xl font-semibold text-[#EA7C69] self-start sm:self-auto">
              ${item.regPrice}
            </div>
          </div>

          {/* Description */}
          <div className="mb-4 flex-1">
            <h3 className="text-sm md:text-lg font-medium mb-1">Description</h3>
            <p className="text-[#ffffff9c] text-xs md:text-base leading-relaxed line-clamp-3 md:line-clamp-none">
              {item.itemDescription}
            </p>
          </div>

          {/* Quantity Selector and Add to Cart */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-auto pt-4 border-t border-[#393C49] sm:border-t-0 sm:pt-0">
            <div className="flex items-center justify-between sm:justify-start gap-4 sm:gap-8">
              <h3 className="text-base md:text-lg font-medium">Qty</h3>
              <div className="flex items-center bg-[#393C49] rounded-lg">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="px-3 py-2 md:py-4 text-xl md:text-2xl cursor-pointer text-[#EA7C69] hover:bg-[#4a4d5e] transition-colors"
                >
                  -
                </button>
                <input
                  type="text"
                  value={quantity}
                  onChange={handleQuantityInput}
                  className="w-10 md:w-12 text-center bg-[#393C49] text-white border-none outline-none py-2 md:py-4"
                />
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="px-3 py-2 md:py-4 text-xl md:text-2xl cursor-pointer text-[#EA7C69] hover:bg-[#4a4d5e] transition-colors"
                >
                  +
                </button>
              </div>
            </div>
            
            <button
              onClick={() => {
                if (!isInCart && !itemLoading?.[item.id]) {
                  handleAddToCart?.(item);
                }
              }}
              className={`px-4 md:px-6 py-3 rounded-2xl flex gap-2 items-center justify-center cursor-pointer transition-all duration-200 text-sm md:text-base font-medium ${
                itemLoading?.[item.id]
                  ? "bg-[#d68475] cursor-not-allowed"
                  : isInCart
                  ? "bg-[#58685c] cursor-default"
                  : "bg-[#EA7C69] hover:bg-[#d66b58] hover:shadow-lg hover:shadow-emerald-500/20"
              }`}
              disabled={itemLoading?.[item.id]}
            >
              {isInCart ? (
                <span>Added to Cart</span>
              ) : (
                <>
                  <Plus size={16} className="text-white" />
                  <span>
                    {itemLoading?.[item.id] ? "Adding..." : "Add to Cart"}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
