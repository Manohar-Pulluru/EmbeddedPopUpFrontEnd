import React from "react";

export const OrderCard = ({ order, index, onClick }) => {
  console.log("order:", order);
  return (
    <div
      onClick={() => onClick(order)}
      className="cursor-pointer w-[100%] relative bg-[#252836] p-4 rounded-2xl border border-[#393C49] hover:bg-[#2a2b3d] transition-colors shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div className="text-lg font-medium">
          {order?.customerName || "Unknown Customer"}
        </div>

      </div>
      <div className="text-sm text-[#ffffffb4] mt-1">
        <b>Order ID:</b> #{order?.id || "N/A"}
      </div>
      <div className="text-sm text-[#ffffffb4] mt-1">
        <b>Date:</b>{" "}
        {order?.createdAt
          ? new Date(order?.createdAt).toLocaleDateString()
          : "No Date"}
      </div>
      <div className="text-sm text-[#ffffffb4] mt-1">
        <b>Items:</b> {order?.numberOfItems || "0"}
      </div>
      <div className="text-xl font-semibold w-full text-right absolute right-2 bottom-2 mt-2">
        Total: ${order?.totalOrder || "0.00"}
      </div>
    </div>
  );
};
