import React from "react";

export const ApplePayForm = ({ email, setEmail, amount, setAmount }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full py-4 px-4 rounded-2xl border border-[#393C49] text-lg text-md bg-gray-800"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Amount</label>
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full py-4 px-4 rounded-2xl border border-[#393C49] text-lg text-md bg-gray-800"
        />
      </div>
      
      {/* Apple Pay Button */}
      <div className="mt-6">
        <button 
          className="w-full py-4 px-4 rounded-2xl bg-black text-white flex items-center justify-center text-lg font-medium hover:bg-gray-900 transition-colors duration-200"
          onClick={() => {
            // Apple Pay integration logic would go here
            console.log("Apple Pay button clicked");
          }}
        >
          <svg 
            className="w-6 h-6 mr-2" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
          Pay with Apple Pay
        </button>
      </div>
    </div>
  );
};
