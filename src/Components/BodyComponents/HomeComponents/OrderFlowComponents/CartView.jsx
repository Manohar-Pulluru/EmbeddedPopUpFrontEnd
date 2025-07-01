import React, { useContext, useState, useEffect } from "react";
import { CartItem } from "./CartItem";
import { AppContext } from "../../../../Service/Context/AppContext";
import { getCartItems } from "../../../../Service/api";

export const CartView = () => {
  const {
    items,
    setItems,
    handleQuantityChange,
    handleNoteChange,
    handleDelete,
  } = useContext(AppContext);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cartOrderId = localStorage.getItem("cartOrderId");
    if (!cartOrderId) {
      setLoading(false);
      return;
    }

    getCartItems(cartOrderId)
      .then((response) => {
        const normalized = (response.orderItems || []).map((i) => ({
          id: i.id,
          // itemId: i.productRetailerId,
          itemId: i.itemId,
          itemName: i.itemName,
          // convert the string price to a number
          itemRegPrice: parseFloat(i.itemRegPrice) || 0,
          // align naming
          imageURL: i.imageUrl,
          quantity: i.quantity,
          // precompute total if you like
          totalPrice: (parseFloat(i.itemRegPrice) || 0) * i.quantity,
        }));
        setItems(normalized);
        // // response.orderItems holds the array from your curl
        // setItems(response.orderItems || []);
        console.log("Order Items: ", items);
      })
      .catch((err) => {
        console.error("Failed to load cart:", err);
        setError("Unable to fetch cart items");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        Loading cart…
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="h-[65%] w-full flex flex-col">
      <div className="w-full h-14 pt-2 flex items-center font-semibold text-base md:text-base">
        <div className="w-[70%] h-full text-sm md:text-base">Item</div>
        <div className="w-[13%] h-full text-center text-sm md:text-base">
          Qty
        </div>
        <div className="w-[17%] h-full text-center text-sm md:text-base">
          Price
        </div>
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
          <div className="w-full h-full flex items-center justify-center text-[#ffffffaf] text-lg md:text-xl">
            No items in the cart
          </div>
        )}
      </div>
    </div>
  );
};
