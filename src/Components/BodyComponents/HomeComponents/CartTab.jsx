import React, { useState, useEffect } from "react";
import { OrderTabs } from "./OrderFlowComponents/OrderTabs";
import { CartView } from "./OrderFlowComponents/CartView";
import { OrderSummary } from "./OrderFlowComponents/OrderSummary";

export const Orders = ({ items, subtotal }) => {
  return (
    <div className="h-full w-full flex flex-col bg-[#1F1D2B] p-8">
      {/* Header Section */}
      <div className="h-[15%] w-full flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-semibold">
            {activeTab === "Cart"
              ? `Your Cart (${items.length})`
              : activeTab === "Details"
              ? "Customer Details"
              : "Payment"}
          </div>
          <div className="text-lg text-[#ffffff9c]">
            {/* show current date and day */}
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
        <OrderTabs
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isTabDisabled={isTabDisabled}
        />
      </div>
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
    </div>
  );
};

export default Orders;
