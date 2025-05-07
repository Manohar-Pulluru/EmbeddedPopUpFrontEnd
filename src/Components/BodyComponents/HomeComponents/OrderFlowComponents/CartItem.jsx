import React from "react";
import Icon from "../../../../assets/Icon";
import icons from "../../../../assets/icons.json";

export const CartItem = ({
  item,
  handleQuantityChange,
  handleNoteChange,
  handleDelete,
}) => {
  return (
    <div className="w-full h-36 flex flex-col">
      <div className="w-full h-[50%] p-2 flex">
        <div className="w-[70%] h-full flex">
          <div className="h-full aspect-square overflow-hidden rounded-full p-0.5 bg-white">
            <img
              className="h-full w-full rounded-full"
              src={item.imageURL}
              alt={item.itemName || "Item Image"}
            />
          </div>
          <div className="flex-1 flex flex-col font-semibold pl-4">
            <div className="w-full h-[60%] text-lg text-nowrap">
              {item.itemName
                ? item.itemName.length > 25
                  ? item.itemName.substring(0, 20) + "..."
                  : item.itemName
                : "Unnamed Item"}
            </div>
            <div className="w-full h-[40%] flex text-right text-[#ffffff6b]">
              $ {(parseFloat(item.regPrice) || 0).toFixed(2)}
            </div>
          </div>
        </div>
        <div className="w-[13%] h-full text-center text-lg bg-[#252836] border border-[#393C49] rounded-2xl flex items-center justify-between px-2">
          <button
            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
            className="text-[#EA7C69] font-bold"
          >
            -
          </button>
          <input
            value={item.quantity}
            onChange={(e) => handleQuantityChange(item.id, e.target.value)}
            className="w-8 text-center bg-transparent border-none focus:outline-none text-white"
            min="1"
          />
          <button
            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
            className="text-[#EA7C69] font-bold"
          >
            +
          </button>
        </div>
        <div className="w-[17%] h-full text-center text-lg flex items-center justify-center">
          $ {item.totalPrice.toFixed(2)}
        </div>
      </div>
      <div className="w-full h-[50%] p-2 flex">
        <input
          placeholder="Order Note"
          value={item.note || ""}
          onChange={(e) => handleNoteChange(item.id, e.target.value)}
          className="w-[83%] rounded-2xl border border-[#393C49] h-full bg-[#252836] focus:outline-none placeholder:text-white px-4 text-white"
        />
        <div className="flex-1 flex justify-center">
          <div
            className="aspect-square flex items-center justify-center rounded-2xl h-full border border-[#FF7CA3] cursor-pointer"
            onClick={() => handleDelete(item.id)}
          >
            <Icon name={icons.delete} />
          </div>
        </div>
      </div>
    </div>
  );
};