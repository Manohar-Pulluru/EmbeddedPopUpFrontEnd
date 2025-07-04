import React from "react";

export const OrderDetailsHeader = ({ selectedOrder }) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="text-xl font-semibold">
          Order Details -{" "}
          {selectedOrder?.orderTransaction?.customerName || "Unknown Customer"}
        </div>
        <div
          className={`text-sm px-4 py-2 rounded-lg ${
            selectedOrder?.orderTransaction?.status === "received"
              ? "bg-[#EA7C69] text-white"
              : "bg-gray-600 text-gray-200"
          }`}
        >
          {selectedOrder?.orderTransaction?.status.charAt(0).toUpperCase() +
            selectedOrder?.orderTransaction?.status.slice(1)}
        </div>
      </div>
      <div className="text-sm text-[#ffffffb4] mt-2">
        <b>Order ID:</b> #{selectedOrder?.orderTransaction?.id || "N/A"}
      </div>
      <div className="text-sm text-[#ffffffb4] mt-1">
        <b>Date:</b>{" "}
        {selectedOrder?.orderTransaction?.createdAt
          ? new Date(selectedOrder?.orderTransaction?.createdAt).toLocaleDateString()
          : "No Date"}
      </div>
      <div className="text-sm text-[#ffffffb4] mt-1 mb-4">
        <b>Whatsapp:</b>{" "}
        {selectedOrder?.orderTransaction?.customerWhatsappNumber || "N/A"}
      </div>
    </>
  );
};