import React, { useState, useEffect } from "react";
import { OrderCardsView } from "./OrdersComponents/OrderCardsView";
import { OrderDetailsView } from "./OrdersComponents/OrderDetailsView";
import { getCartItems } from "../../Service/api";

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [fullOrderData, setFullOrderData] = useState(null);
  const [loadingOrderDetails, setLoadingOrderDetails] = useState(false);

  console.log(selectedOrder, "selectedOrder===>");
  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("allOrders") || "[]");
    setOrders(storedOrders);
  }, []);

  useEffect(() => {
    async function fetchSelectedOrder() {
      if (!selectedOrder?.id) return;
      setLoadingOrderDetails(true);
      try {
        const orderData = await getCartItems(selectedOrder.id);

        console.log("Fetched Order Data:", orderData);
        setFullOrderData(orderData);
      } catch (error) {
        console.error("Failed to fetch order details:", error);
      } finally {
        setLoadingOrderDetails(false);
      }
    }

    fetchSelectedOrder();
  }, [selectedOrder]);

  return (
    <div className="h-full w-full overflow-scroll scrollbar-hide bg-[#252836] sm:p-8 p-4 text-white flex flex-col">
      <div className="text-2xl font-semibold mb-6">Order History</div>

      {selectedOrder === null ? (
        <OrderCardsView orders={orders} setSelectedOrder={setSelectedOrder} />
      ) : loadingOrderDetails ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading order details...</div>
        </div>
      ) : (
        <OrderDetailsView
          fullOrderData={fullOrderData}
          onBack={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default Orders;
