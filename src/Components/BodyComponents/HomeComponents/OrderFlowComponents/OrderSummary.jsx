import React from "react";

export const OrderSummary = ({ discount, subtotal, deliveryCharge, handleNext, items, isLoading, isFormValid }) => {
  const isDisabled = items?.length === 0 || (isFormValid === false); // Disable if cart is empty or form is invalid

  return (
    <div className="h-[25%] w-full flex-col flex">
      <div className="h-[70%] w-full flex flex-col font-medium justify-evenly">
        {/* <div className="w-full text-xl flex justify-between">
          <div className="text-[#ffffffb4]">Discount</div>
          <div>$ {discount.toFixed(2)}</div>
        </div> */}
        <div className="w-full text-xl flex justify-between">
          <div className="text-[#ffffffb4]">Order Value</div>
          <div>$ {(subtotal - (deliveryCharge ?? 0)).toFixed(2)}</div>
        </div>
        <div className="w-full text-xl flex justify-between">
          <div className="text-[#ffffffb4]">Delivery Charge</div>
          <div>$ {(deliveryCharge ?? 0).toFixed(2)}</div>
        </div>
        <div className="w-full text-xl flex justify-between">
          <div className="text-[#ffffffb4]">Sub Total</div>
          <div>$ {subtotal.toFixed(2)}</div>
        </div>

      </div>
      <div className="h-[30%] w-full">
        <button
          disabled={isDisabled || isLoading} // Also disable if loading
          onClick={handleNext}
          className={`h-full w-full rounded-2xl text-xl flex items-center justify-center font-medium transition-all duration-200 ${
            isDisabled || isLoading
              ? "bg-[#EA7C69] opacity-70 text-white cursor-not-allowed"
              : "bg-[#EA7C69] hover:bg-[#d68475] text-white cursor-pointer"
          }`}
        >
          {isLoading ? "Processing..." : "Next"}
        </button>
      </div>
    </div>
  );
};
