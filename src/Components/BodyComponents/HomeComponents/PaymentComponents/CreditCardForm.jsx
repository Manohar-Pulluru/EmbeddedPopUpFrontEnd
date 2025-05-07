import React from "react";

export const CreditCardForm = ({
  cardholderName,
  setCardholderName,
  cardNumber,
  setCardNumber,
  expirationDate,
  setExpirationDate,
  cvv,
  setCvv,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Cardholder Name</label>
        <input
          type="text"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
          className="w-full py-4 px-4 rounded-2xl border border-[#393C49] text-lg text-md bg-gray-800"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Card Number</label>
        <input
          type="text"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          className="w-full py-4 px-4 rounded-2xl border border-[#393C49] text-lg text-md bg-gray-800"
        />
      </div>
      <div className="flex space-x-4">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Expiration Date</label>
          <input
            type="text"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            className="w-full py-4 px-4 rounded-2xl border border-[#393C49] text-lg text-md bg-gray-800"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">CVV</label>
          <input
            type="text"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            className="w-full py-4 px-4 rounded-2xl border border-[#393C49] text-lg text-md bg-gray-800"
          />
        </div>
      </div>
    </div>
  );
};