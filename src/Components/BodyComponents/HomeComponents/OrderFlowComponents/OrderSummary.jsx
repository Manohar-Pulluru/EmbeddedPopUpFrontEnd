import React, { useContext, useState } from "react";
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
  const { activeTab, validationSuccess, isDeliveryAvailable, mode } =
    useContext(AppContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isDisabled =
    items?.length === 0 ||
    isFormValid === false ||
    (activeTab === "Details" && !validationSuccess) ||
    (activeTab === "Delivery" && !isDeliveryAvailable && mode == "Delivery");

  const deliveryCharges = [
    {
      range: "0-5km",
      charge: "$4.99 (Free delivery for orders $50 and above)",
    },
    { range: "5-10km", charge: "$6.99" },
    { range: "10-15km", charge: "$10.99" },
    { range: "15-20km", charge: "$14.99" },
    { range: "20-30km", charge: "$20" },
  ];

  return (
    <div className="h-fit sm:h-fit w-full flex-col flex p-2 sm:p-4 lg:p-0 lg:pt-3">
      <div className=" w-full flex flex-col font-medium justify-between sm:justify-evenly gap-2 sm:gap-2">
        {["Cart", "Details"].includes(activeTab) ? null : (
          <>
            <div className="w-full text-sm sm:text-lg lg:text-xl flex justify-between items-center">
              <div className="text-[#ffffffb4]">Order Value</div>
              <div className="font-semibold">
                $ {(subtotal - (deliveryCharge ?? 0)).toFixed(2)}
              </div>
            </div>
            <div className="w-full text-sm sm:text-lg lg:text-xl flex justify-between items-center">
              <div className="flex items-center gap-2 text-[#ffffffb4]">
                Delivery Charge
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-[#ffffffb4] hover:text-white ml-2 cursor-pointer focus:outline-none"
                >
                  ⓘ
                </button>
              </div>
              <div className="font-semibold">
                $ {(deliveryCharge ?? 0).toFixed(2)}
              </div>
            </div>
          </>
        )}

        <div
          className={`w-full text-base sm:text-xl lg:text-2xl flex justify-between items-center pt-1 sm:pt-2 ${
            ["Cart", "Details"].includes(activeTab) ? "border-t-0" : "border-t"
          } border-[#393C49]`}
        >
          <div className="text-white font-semibold">Total</div>
          <div className="font-bold">$ {subtotal.toFixed(2)}</div>
        </div>
      </div>
      <div className="mt-3 sm:mt-6 lg:h-16 w-full">
        <button
          disabled={isDisabled || isLoading}
          onClick={handleNext}
          className={`h-10 sm:h-14 lg:h-full w-full rounded-lg sm:rounded-2xl text-sm sm:text-lg lg:text-xl flex items-center justify-center font-semibold transition-all duration-200 ${
            isDisabled || isLoading
              ? "bg-gray-600 opacity-70 text-white cursor-not-allowed"
              : "bg-[#EA7C69] hover:bg-[#d68475] active:bg-[#c96b5e] text-white cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
          }`}
        >
          {isLoading ? (
            <div className="w-full flex items-center justify-center gap-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </div>
          ) : activeTab === "Cart" ? (
            "Next"
          ) : activeTab === "Details" && !validationSuccess ? (
            "Validate Address to Proceed"
          ) : activeTab === "Delivery" ? (
            "Proceed To Payment"
          ) : (
            "Next"
          )}
        </button>
      </div>

      {/* Modal for Delivery Charges */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.7)] bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1F1D2B] p-6 rounded-lg max-w-md w-full mx-4 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 cursor-pointer text-[#ffffffb4] hover:scale-110 hover:shadow-2xl shadow-white hover:text-white text-xl font-bold focus:outline-none"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_986_275)">
                  <path
                    d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                    fill="#ffffff"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_986_275">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </button>
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4">
              Delivery Charges
            </h2>
            <div className="space-y-3">
              {deliveryCharges.map(({ range, charge }, index) => (
                <div
                  key={index}
                  className="flex justify-between text-sm sm:text-base text-[#ffffffb4]"
                >
                  <span>{range}</span>
                  <span>{charge}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
