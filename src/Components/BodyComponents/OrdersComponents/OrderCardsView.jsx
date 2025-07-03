import React from "react";
import { OrderCard } from "./OrderCard";

export const OrderCardsView = ({ orders, setSelectedOrder }) => {
  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide">
      {orders.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {orders.map((order, index) => (
            <OrderCard
              key={index}
              order={order.data}
              index={index}
              onClick={setSelectedOrder}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-[#ffffffaf] text-xl">
          No orders found
        </div>
      )}
    </div>
  );
};
