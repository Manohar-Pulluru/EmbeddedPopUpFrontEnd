import React from "react";
import { ArrowLeft } from "lucide-react";

export const OrderDetailsView = ({ fullOrderData, onBack }) => {
  if (!fullOrderData || !fullOrderData.orderData) {
    return <div>No order data available</div>;
  }

  const { orderData, orderItems } = fullOrderData;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="h-full w-full bg-[#252836] text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white cursor-pointer hover:text-orange-300 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Orders
          </button>
        </div>
      </div>

      {/* Order Details Header */}
      <div className="rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            Order Details - {orderData.customerName}
          </h2>
          <span className="px-3 py-1 bg-gray-600 text-gray-300 rounded-full text-sm">
                        {orderData.status.charAt(0).toUpperCase() + orderData.status.slice(1)}

          </span>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <div>
            <span className="text-gray-400">Order ID: </span>
            <span className="text-white">#{orderData.id}</span>
          </div>
          <div>
            <span className="text-gray-400">Date: </span>
            <span className="text-white">
              {formatDate(orderData.createdAt)}
            </span>
          </div>
          <div>
            <span className="text-gray-400">WhatsApp: </span>
            <span className="text-white">
              {orderData.customerWhatsappNumber}
            </span>
          </div>
        </div>
      </div>

      {/* Items Section */}
      <div className="bg-[#1F1D2B] rounded-lg overflow-hidden">

        {/* Items Table Header */}
        <div className="bg-[#2D2B3A] px-6 py-4">
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-300">
            <div className="col-span-4">Item Name</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2">Price</div>
            <div className="col-span-2">Quantity</div>
            <div className="col-span-2">Total</div>
          </div>
        </div>

        {/* Items Table Body */}
        <div className="px-6 py-4">
          {orderItems.map((item, index) => (
            <div
              key={item.id}
              className="grid grid-cols-12 gap-4 items-center py-3"
            >
              <div className="col-span-4">
                <div className="text-white font-medium">{item.itemName}</div>
                {item.itemDesc && (
                  <div className="text-gray-400 text-sm mt-1">
                    {item.itemDesc}
                  </div>
                )}
              </div>
              <div className="col-span-2 text-gray-300">
                {item.itemCategory}
              </div>
              <div className="col-span-2 text-white">${item.itemRegPrice}</div>
              <div className="col-span-2 text-white">{item.quantity}</div>
              <div className="col-span-2 text-white font-medium">
                ${(parseFloat(item.itemRegPrice) * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="mt-6 flex justify-end">
        <div className="rounded-lg p-6 min-w-[300px]">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Subtotal:</span>
              <span className="text-white">
                ${orderData.orderValueSubTotal}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Tax:</span>
              <span className="text-white">${orderData.orderTax}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Delivery Charges:</span>
              <span className="text-white">${orderData.deliveryCharges}</span>
            </div>

            <div className="border-t border-gray-600 pt-3">
              <div className="flex justify-between font-semibold text-lg">
                <span className="text-white">Total:</span>
                <span className="text-white">${orderData.totalOrder}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Updated Orders component to integrate with your existing code
const UpdatedOrdersComponent = () => {
  const [orders, setOrders] = React.useState([]);
  const [selectedOrder, setSelectedOrder] = React.useState(null);
  const [fullOrderData, setFullOrderData] = React.useState(null);
  const [loadingOrderDetails, setLoadingOrderDetails] = React.useState(false);

  React.useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("allOrders") || "[]");
    setOrders(storedOrders);
  }, []);

  React.useEffect(() => {
    async function fetchSelectedOrder() {
      if (!selectedOrder?.id) return;
      setLoadingOrderDetails(true);
      try {
        // Replace this with your actual API call
        // const orderData = await getCartItems(selectedOrder.id);

        // Mock data for demonstration
        const mockOrderData = {
          message: "Order retrieved successfully",
          orderData: {
            id: selectedOrder.id,
            customerName: "Manohar Pulluru",
            customerWhatsappNumber: "+917382467834",
            orderValueSubTotal: "14.99",
            orderTax: "0.00",
            totalOrder: "21.98",
            deliveryCharges: "6.99",
            deliveryType: "delivery",
            status: "received",
            createdAt: "2025-07-04T13:34:19.395Z",
          },
          orderItems: [
            {
              id: "a139d7fa-c52a-43f2-838a-9184d3a8ac2b",
              itemName: "Telugu Kerala Mata Rice 10LB",
              itemDesc: "Telugu Kerala Mata Rice 10LB.",
              itemRegPrice: "14.99",
              itemCategory: "Rice",
              quantity: 1,
            },
          ],
        };

        setFullOrderData(mockOrderData);
      } catch (error) {
        console.error("Failed to fetch order details:", error);
      } finally {
        setLoadingOrderDetails(false);
      }
    }

    fetchSelectedOrder();
  }, [selectedOrder]);

  // Mock orders for demonstration
  const mockOrders = [
    {
      id: 1505,
      customerName: "Manohar Pulluru",
      total: "21.98",
      date: "2025-07-04",
    },
    { id: 1506, customerName: "John Doe", total: "45.99", date: "2025-07-03" },
  ];

  return (
    <div className="h-full w-full bg-[#252836] p-8 text-white flex flex-col">
      <div className="text-2xl font-semibold mb-6">Order History</div>

      {selectedOrder === null ? (
        <div className="space-y-4">
          {mockOrders.map((order) => (
            <div
              key={order.id}
              className="bg-[#1F1D2B] p-4 rounded-lg cursor-pointer hover:bg-[#2D2B3A] transition-colors"
              onClick={() => setSelectedOrder(order)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">Order #{order.id}</h3>
                  <p className="text-gray-400">{order.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${order.total}</p>
                  <p className="text-gray-400">{order.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
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

export default UpdatedOrdersComponent;
