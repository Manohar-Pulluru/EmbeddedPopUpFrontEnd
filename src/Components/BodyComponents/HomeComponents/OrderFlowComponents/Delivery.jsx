import React, { useEffect, useState } from "react";

export const Delivery = ({ handleNext, result, origin, destination, calculateSubtotal, setSubtotal, items, setDeliveryCharge}) => {
  const [mode, setMode] = useState("Delivery");

  useEffect(() => {
    if (result) {
      console.log("API result:", result);
    }
  }, [result]);

  useEffect(() => {
    if (mode == "Delivery") {
      setDeliveryCharge(result?.delivery_charge || 0);
      setSubtotal(calculateSubtotal(items, result?.delivery_charge || 0));
    }else{
      setDeliveryCharge(0);
      setSubtotal(calculateSubtotal(items, 0));
    }
  }, [mode]);

  return (
    <div className="h-full w-full overflow-scroll scrollbar-hide sm:block hidden p-8">
      {/* Toggle Switch */}
      <div className="relative inline-flex bg-gray-200 rounded-full p-1 mb-6">
        <div 
          className={`absolute top-1 bottom-1 w-1/2 bg-[#ea7c69] rounded-full shadow-sm transition-transform duration-200 ease-in-out ${
            mode === "Delivery" ? "translate-x-full" : "translate-x-0"
          }`}
        />
        <button
          onClick={() => setMode("Pick Up")}
          className={`relative z-10 px-6 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
            mode === "Pick Up" ? "text-white" : "text-gray-500"
          }`}
        >
          Pick Up
        </button>
        <button
          onClick={() => setMode("Delivery")}
          className={`relative z-10 px-6 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
            mode === "Delivery" ? "text-white" : "text-gray-500"
          }`}
        >
          Delivery
        </button>
      </div>

      {result ? (
        <div className="space-y-6">
          {/* Pick Up Mode */}
          {mode === "Pick Up" && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-gray-600">
                In Pick Up mode, no delivery details to show.
              </p>
            </div>
          )}

          {/* Delivery Mode */}
          {mode === "Delivery" && (
            <>
              <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pick Up Address:</span>
                  <span className="font-medium text-gray-900">{origin}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Your Address:</span>
                  <span className="font-medium text-gray-900">{destination}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Distance:</span>
                  <span className="font-medium text-gray-900">{result.distance_km} km</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium text-gray-900">{result.duration_min} min</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Delivery Charge:</span>
                  <span className="font-semibold text-lg text-gray-900">
                    {result.delivery_charge} {result.currency}
                  </span>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <img
                  src={result.static_map_url}
                  alt="Route map"
                  className="w-full h-auto"
                />
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="h-full flex items-center justify-center">
          <p className="text-gray-500 text-center">
            Select a mode to see details here.
          </p>
        </div>
      )}
    </div>
  );
};

export default Delivery;
