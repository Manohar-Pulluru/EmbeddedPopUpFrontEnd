import React from "react";

export const OrderSummary = ({ orderTransaction }) => {
  return (
    <div className="mt-6 flex justify-end">
      <div className="p-4 rounded-xl w-full sm:w-1/2">
        <div className="text-lg font-medium text-right">Order Summary</div>
        <div className="text-sm text-[#ffffffb4] mt-2 text-right">
          Subtotal: ${orderTransaction.orderValueSubTotal || "0.00"}
        </div>
        <div className="text-sm text-[#ffffffb4] mt-1 text-right">
          Tax: ${orderTransaction.orderTax || "0.00"}
        </div>
        <div className="text-lg font-medium mt-2 text-right">
          Total: ${orderTransaction.totalOrder || "0.00"}
        </div>
      </div>
    </div>
  );
};