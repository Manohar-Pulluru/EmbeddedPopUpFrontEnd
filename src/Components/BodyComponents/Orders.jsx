import React, { useState, useEffect } from "react";
import { OrderCardsView } from "./OrdersComponents/OrderCardsView";
import { OrderDetailsView } from "./OrdersComponents/OrderDetailsView";

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Load orders from localStorage on mount
  useEffect(() => {
    const storedOrders = JSON.parse(
      localStorage.getItem("orderHistory") || "[]"
    );
    setOrders(storedOrders);
  }, []);

  return (
    <div className="h-full w-full bg-[#252836] p-8 text-white flex flex-col">
      {/* Header */}
      <div className="text-2xl font-semibold mb-6">Order History</div>

      {/* Order Cards or Details View */}
      {selectedOrder === null ? (
        <OrderCardsView orders={orders} setSelectedOrder={setSelectedOrder} />
      ) : (
        <OrderDetailsView
          selectedOrder={selectedOrder}
          setSelectedOrder={setSelectedOrder}
        />
      )}
    </div>
  );
};

export default Orders;
