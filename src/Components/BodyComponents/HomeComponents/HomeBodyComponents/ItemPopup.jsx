import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useAppContext } from "../../../../Service/Context/AppContext";

export const ItemPopup = ({
  item,
  onClose,
  handleAddToCart,
  itemLoading,
  itemAdded,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isInCart, setIsInCart] = useState(false);
  const { isCartChanged, handleQuantityChange } = useAppContext();

  // Check if the item exists in the cart on mount and when itemAdded changes
  useEffect(() => {
    // Since localStorage is not available in Claude artifacts,
    // we'll simulate this with a state variable
    const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const itemExists = cartItems.some((cartItem) => cartItem.id === item.id);
    setIsInCart(itemExists);
    // setIsInCart(itemAdded);
  }, [item?.id, itemAdded, isCartChanged]);

  const handleQuantityInput = (e) => {
    const value = e.target.value;
    // Allow only positive integers
    if (value === "" || (/^\d+$/.test(value) && parseInt(value) >= 1)) {
      setQuantity(value === "" ? 1 : parseInt(value));
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-60 p-4 bg-gradient-to-br from-black/80 via-gray-900/90 to-black/80 backdrop-blur-sm"
      onClick={() => {
        onClose();
      }}
    >
      <div
        className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 border border-slate-700/30 text-white w-full max-w-6xl h-full max-h-[90vh] md:max-h-[800px] rounded-2xl shadow-2xl relative flex flex-col md:flex-row overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Back Button */}
        <button
          onClick={onClose}
          className="absolute cursor-pointer top-4 left-4 text-[#EA7C69] hover:text-white flex items-center gap-2 z-10 p-2 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 transition-all duration-200 backdrop-blur-sm"
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
          <span className="text-sm md:text-base font-medium">Back</span>
        </button>

        {/* Item Image (Top on mobile, Left on desktop) */}
        <div className="w-full md:w-[45%] h-64 md:h-full flex items-center justify-center p-6 md:p-8 relative bg-gradient-to-br from-slate-700/20 to-slate-800/30">
          <div className="relative w-full h-full max-w-sm md:max-w-none">
            {/* Decorative frame background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-600/30 to-slate-700/40 rounded-2xl transform rotate-1"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-slate-700/40 to-slate-800/50 rounded-2xl transform -rotate-1"></div>

            {/* Main image container */}
            <div className="relative w-full h-full overflow-hidden rounded-2xl shadow-2xl ring-2 ring-slate-600/40 ring-offset-2 ring-offset-slate-800">
              <img
                className="w-full h-full object-cover transition-all duration-500 hover:scale-110"
                src={item.imageURL}
                alt={item.itemName}
              />

              {/* Subtle overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-slate-900/10"></div>

              {/* Floating section badge */}
              <div className="absolute top-4 left-4 px-3 py-1.5 bg-slate-900/80 backdrop-blur-sm rounded-full border border-slate-700/50">
                <span className="text-xs font-medium text-slate-300">
                  {item.sectionTitle}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-[55%] flex-1 flex flex-col p-6 md:p-8 overflow-y-auto bg-gradient-to-br from-slate-800/30 to-slate-900/20">
          {/* Title and Price */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-6">
            <div className="flex-1">
              <h2 className="text-xl md:text-3xl font-bold mb-2 text-white leading-tight">
                {item.itemName}
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-sm md:text-base">
                  Section:
                </span>
                <span className="text-slate-300 font-semibold bg-slate-700/40 px-2 py-1 rounded-lg text-sm">
                  {item.sectionTitle}
                </span>
              </div>
            </div>
            <div className="text-xl md:text-3xl font-bold text-[#EA7C69] self-start sm:self-auto bg-gradient-to-r from-[#EA7C69]/20 to-[#EA7C69]/10 px-4 py-2 rounded-xl border border-[#EA7C69]/20">
              ${item.regPrice}
            </div>
          </div>

          {/* Description */}
          <div className="mb-6 flex-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-6 bg-[#EA7C69] rounded-full"></div>
              <h3 className="text-lg md:text-xl font-semibold text-slate-200">
                Description
              </h3>
            </div>
            <div className="bg-slate-700/20 rounded-xl p-4 border border-slate-600/30">
              <p className="text-slate-300 text-sm md:text-base leading-relaxed line-clamp-3 md:line-clamp-none">
                {item.itemDescription}
              </p>
            </div>
          </div>

          {/* Quantity Selector and Add to Cart */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6 mt-auto pt-6 border-t border-slate-700/50">
            <div className="flex items-center justify-between sm:justify-start gap-6">
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 bg-[#EA7C69] rounded-full"></div>
                <h3 className="text-lg md:text-xl font-semibold text-slate-200">
                  Quantity
                </h3>
              </div>
              <div className="flex items-center bg-slate-700/40 rounded-xl border border-slate-600/40 overflow-hidden shadow-lg">
                <button
                  onClick={() => {
                    setQuantity((prev) => Math.max(1, prev - 1));
                    console.log("ITEMMM", item);
                    handleQuantityChange(item.id, quantity);
                  }}
                  className="px-4 py-3 md:py-4 text-xl md:text-2xl cursor-pointer text-[#EA7C69] hover:bg-slate-600/50 transition-all duration-200 font-bold"
                >
                  -
                </button>
                <input
                  type="text"
                  value={quantity}
                  onChange={handleQuantityInput}
                  className="w-12 md:w-14 text-center bg-transparent text-white border-none outline-none py-3 md:py-4 font-bold text-lg"
                />
                <button
                  onClick={() => {
                    setQuantity((prev) => Math.max(1, prev + 1));
                    handleQuantityChange(item.id, quantity);
                  }}
                  className="px-4 py-3 md:py-4 text-xl md:text-2xl cursor-pointer text-[#EA7C69] hover:bg-slate-600/50 transition-all duration-200 font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={(e) => {
                // const token = localStorage.getItem("aftoAuthToken");
                // if(!token){
                //   onClose();
                //   return;
                // }
                if (!isInCart && !itemLoading?.[item.id]) {
                  handleAddToCart(e, item);
                }
              }}
              className={`px-6 md:px-8 py-3.5 md:py-4 rounded-2xl flex gap-3 items-center justify-center cursor-pointer transition-all duration-300 text-sm md:text-base font-bold transform hover:scale-105 shadow-lg ${
                itemLoading?.[item.id]
                  ? "bg-[#d68475] cursor-not-allowed opacity-75"
                  : isInCart
                  ? "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-emerald-500/30"
                  : "bg-gradient-to-r from-[#EA7C69] to-[#d66b58] hover:from-[#d66b58] hover:to-[#c55a47] shadow-[#EA7C69]/30"
              }`}
              disabled={itemLoading?.[item.id]}
            >
              {isInCart ? (
                <span className="text-white">✓ Added to Cart</span>
              ) : (
                <>
                  <Plus size={18} className="text-white" />
                  <span className="text-white">
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

export default ItemPopup;
