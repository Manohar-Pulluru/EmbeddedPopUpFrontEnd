import React, { useContext } from "react";
import { CartItem } from "./CartItem";
import { AppContext } from "../../../../Service/Context/AppContext";

export const CartView = () => {
  const { items, handleQuantityChange, handleNoteChange, handleDelete } =
    useContext(AppContext);
  return (
    <div className="h-[65%] w-full flex flex-col">
      <div className="w-full h-16 pt-2 flex items-center font-semibold">
        <div className="w-[70%] h-full">Item</div>
        <div className="w-[13%] h-full text-center">Qty</div>
        <div className="w-[17%] h-full text-center">Price</div>
      </div>
      <div className="w-full flex-1 overflow-y-scroll flex flex-col gap-4 scrollbar-hide">
        {items.length > 0 ? (
          items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              handleQuantityChange={handleQuantityChange}
              handleNoteChange={handleNoteChange}
              handleDelete={handleDelete}
            />
          ))
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#ffffffaf] text-xl">
            No items in the cart
          </div>
        )}
      </div>
    </div>
  );
};
