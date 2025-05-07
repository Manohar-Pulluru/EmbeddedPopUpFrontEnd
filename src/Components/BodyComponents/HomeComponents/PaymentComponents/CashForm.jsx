import React from "react";

export const CashForm = ({ amount, setAmount }) => {
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
      <div>
        <label className="block text-sm font-medium mb-1">Cash Note</label>
        <textarea
          placeholder="Enter Note"
          className="w-full py-4 px-4 rounded-2xl border border-[#393C49] text-lg text-md bg-gray-800 resize-none"
        />
      </div>
    </div>
  );
};