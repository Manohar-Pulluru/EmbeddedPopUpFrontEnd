import React, { useContext, useEffect, useState } from "react";
import { ArrowLeft, Download, MapPin, Navigation } from "lucide-react";
import { AppContext } from "../../../Service/Context/AppContext";

// Component to display individual order details
export const OrderDetailsView = ({ fullOrderData, onBack }) => {
  const [imageError, setImageError] = useState(false);

  if (!fullOrderData?.orderData) {
    return <div className="text-white p-4">No order data available</div>;
  }

  const { businessData } = useContext(AppContext);
  const {
    orderData,
    orderItems = [],
    deliveryData = {},
  } = fullOrderData;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const openMapInNewTab = () => {
    const origin = encodeURIComponent(businessData?.address ?? "");
    const destination = encodeURIComponent(
      `${deliveryData?.validatedAddress ?? ""}, ${deliveryData?.city ?? ""}, ${deliveryData?.pincode ?? ""}`
    );
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
    window.open(googleMapsUrl, "_blank");
  };

  useEffect(() => {
    console.log("restaurant address", businessData?.address);
    console.log("Order Details View Mounted", deliveryData?.mapImageLink);
  }, []);

  return (
    <div className="h-full w-full bg-[#252836] text-white p-4 overflow-scroll scrollbar-hide sm:p-8 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white cursor-pointer hover:text-orange-300 transition-colors text-sm sm:text-base"
        >
          <ArrowLeft size={20} />
          Back to Orders
        </button>
        <a
          href={deliveryData?.orderPdfLink}
          download
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm sm:text-base font-medium"
        >
          <Download size={18} />
          Get Invoice
        </a>
      </div>

      {/* Order Info */}
      <div className="rounded-lg p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <h2 className="text-lg sm:text-xl font-semibold">
            Order Details - {orderData?.customerName ?? "—"}
          </h2>
          <span className="px-3 py-1 bg-gray-600 text-gray-300 rounded-full w-fit text-sm">
            {orderData?.status
              ? orderData.status.charAt(0).toUpperCase() + orderData.status.slice(1)
              : "—"}
          </span>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <div>
            <span className="text-gray-400">Order ID: </span>
            <span className="text-white">#{orderData?.id ?? "—"}</span>
          </div>
          <div>
            <span className="text-gray-400">Date: </span>
            <span className="text-white">
              {orderData?.createdAt ? formatDate(orderData.createdAt) : "—"}
            </span>
          </div>
          <div>
            <span className="text-gray-400">Address: </span>
            <span className="text-white">
              {[
                deliveryData?.validatedAddress,
                deliveryData?.city,
                deliveryData?.pincode,
              ]
                .filter(Boolean)
                .join(" ") || "—"}
            </span>
          </div>
          <div>
            <span className="text-gray-400">Email: </span>
            <span className="text-white">{deliveryData?.customerEmail ?? "—"}</span>
          </div>
          <div>
            <span className="text-gray-400">WhatsApp: </span>
            <span className="text-white">{orderData?.customerWhatsappNumber ?? "—"}</span>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="rounded-lg overflow-hidden mb-4 sm:mb-6">
        {/* Desktop Table */}
        <div className="hidden sm:block">
          <div className="min-w-[600px] bg-[#474552] px-4 lg:px-6 py-3 lg:py-4">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-300">
              <div className="col-span-4">Item Name</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-2">Price</div>
              <div className="col-span-2">Quantity</div>
              <div className="col-span-2">Total</div>
            </div>
          </div>
          <div className="min-w-[600px] px-4 lg:px-6 py-4 border border-[#474552]">
            {orderItems?.map((item) => (
              <div
                key={item?.id}
                className="grid grid-cols-12 gap-4 items-center py-3 border-b border-gray-700 last:border-b-0"
              >
                <div className="col-span-4">
                  <div className="text-white font-medium">{item?.itemName}</div>
                  {item?.itemDesc && (
                    <div className="text-gray-400 text-sm mt-1">{item.itemDesc}</div>
                  )}
                </div>
                <div className="col-span-2 text-gray-300">{item?.itemCategory ?? "—"}</div>
                <div className="col-span-2 text-white">${item?.itemRegPrice ?? "0.00"}</div>
                <div className="col-span-2 text-white">{item?.quantity ?? 0}</div>
                <div className="col-span-2 text-white font-medium">
                  ${((parseFloat(item?.itemRegPrice) || 0) * (item?.quantity || 0)).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="sm:hidden space-y-3">
          {orderItems?.map((item) => (
            <div
              key={item?.id}
              className="bg-[#474552] rounded-lg p-3 border border-gray-600"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium text-sm break-words">
                    {item?.itemName}
                  </h4>
                  {item?.itemDesc && (
                    <p className="text-gray-400 text-xs mt-1 break-words">{item.itemDesc}</p>
                  )}
                </div>
                <div className="text-white font-medium text-sm ml-2 flex-shrink-0">
                  ${((parseFloat(item?.itemRegPrice) || 0) * (item?.quantity || 0)).toFixed(2)}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-gray-400">Category:</span><br />
                  <span className="text-gray-300">{item?.itemCategory ?? "—"}</span>
                </div>
                <div>
                  <span className="text-gray-400">Price:</span><br />
                  <span className="text-white">${item?.itemRegPrice ?? "0.00"}</span>
                </div>
                <div>
                  <span className="text-gray-400">Qty:</span><br />
                  <span className="text-white">{item?.quantity ?? 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Location & Summary */}
      <div className="mt-6 flex flex-col lg:flex-row sm:justify-between justify-center">
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
              <MapPin className="text-blue-400" size={20} />
              Delivery Location
            </h3>
            <button
              onClick={openMapInNewTab}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
            >
              <Navigation size={16} />
              Open in Maps
            </button>
          </div>

          <div className="flex justify-center">
            <div className="relative">
              {imageError ? (
                <div className="bg-[#474552] p-8 rounded-lg text-center">
                  <MapPin className="text-gray-500 mx-auto mb-3" size={48} />
                  <p className="text-gray-400 mb-2">Map unavailable</p>
                  <button
                    onClick={openMapInNewTab}
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    View in Maps →
                  </button>
                </div>
              ) : (
                <img
                  src={deliveryData?.mapImageLink}
                  alt="Delivery location map"
                  className="w-full max-w-lg rounded-lg shadow-lg border-2 border-gray-700 object-cover"
                  onError={handleImageError}
                />
              )}
            </div>
          </div>
        </div>
        <div className="rounded-lg p-4 sm:p-6 min-w-[280px]">
          <h3 className="text-base sm:text-lg font-semibold mb-4">
            Order Summary
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Subtotal:</span>
              <span className="text-white">${orderData?.orderValueSubTotal ?? "0.00"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Tax:</span>
              <span className="text-white">${orderData?.orderTax ?? "0.00"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Delivery Charges:</span>
              <span className="text-white">${orderData?.deliveryCharges ?? "0.00"}</span>
            </div>
            <div className="border-t border-gray-600 pt-3">
              <div className="flex justify-between font-semibold text-base">
                <span className="text-white">Total:</span>
                <span className="text-white">${orderData?.totalOrder ?? "0.00"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
