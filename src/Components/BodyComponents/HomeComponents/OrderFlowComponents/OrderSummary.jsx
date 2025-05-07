import React from "react";

export const OrderSummary = ({ discount, subtotal, handleNext }) => {
  return (
    <div className="h-[25%] w-full flex-col flex">
      <div className="h-[70%] w-full flex flex-col font-medium justify-evenly">
        <div className="w-full text-xl flex justify-between">
          <div className="text-[#ffffffb4]">Discount</div>
          <div>$ {discount.toFixed(2)}</div>
        </div>
        <div className="w-full text-xl flex justify-between">
          <div className="text-[#ffffffb4]">Sub Total</div>
          <div>$ {subtotal.toFixed(2)}</div>
        </div>
      </div>
      <div className="h-[30%] w-full">
        <div
          onClick={handleNext}
          className="h-full w-full bg-[#EA7C69] rounded-2xl text-xl flex items-center justify-center hover:bg-[#d68475] font-medium cursor-pointer"
        >
          Next
        </div>
      </div>
    </div>
  );
};