import React, { useContext, useEffect, useState, useMemo } from "react";
import {
  MapPin,
  Clock,
  Navigation,
  Truck,
  Package,
  ChevronDown,
  AlertCircle,
} from "lucide-react";
import { AppContext } from "../../../../Service/Context/AppContext";

export const Delivery = () => {
  const {
    handleNext,
    deliveryResult,
    restrauntAddress,
    address,
    city,
    pincode,
    state,
    calculateSubtotal,
    setSubtotal,
    items,
    setDeliveryCharge,
    mode,
    setMode,
    setShowPayment,
    subtotal,
    deliveryCharge,
    isDeliveryAvailable,
    setIsDeliveryAvailable
  } = useContext(AppContext);

  function getDeliveryCharge(km, orderValue) {
    if (km < 0) {
      throw new Error("Distance cannot be negative");
    }
    if (km > 30) {
      return 0; // No delivery charge for distances > 30km (delivery not available)
    }
    if (km <= 5) {
      return orderValue >= 50 ? 0 : 6.99;
    }
    if (km <= 10) {
      return 6.99;
    }
    if (km <= 15) {
      return 10.99;
    }
    if (km <= 20) {
      return 14.99;
    }
    if (km <= 30) {
      return 20;
    }
    return 0;
  }

  // Check if delivery is available (distance <= 30km)
  // const [isDeliveryAvailable, setIsDeliveryAvailable] = useState(true);

  useEffect(() => {
    setIsDeliveryAvailable(deliveryResult?.distance_km <= 30);
    // setIsDeliveryAvailable(false);
  }, []);

  useEffect(() => {
    setMode("Pick Up");
  }, []);

  useEffect(() => {
    if (deliveryResult) {
      console.log("API result:", deliveryResult);
    }
  }, [deliveryResult]);

  useEffect(() => {
    if (mode == "Delivery") {
      if (isDeliveryAvailable) {
        setDeliveryCharge(
          getDeliveryCharge(deliveryResult?.distance_km, subtotal) || 0
        );
        setSubtotal(
          calculateSubtotal(
            items,
            getDeliveryCharge(deliveryResult?.distance_km, subtotal) || 0
          )
        );
      } else {
        setDeliveryCharge(0);
        setSubtotal(calculateSubtotal(items, 0));
      }
    } else {
      setDeliveryCharge(0);
      setSubtotal(calculateSubtotal(items, 0));
    }
  }, [mode, deliveryResult, items, isDeliveryAvailable]);

  return (
    <div
      className="h-[65%] w-full overflow-scroll scrollbar-hide p-3 sm:p-6"
      style={{ backgroundColor: "#1F1D2B" }}
    >
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-1 flex items-center gap-2">
          <Truck className="text-[#ea7c69]" size={20} />
          Delivery Options
        </h2>
        <p className="text-gray-300 text-xs sm:text-sm">
          Choose how you'd like to receive your order
        </p>
      </div>

      {/* Toggle Switch */}
      <div className="relative inline-flex bg-gray-800 rounded-lg sm:rounded-xl p-1 sm:p-1.5 mb-4 sm:mb-6 shadow-lg border border-gray-700 w-full sm:w-auto">
        <div
          className={`absolute top-1 sm:top-1.5 bottom-1 sm:bottom-1.5 w-1/2 bg-[#ea7c69] rounded-md sm:rounded-lg shadow-md transition-all duration-300 ease-out ${
            mode === "Delivery" ? "translate-x-full" : "translate-x-0"
          }`}
        />
        <button
          onClick={() => {
            setShowPayment(false);
            setMode("Pick Up");
          }}
          className={`relative z-10 px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-md sm:rounded-lg transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 flex-1 sm:flex-none ${
            mode === "Pick Up" ? "text-white" : "text-gray-300 hover:text-white"
          }`}
        >
          <Package size={12} className="sm:w-3.5 sm:h-3.5" />
          Pick Up
        </button>
        <button
          onClick={() => {
            setShowPayment(false);
            setMode("Delivery");
          }}
          className={`relative z-10 px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-md sm:rounded-lg transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 flex-1 sm:flex-none ${
            mode === "Delivery"
              ? "text-white"
              : "text-gray-300 hover:text-white"
          }`}
        >
          <Truck size={12} className="sm:w-3.5 sm:h-3.5" />
          Delivery
        </button>
      </div>

      {deliveryResult ? (
        <div className="space-y-3 sm:space-y-4">
          {/* Pick Up Mode */}
          {mode === "Pick Up" && (
            <div className="bg-gray-800 rounded-lg sm:rounded-xl border border-gray-700 p-4 sm:p-6 shadow-lg">
              <div className="text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <Package className="text-orange-600" size={20} />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
                  Pick Up Ready
                </h3>
                <p className="text-gray-300 text-xs sm:text-sm mb-3">
                  Your order will be ready for pickup at our restaurant
                  location.
                </p>
                <div className="bg-orange-900/20 rounded-lg p-3 border border-orange-500/30">
                  <div className="flex items-center justify-center gap-2 text-orange-300">
                    <MapPin
                      size={12}
                      className="sm:w-3.5 sm:h-3.5 flex-shrink-0"
                    />
                    <span className="font-medium text-xs sm:text-sm text-center">
                      Pickup Location: {restrauntAddress}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Delivery Mode */}
          {mode === "Delivery" && (
            <>
              {/* Delivery Not Available Message */}
              {!isDeliveryAvailable && (
                <div className="bg-red-900/20 rounded-lg sm:rounded-xl border border-red-500/30 p-4 sm:p-6 shadow-lg">
                  <div className="text-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                      <AlertCircle className="text-red-600" size={20} />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
                      Delivery Not Available
                    </h3>
                    <p className="text-gray-300 text-xs sm:text-sm mb-3">
                      Sorry, we don't deliver to locations more than 30km away
                      from our restaurant.
                    </p>
                    <div className="bg-red-900/30 rounded-lg p-3 border border-red-500/40">
                      <div className="flex items-center justify-center gap-2 text-red-300">
                        <Navigation
                          size={12}
                          className="sm:w-3.5 sm:h-3.5 flex-shrink-0"
                        />
                        <span className="font-medium text-xs sm:text-sm text-center">
                          Distance: {deliveryResult.distance_km} km (Maximum: 30
                          km)
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-400 text-xs sm:text-sm mt-3">
                      Please select "Pick Up" option or choose a different
                      delivery address.
                    </p>
                  </div>
                </div>
              )}

              {/* Delivery Available - Show normal delivery details */}
              {isDeliveryAvailable && (
                <>
                  {/* Delivery Details Card */}
                  <div className="bg-gray-800 rounded-lg sm:rounded-xl border border-gray-700 p-3 sm:p-5 shadow-lg">
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-md sm:rounded-lg flex items-center justify-center">
                        <Navigation className="text-green-600" size={14} />
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-white">
                        Delivery Details
                      </h3>
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-700/50 rounded-lg">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <MapPin className="text-blue-400" size={12} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-medium text-gray-300 block mb-0.5">
                            From Restaurant
                          </span>
                          <span className="text-white font-semibold text-xs sm:text-sm break-words">
                            {restrauntAddress}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-orange-500/10 rounded-lg">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <MapPin className="text-orange-400" size={12} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-medium text-gray-300 block mb-0.5">
                            To Your Location
                          </span>
                          <span className="text-white font-semibold text-xs sm:text-sm break-words">
                            {`${address}, ${city}, ${pincode}, ${state}`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-3 sm:mt-4">
                      <div className="text-center p-2 sm:p-3 bg-gradient-to-br from-blue-500/10 to-blue-600/20 rounded-lg border border-blue-500/30">
                        <Navigation
                          className="text-blue-400 mx-auto mb-1"
                          size={14}
                        />
                        <div className="text-lg sm:text-xl font-bold text-blue-300">
                          {deliveryResult.distance_km}
                        </div>
                        <div className="text-xs font-medium text-blue-400">
                          KM
                        </div>
                      </div>

                      <div className="text-center p-2 sm:p-3 bg-gradient-to-br from-green-500/10 to-green-600/20 rounded-lg border border-green-500/30">
                        <Clock
                          className="text-green-400 mx-auto mb-1"
                          size={14}
                        />
                        <div className="text-lg sm:text-xl font-bold text-green-300">
                          {deliveryResult.duration_min}
                        </div>
                        <div className="text-xs font-medium text-green-400">
                          MIN
                        </div>
                      </div>

                      <div className="text-center p-2 sm:p-3 bg-gradient-to-br from-orange-500/10 to-red-500/20 rounded-lg border border-orange-500/30">
                        <Truck
                          className="text-orange-400 mx-auto mb-1"
                          size={14}
                        />
                        <div className="text-lg sm:text-xl font-bold text-orange-300">
                          {deliveryCharge}
                        </div>
                        <div className="text-xs font-medium text-orange-400">
                          CAD
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Route Map Card */}
                  <div className="bg-gray-800 rounded-lg sm:rounded-xl border border-gray-700 shadow-lg overflow-hidden">
                    <div className="p-2 sm:p-3 border-b border-gray-700">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-purple-500/20 rounded-md sm:rounded-lg flex items-center justify-center">
                          <MapPin className="text-purple-400" size={12} />
                        </div>
                        <h3 className="font-semibold text-white text-xs sm:text-sm">
                          Delivery Route
                        </h3>
                      </div>
                    </div>
                    <div className="relative">
                      <img
                        src={deliveryResult.static_map_url}
                        alt="Delivery route map showing path from restaurant to your location"
                        className="w-full h-auto"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
              <Truck className="text-gray-400" size={24} />
            </div>
            <p className="text-gray-300 text-base sm:text-lg font-medium mb-2">
              No delivery data available
            </p>
            <p className="text-gray-500 text-xs sm:text-sm">
              Select your delivery preferences to see route details
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Delivery;
