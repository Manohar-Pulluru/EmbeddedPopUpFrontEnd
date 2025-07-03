import React, { useContext } from "react";
import { AppContext } from "../../../../Service/Context/AppContext";

export const OrderSummary = ({
  discount,
  subtotal,
  deliveryCharge,
  handleNext,
  items,
  isLoading,
  isFormValid,
}) => {
  const { activeTab, validationSuccess } = useContext(AppContext);
  const isDisabled =
    items?.length === 0 ||
    isFormValid === false ||
    (activeTab === "Details" && !validationSuccess); // Disable if cart is empty or form is invalid

  return (
    <div className="flex-none h-[160px] sm:h-[25%] w-full flex-col flex p-2 sm:p-4 lg:p-0 lg:pt-3">
      <div className="flex-1 w-full flex flex-col font-medium justify-between sm:justify-evenly gap-2 sm:gap-2">
        {/* <div className="w-full text-sm sm:text-lg lg:text-xl flex justify-between items-center">
          <div className="text-[#ffffffb4]">Discount</div>
          <div>$ {discount.toFixed(2)}</div>
        </div> */}
        <div className="w-full text-sm sm:text-lg lg:text-xl flex justify-between items-center">
          <div className="text-[#ffffffb4]">Order Value</div>
          <div className="font-semibold">
            $ {(subtotal - (deliveryCharge ?? 0)).toFixed(2)}
          </div>
        </div>
        <div className="w-full text-sm sm:text-lg lg:text-xl flex justify-between items-center">
          <div className="text-[#ffffffb4]">Delivery Charge</div>
          <div className="font-semibold">
            $ {(deliveryCharge ?? 0).toFixed(2)}
          </div>
        </div>
        {/* <hr className="border-t border-white " /> */}
        <div className="w-full text-base sm:text-xl lg:text-2xl flex justify-between items-center pt-1 sm:pt-2 border-t border-[#393C49]">
          <div className="text-white font-semibold">Total</div>
          <div className="font-bold">$ {subtotal.toFixed(2)}</div>
        </div>
      </div>
      <div className="mt-3 sm:mt-6 lg:h-[30%] w-full">
        <button
          disabled={isDisabled || isLoading} // Also disable if loading
          onClick={handleNext}
          className={`h-10 sm:h-14 lg:h-full w-full rounded-lg sm:rounded-2xl text-sm sm:text-lg lg:text-xl flex items-center justify-center font-semibold transition-all duration-200 ${
            isDisabled || isLoading
              ? "bg-gray-600 opacity-70 text-white cursor-not-allowed"
              : "bg-[#EA7C69] hover:bg-[#d68475] active:bg-[#c96b5e] text-white cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </div>
          ) : activeTab == "Cart" ? (
            "Next"
          ) :  (activeTab === "Details" && !validationSuccess)  ? (
            "Validate Address to Proceed"
          ) :activeTab == "Delivery" ? (
            "Confirm Order"
          ) : (
            "Next"
          )}
        </button>
      </div>
    </div>
  );
};
