import React from "react";

export const PaymentFooter = ({ onCancel, onConfirm }) => {
  return (
    <div className="flex justify-between mt-6">
      <button
        onClick={onCancel}
        className="px-6 cursor-pointer py-2 bg-transparent border border-[#EA7C69] text-[#EA7C69] font-semibold rounded-2xl text-xl flex items-center justify-center"
      >
        Cancel
      </button>
      <button
        onClick={onConfirm}
        className="px-6 cursor-pointer py-4 bg-[#EA7C69] rounded-2xl text-xl flex items-center justify-center hover:bg-[#d68475] font-medium"
      >
        Confirm Payment
      </button>
    </div>
  );
};