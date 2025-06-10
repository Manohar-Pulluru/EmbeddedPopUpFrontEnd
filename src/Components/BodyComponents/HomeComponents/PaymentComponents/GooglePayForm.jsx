import React from "react";

export const GooglePayForm = ({ amount, setAmount }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Amount</label>
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full py-4 px-4 rounded-2xl border border-[#393C49] text-lg text-md bg-gray-800"
        />
      </div>
      
      {/* Google Pay Button */}
      <div className="mt-6">
        <button 
          className="w-full py-4 px-4 rounded-2xl bg-white text-black flex items-center justify-center text-lg font-medium hover:bg-gray-100 transition-colors duration-200 border border-gray-300"
          onClick={() => {
            // Google Pay integration logic would go here
            console.log("Google Pay button clicked");
          }}
        >
          <svg 
            className="w-6 h-6 mr-2" 
            viewBox="0 0 24 24" 
            fill="none"
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
          Pay with Google Pay
        </button>
      </div>
    </div>
  );
};
