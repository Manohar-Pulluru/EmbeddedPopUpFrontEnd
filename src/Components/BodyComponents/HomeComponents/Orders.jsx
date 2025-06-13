import React, { useState, useEffect, useContext } from "react";
import { OrderTabs } from "./OrderFlowComponents/OrderTabs";
import { CartView } from "./OrderFlowComponents/CartView";
import { DetailsView } from "./OrderFlowComponents/DetailsView";
import { OrderSummary } from "./OrderFlowComponents/OrderSummary";
import Delivery from "./OrderFlowComponents/Delivery";
import {
  getUserAddress,
  placeOrder,
  getTemplates,
  calculateDeliveryCharge,
} from "../../../Service/api";
import { jwtDecode } from "jwt-decode";
import { AppContext, useAppContext } from "../../../Service/Context/AppContext";

export const Orders = () => {
  const {
    setShowPayment,
    setPaymentDetails,
    paymentDetails,
    showPayment,
    changeCart,
    items,
    businessId,
    setItems,
    setCustomerName,
    setCustomerWhatsappNumber,
    setOrderData,
    setSubtotal,
    subtotal,
    deliveryCharge,
    setDeliveryCharge,
    mode,
    setMode,
    activeTab,
    setActiveTab,
    name,
    setName,
    phone,
    setPhone,
    email,
    setEmail,
    address,
    setAddress,
    city,
    setCity,
    pincode,
    setPincode,
    state,
    setState,
    isFormValid,
    setIsFormValid,
    tabs,
    discount,
    isLoading,
    setIsLoading,
    deliveryResult,
    setDeliveryResult,
    restrauntAddress,
    setRestrauntAddress,
    calculateSubtotal,
    fetchAddress,
    handleQuantityChange,
    handleNoteChange,
    handleDelete,
    handleNext,
    isTabDisabled,
  } = useContext(AppContext);

  

  useEffect(() => {
    fetchAddress();
    getTemplates(businessId).then((response) => {
      // console.log("Templates fetched successfully:", response);
      // console.log(response.businessData.address)
      setRestrauntAddress(response.businessData.address);
      // setRestrauntAddress(
      //   "2275 Britannia Rd W unit 15, Mississauga, ON L5M 2G6, Canada"
      // );
    });
  }, []);

  useEffect(() => {
    setSubtotal(calculateSubtotal(items, deliveryCharge));
  }, [items, deliveryCharge]);

  return (
    <div className="h-full w-full flex flex-col bg-[#1F1D2B] p-6 sm:p-8">
      {/* Header Section */}
      <div className="h-[15%] w-full flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="text-lg sm:text-2xl font-semibold">
            {activeTab === "Cart"
              ? `Your Cart (${items.length})`
              : activeTab === "Details"
              ? "Customer Details"
              : "Payment"}
          </div>
          <div className="text-xs sm:text-lg text-[#ffffff9c]">
            {/* show current date and day */}
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
        <OrderTabs className="z-20" />
      </div>

      {/* Content Section */}
      {activeTab === "Cart" ? (
        // cart tab
        <>
          <CartView />
          <OrderSummary
            discount={discount}
            subtotal={subtotal}
            handleNext={handleNext}
            isLoading={isLoading}
            items={items}
          />
        </>
      ) : activeTab === "Details" ? (
        <>
          <DetailsView />
          <OrderSummary
            discount={discount}
            subtotal={subtotal}
            handleNext={handleNext}
            isLoading={isLoading}
            items={items}
            isFormValid={isFormValid} // Pass isFormValid to OrderSummary
          />
        </>
      ) : activeTab === "Delivery" ? (
        <>
          <Delivery />
          <OrderSummary
            discount={discount}
            subtotal={subtotal}
            deliveryCharge={deliveryCharge}
            handleNext={handleNext}
            isLoading={isLoading}
            items={items}
            isFormValid={isFormValid} // Pass isFormValid to OrderSummary
          />
        </>
      ) : null}
    </div>
  );
};

export default Orders;
