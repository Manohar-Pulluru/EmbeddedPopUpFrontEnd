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
          {order?.orderTransaction?.customerName || "Unknown Customer"}
        </div>
        <div
          className={`text-sm px-4 py-2 rounded-lg ${
            order?.orderTransaction?.status === "received"
              ? "bg-[#EA7C69] text-white"
              : "bg-gray-600 text-gray-200"
          }`}
        >
          {order?.orderTransaction?.status.charAt(0).toUpperCase() +
            order?.orderTransaction?.status.slice(1)}
        </div>
      </div>
      <div className="text-sm text-[#ffffffb4] mt-1">
        <b>Order ID:</b> #{order?.orderTransaction?.id || "N/A"}
      </div>
      <div className="text-sm text-[#ffffffb4] mt-1">
        <b>Date:</b>{" "}
        {order?.orderTransaction?.createdAt
          ? new Date(order?.orderTransaction?.createdAt).toLocaleDateString()
          : "No Date"}
      </div>
      <div className="text-sm text-[#ffffffb4] mt-1">
        <b>Items:</b> {order?.orderTransaction?.numberOfItems || "0"}
      </div>
      <div className="text-xl font-semibold w-full text-right absolute right-2 bottom-2 mt-2">
        Total: ${order?.orderTransaction?.totalOrder || "0.00"}
      </div>
    </div>
  );
};
