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
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0.75 5C0.75 2.37665 2.87665 0.25 5.5 0.25H17.5C20.1234 0.25 22.25 2.37665 22.25 5V11C22.25 13.6234 20.1234 15.75 17.5 15.75H5.5C2.87665 15.75 0.75 13.6234 0.75 11V5ZM2.33697 4.25H20.663C20.3245 2.81665 19.0368 1.75 17.5 1.75H5.5C3.96321 1.75 2.67555 2.81665 2.33697 4.25ZM20.75 5.75H2.25V11C2.25 12.7949 3.70507 14.25 5.5 14.25H17.5C19.2949 14.25 20.75 12.7949 20.75 11V5.75ZM12.75 11C12.75 10.5858 13.0858 10.25 13.5 10.25H17.5C17.9142 10.25 18.25 10.5858 18.25 11C18.25 11.4142 17.9142 11.75 17.5 11.75H13.5C13.0858 11.75 12.75 11.4142 12.75 11Z"
              fill="white"
            />
          </svg>
          <span>Credit Card</span>
        </button>
        <button
          className={`flex-1 h-24 cursor-not-allowed flex items-center flex-col gap-2 justify-center p-2 rounded-lg relative ${
            paymentMethod === "Apple Pay"
              ? "border-[#ffffff] border text-white"
              : "border-gray-700 border text-gray-300"
          }`}
          disabled={true}
          onClick={() => setPaymentMethod("Apple Pay")}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"
              fill="white"
            />
          </svg>
          <span>Apple Pay</span>
          <div className="absolute inset-0 bg-black/50 bg-opacity-70 flex items-center justify-center rounded-lg">
            {/* <span className="text-white text-sm font-medium">Not Available</span> */}
          </div>
        </button>
        <button
          className={`flex-1 h-24 flex items-center flex-col gap-2 justify-center p-2 rounded-lg relative cursor-not-allowed ${
            paymentMethod === "Google Pay"
              ? "border-[#ffffff] border text-white"
              : "border-gray-700 border text-gray-300"
          }`}
          disabled={true}
          onClick={() => setPaymentMethod("Google Pay")}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"
              fill="#4285F4"
            />
            <path
              d="M5.277 14.268l-.855-6.649L1.306 9.71C-.435 11.746 0 14.268 0 14.268s.52 2.982 2.117 5.059l3.16-2.441z"
              fill="#34A853"
            />
            <path
              d="M5.277 14.268C6.154 16.861 8.945 18.8 12.24 18.8c2.416 0 4.445-.79 5.934-2.142l-2.904-2.259c-.806.54-1.823.865-3.03.865-2.33 0-4.302-1.547-5.025-3.627l-1.938 2.631z"
              fill="#FBBC05"
            />
            <path
              d="M20.174 12c0-.788-.085-1.39-.189-1.989H12.24V14.4h4.507c-.197 1.018-.79 1.883-1.683 2.442l2.904 2.259C19.368 17.701 20.174 15.134 20.174 12z"
              fill="#EA4335"
            />
          </svg>
          <span>Google Pay</span>
          <div className="absolute inset-0 bg-black/50 bg-opacity-70 flex items-center justify-center rounded-lg">
            {/* <span className="text-white text-sm font-medium">Not Available</span> */}
          </div>
        </button>
      </div>
    </div>
  );
};
