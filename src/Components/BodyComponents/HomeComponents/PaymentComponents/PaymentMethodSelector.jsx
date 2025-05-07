import React from "react";

export const PaymentMethodSelector = ({ paymentMethod, setPaymentMethod }) => {
  return (
    <div className="mb-4 border-t border-[#ea7c6965] pt-8">
      <h3 className="text-xl font-medium mb-2">Payment Method</h3>
      <div className="flex space-x-4">
        <button
          className={`flex-1 h-24 cursor-pointer flex items-center flex-col gap-2 justify-center p-2 rounded-lg ${
            paymentMethod === "Credit Card"
              ? "border-[#ffffff] border text-white"
              : "border-gray-700 border text-gray-300"
          }`}
          onClick={() => setPaymentMethod("Credit Card")}
        >
          <svg
            width="23"
            height="16"
            viewBox="0 0 23 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M0.75 5C0.75 2.37665 2.87665 0.25 5.5 0.25H17.5C20.1234 0.25 22.25 2.37665 22.25 5V11C22.25 13.6234 20.1234 15.75 17.5 15.75H5.5C2.87665 15.75 0.75 13.6234 0.75 11V5ZM2.33697 4.25H20.663C20.3245 2.81665 19.0368 1.75 17.5 1.75H5.5C3.96321 1.75 2.67555 2.81665 2.33697 4.25ZM20.75 5.75H2.25V11C2.25 12.7949 3.70507 14.25 5.5 14.25H17.5C19.2949 14.25 20.75 12.7949 20.75 11V5.75ZM12.75 11C12.75 10.5858 13.0858 10.25 13.5 10.25H17.5C17.9142 10.25 18.25 10.5858 18.25 11C18.25 11.4142 17.9142 11.75 17.5 11.75H13.5C13.0858 11.75 12.75 11.4142 12.75 11Z"
              fill="white"
            />
          </svg>
          <span>Credit Card</span>
        </button>
        <button
          className={`flex-1 h-24 cursor-pointer flex items-center flex-col gap-2 justify-center p-2 rounded-lg ${
            paymentMethod === "Paypal"
              ? "border-[#ffffff] border text-white"
              : "border-gray-700 border text-gray-300"
          }`}
          onClick={() => setPaymentMethod("Paypal")}
        >
          <svg
            width="25"
            height="24"
            viewBox="0 0 25 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 7.2C19.7 8.2 20.5 10 20.5 12C20.5 14.5 18 16.5 15.5 16.5H12.9L12.3 20.1C12.2532 20.3293 12.1276 20.5349 11.9449 20.6811C11.7621 20.8272 11.5339 20.9047 11.3 20.9H8.6C8.52501 20.9015 8.45064 20.8861 8.38239 20.855C8.31415 20.8239 8.25378 20.7778 8.20577 20.7202C8.15775 20.6626 8.12331 20.5949 8.105 20.5222C8.08669 20.4494 8.08498 20.3735 8.1 20.3L8.3 18.9M10.5 13H13C15.5 13 18 10.5 18 8C18 5 16.1 3 13 3H7.5C7 3 6.5 3.5 6.5 4L4.5 18C4.5 18.5 5 19 5.5 19H8.3L9.5 14C9.6 13.4 9.9 13 10.5 13Z"
              stroke="#ffffff"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          Paypal
        </button>
        <button
          className={`flex-1 h-24 cursor-pointer flex items-center flex-col gap-2 justify-center p-2 rounded-lg ${
            paymentMethod === "Cash"
              ? "border-[#ffffff] border text-white"
              : "border-gray-700 border text-gray-300"
          }`}
          onClick={() => setPaymentMethod("Cash")}
        >
          <svg
            width="21"
            height="20"
            viewBox="0 0 21 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.688 0.5C17.8978 0.5 20.5 3.16116 20.5 6.44374V13.5563C20.5 16.8388 17.8978 19.5 14.688 19.5H6.31204C3.10219 19.5 0.5 16.8388 0.5 13.5563V6.44374C0.5 3.16116 3.10219 0.5 6.31204 0.5H14.688ZM14.688 1.98651H6.31204C3.90498 1.98651 1.95358 3.98213 1.95358 6.44374V13.5563C1.95358 16.0179 3.90498 18.0135 6.31204 18.0135H14.688C17.095 18.0135 19.0464 16.0179 19.0464 13.5563L19.046 13.279L15.8499 13.2798C14.0084 13.2787 12.5159 11.7531 12.5147 9.86949C12.5147 8.04914 13.9101 6.56244 15.6673 6.46431L15.8504 6.45916L19.046 6.459L19.0464 6.44374C19.0464 4.05454 17.2081 2.10431 14.8991 1.99165L14.688 1.98651ZM19.046 7.945L15.8508 7.94567C14.8109 7.94632 13.9683 8.80743 13.9683 9.86904C13.9689 10.8811 14.7329 11.7102 15.7033 11.7874L15.8504 11.7933L19.046 11.793V7.945ZM16.2942 9.06518C16.6956 9.06518 17.021 9.39795 17.021 9.80844C17.021 10.1847 16.7475 10.4957 16.3928 10.5449L16.2942 10.5517H15.9921C15.5907 10.5517 15.2653 10.2189 15.2653 9.80844C15.2653 9.43215 15.5388 9.12118 15.8935 9.07196L15.9921 9.06518H16.2942ZM10.8539 4.99736C11.2553 4.99736 11.5807 5.33013 11.5807 5.74062C11.5807 6.1169 11.3073 6.42788 10.9525 6.47709L10.8539 6.48388H5.62203C5.22063 6.48388 4.89524 6.15111 4.89524 5.74062C4.89524 5.36434 5.16866 5.05337 5.5234 5.00415L5.62203 4.99736H10.8539Z"
              fill="#ffffff"
            />
          </svg>
          Cash
        </button>
      </div>
    </div>
  );
};