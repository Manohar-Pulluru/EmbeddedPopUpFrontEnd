import React, { useEffect, useState } from "react";
import { MapPin, Clock, Navigation, Truck, Package } from "lucide-react";

export const Delivery = ({ handleNext, result, origin, destination, calculateSubtotal, setSubtotal, items, setDeliveryCharge, mode, setMode}) => {

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
    <div className="h-full w-full overflow-scroll scrollbar-hide sm:block hidden p-6" style={{backgroundColor: '#1F1D2B'}}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
          <Truck className="text-[#ea7c69]" size={24} />
          Delivery Options
        </h2>
        <p className="text-gray-300 text-sm">Choose how you'd like to receive your order</p>
      </div>

      {/* Toggle Switch */}
      <div className="relative inline-flex bg-gray-800 rounded-xl p-1.5 mb-6 shadow-lg border border-gray-700">
        <div 
          className={`absolute top-1.5 bottom-1.5 w-1/2 bg-[#ea7c69] rounded-lg shadow-md transition-all duration-300 ease-out ${
            mode === "Delivery" ? "translate-x-full" : "translate-x-0"
          }`}
        />
        <button
          onClick={() => setMode("Pick Up")}
          className={`relative z-10 px-6 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 ${
            mode === "Pick Up" ? "text-white" : "text-gray-300 hover:text-white"
          }`}
        >
          <Package size={14} />
          Pick Up
        </button>
        <button
          onClick={() => setMode("Delivery")}
          className={`relative z-10 px-6 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 ${
            mode === "Delivery" ? "text-white" : "text-gray-300 hover:text-white"
          }`}
        >
          <Truck size={14} />
          Delivery
        </button>
      </div>

      {result ? (
        <div className="space-y-4">
          {/* Pick Up Mode */}
          {mode === "Pick Up" && (
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 shadow-lg">
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Package className="text-orange-600" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Pick Up Ready</h3>
                <p className="text-gray-300 text-sm mb-3">
                  Your order will be ready for pickup at our restaurant location.
                </p>
                <div className="bg-orange-900/20 rounded-lg p-3 border border-orange-500/30">
                  <div className="flex items-center justify-center gap-2 text-orange-300">
                    <MapPin size={14} />
                    <span className="font-medium text-sm">Pickup Location: {origin}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Delivery Mode */}
          {mode === "Delivery" && (
            <>
              {/* Delivery Details Card */}
              <div className="bg-gray-800 rounded-xl border border-gray-700 p-5 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Navigation className="text-green-600" size={18} />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Delivery Details</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-gray-700/50 rounded-lg">
                    <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MapPin className="text-blue-400" size={14} />
                    </div>
                    <div className="flex-1">
                      <span className="text-xs font-medium text-gray-300 block mb-0.5">From Restaurant</span>
                      <span className="text-white font-semibold text-sm">{origin}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-orange-500/10 rounded-lg">
                    <div className="w-6 h-6 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MapPin className="text-orange-400" size={14} />
                    </div>
                    <div className="flex-1">
                      <span className="text-xs font-medium text-gray-300 block mb-0.5">To Your Location</span>
                      <span className="text-white font-semibold text-sm">{destination}</span>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="text-center p-3 bg-gradient-to-br from-blue-500/10 to-blue-600/20 rounded-lg border border-blue-500/30">
                    <Navigation className="text-blue-400 mx-auto mb-1" size={18} />
                    <div className="text-xl font-bold text-blue-300">{result.distance_km}</div>
                    <div className="text-xs font-medium text-blue-400">KM</div>
                  </div>
                  
                  <div className="text-center p-3 bg-gradient-to-br from-green-500/10 to-green-600/20 rounded-lg border border-green-500/30">
                    <Clock className="text-green-400 mx-auto mb-1" size={18} />
                    <div className="text-xl font-bold text-green-300">{result.duration_min}</div>
                    <div className="text-xs font-medium text-green-400">MIN</div>
                  </div>
                  
                  <div className="text-center p-3 bg-gradient-to-br from-orange-500/10 to-red-500/20 rounded-lg border border-orange-500/30">
                    <Truck className="text-orange-400 mx-auto mb-1" size={18} />
                    <div className="text-xl font-bold text-orange-300">{result.delivery_charge}</div>
                    <div className="text-xs font-medium text-orange-400">CAD</div>
                  </div>
                </div>
              </div>

              {/* Route Map Card */}
              <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-lg overflow-hidden">
                <div className="p-3 border-b border-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <MapPin className="text-purple-400" size={14} />
                    </div>
                    <h3 className="font-semibold text-white text-sm">Delivery Route</h3>
                  </div>
                </div>
                <div className="relative">
                  <img
                    src={result.static_map_url}
                    alt="Delivery route map showing path from restaurant to your location"
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
              <Truck className="text-gray-400" size={28} />
            </div>
            <p className="text-gray-300 text-lg font-medium mb-2">No delivery data available</p>
            <p className="text-gray-500 text-sm">Select your delivery preferences to see route details</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Delivery;
