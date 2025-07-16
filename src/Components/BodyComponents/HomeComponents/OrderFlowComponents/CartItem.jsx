import React, { useContext } from "react";
import Icon from "../../../../assets/Icon";
import icons from "../../../../assets/icons.json";
import { AppContext } from "../../../../Service/Context/AppContext";

export const CartItem = ({
  item,
  handleQuantityChange,
  handleNoteChange,
  handleDelete,
}) => {
  const { removeItemLocal } = useContext(AppContext);

  const unitPrice = parseFloat(item.itemRegPrice) || 0;
  const qty = parseInt(item.quantity, 10) || 0;
  const total = unitPrice * qty;
  return (
    <div className="w-full flex flex-col gap-3 py-3 px-2 sm:px-0">
      <div className="w-full flex items-center gap-2 sm:gap-4">
        <div className="flex items-center flex-1 min-w-0">
          <div className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 overflow-hidden rounded-full bg-white flex-shrink-0">
            <img
              className="h-full w-full rounded-full object-cover"
              src={item.imageURL}
              alt={item.itemName || "Item Image"}
            />
          </div>
          <div className="flex-1 flex flex-col font-semibold pl-2 sm:pl-3 md:pl-4 min-w-0">
            <div className="text-sm sm:text-base md:text-lg truncate">
              {item.itemName
                ? item.itemName.length > 20
                  ? item.itemName.substring(0, 15) + "..."
                  : item.itemName
                : "Unnamed Item"}
            </div>
            <div className="text-[#ffffff6b] text-xs sm:text-sm md:text-base">
              $ {unitPrice.toFixed(2)}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between bg-[#252836] border border-[#393C49] rounded-xl sm:rounded-2xl px-2 sm:px-3 py-1 sm:py-2 min-w-[72px] sm:min-w-[84px]">
          <button
            onClick={() => {
              console.log("item", item.id);
              handleQuantityChange(item.id, item.quantity - 1);
            }}
            className="text-[#EA7C69] font-bold text-sm sm:text-base w-6 h-6 flex items-center justify-center"
          >
            -
          </button>
          <input
            value={item.quantity}
            onChange={(e) => handleQuantityChange(item.id, e.target.value)}
            className="w-6 sm:w-8 text-center bg-transparent border-none focus:outline-none text-white text-sm sm:text-base"
            min="1"
          />
          <button
            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
            className="text-[#EA7C69] font-bold text-sm sm:text-base w-6 h-6 flex items-center justify-center"
          >
            +
          </button>
        </div>
        <div className="text-center text-sm sm:text-base md:text-lg flex items-center justify-center font-semibold min-w-[60px] sm:min-w-[80px]">
          $ {total.toFixed(2)}
        </div>
      </div>
      <div className="w-full flex items-center gap-2 sm:gap-4">
        <input
          placeholder="Order Note"
          value={item.note || ""}
          onChange={(e) => handleNoteChange(item.id, e.target.value)}
          className="flex-1 rounded-xl sm:rounded-2xl border border-[#393C49] bg-[#252836] focus:outline-none focus:border-[#EA7C69] placeholder:text-[#ffffff6b] px-3 sm:px-4 text-white text-sm sm:text-base h-10 sm:h-12"
        />
        <div
          className="aspect-square flex items-center justify-center rounded-xl sm:rounded-2xl h-10 sm:h-12 w-10 sm:w-12 border border-[#FF7CA3] cursor-pointer hover:bg-[#FF7CA3] hover:bg-opacity-10 transition-colors duration-200 flex-shrink-0"
          onClick={() => {
            // removeItemLocal(item.itemId);
            console.log("CA item", item);
            handleDelete(item);
          }}
        >
          <Icon name={icons.delete} />
        </div>
      </div>
    </div>
  );
};
