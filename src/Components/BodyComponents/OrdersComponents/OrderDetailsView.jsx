import React from "react";
import { BackButton } from "./BackButton";
import { OrderDetailsHeader } from "./OrderDetailsHeader";
import { OrderItemsTable } from "./OrderItemsTable";
import { OrderSummary } from "./OrderSummary";

export const OrderDetailsView = ({ selectedOrder, setSelectedOrder }) => {
  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide">
      <BackButton onClick={() => setSelectedOrder(null)} />
      <div className="bg-[#252836] p-6 rounded-2xl border border-[#393C49] shadow-lg">
        <OrderDetailsHeader selectedOrder={selectedOrder} />
        <OrderItemsTable orderItems={selectedOrder.orderItems} />
        <OrderSummary orderTransaction={selectedOrder.orderTransaction} />
      </div>
    </div>
  );
};