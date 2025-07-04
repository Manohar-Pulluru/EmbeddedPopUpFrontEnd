import React from "react";
import { ArrowLeft } from "lucide-react";

// Component to display individual order details
export const OrderDetailsView = ({ fullOrderData, onBack }) => {
  if (!fullOrderData || !fullOrderData.orderData) {
    return <div className="text-white p-4">No order data available</div>;
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
      </div>

      {/* Order Info */}
      <div className="rounded-lg p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <h2 className="text-lg sm:text-xl font-semibold">
            Order Details - {orderData.customerName}
          </h2>
          <span className="px-3 py-1 bg-gray-600 text-gray-300 rounded-full w-fit text-sm">
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
            <span className="text-white">{formatDate(orderData.createdAt)}</span>
          </div>
          <div>
            <span className="text-gray-400">WhatsApp: </span>
            <span className="text-white">{orderData.customerWhatsappNumber}</span>
          </div>
        </div>
      </div>

      {/* Items Section */}
      <div className=" rounded-lg overflow-x-auto">
        <div className="min-w-[600px] bg-[#474552] px-6 py-4">
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-300">
            <div className="col-span-4">Item Name</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2">Price</div>
            <div className="col-span-2">Quantity</div>
            <div className="col-span-2">Total</div>
          </div>
        </div>

        <div className="min-w-[600px] px-6 py-4 border border-[#474552]">
          {orderItems.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-12 gap-4 items-center py-3 border-b border-gray-700"
            >
              <div className="col-span-4">
                <div className="text-white font-medium">{item.itemName}</div>
                {item.itemDesc && (
                  <div className="text-gray-400 text-sm mt-1">{item.itemDesc}</div>
                )}
              </div>
              <div className="col-span-2 text-gray-300">{item.itemCategory}</div>
              <div className="col-span-2 text-white">${item.itemRegPrice}</div>
              <div className="col-span-2 text-white">{item.quantity}</div>
              <div className="col-span-2 text-white font-medium">
                ${(parseFloat(item.itemRegPrice) * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 flex sm:justify-end justify-center">
        <div className="rounded-lg p-4 sm:p-6 min-w-[280px]">
          <h3 className="text-base sm:text-lg font-semibold mb-4">Order Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Subtotal:</span>
              <span className="text-white">${orderData.orderValueSubTotal}</span>
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
              <div className="flex justify-between font-semibold text-base">
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

// Main Orders Component
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
        // Mock order data
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

  // Mock orders
  const mockOrders = [
    {
      id: 1505,
      customerName: "Manohar Pulluru",
      total: "21.98",
      date: "2025-07-04",
    },
    {
      id: 1506,
      customerName: "John Doe",
      total: "45.99",
      date: "2025-07-03",
    },
  ];

  return (
    <div className="h-full w-full bg-[#252836] p-4 sm:p-8 text-white flex flex-col">
      <div className="text-xl sm:text-2xl font-semibold mb-6">Order History</div>

      {selectedOrder === null ? (
        <div className="space-y-4">
          {mockOrders.map((order) => (
            <div
              key={order.id}
              className="bg-[#1F1D2B] p-4 rounded-lg cursor-pointer hover:bg-[#2D2B3A] transition-colors"
              onClick={() => setSelectedOrder(order)}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h3 className="font-semibold text-base sm:text-lg">
                    Order #{order.id}
                  </h3>
                  <p className="text-gray-400 text-sm">{order.customerName}</p>
                </div>
                <div className="text-right sm:text-left">
                  <p className="font-semibold">${order.total}</p>
                  <p className="text-gray-400 text-sm">{order.date}</p>
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
