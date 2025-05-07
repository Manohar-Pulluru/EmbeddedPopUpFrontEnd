import React from "react";

export const OrderItemsTable = ({ orderItems }) => {
  return (
    <>
      <div className="text-lg font-medium mb-2">Items:</div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-[#ea7c693b] border-[#393C49] font-semibold text-[#ffffff]">
              <th className="py-3 px-4">Item Name</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Quantity</th>
              <th className="py-3 px-4 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {orderItems.map((item, idx) => (
              <tr
                key={idx}
                className="border-b border-[#393C49] hover:bg-[#2a2b3d]"
              >
                <td className="py-3 px-4">{item.itemName || "Unnamed Item"}</td>
                <td className="py-3 px-4">{item.itemCategory || "N/A"}</td>
                <td className="py-3 px-4">
                  ${parseFloat(item.itemRegPrice || 0).toFixed(2)}
                </td>
                <td className="py-3 px-4">{item.quantity || 1}</td>
                <td className="py-3 px-4 text-right">
                  $
                  {(
                    parseFloat(item.itemRegPrice || 0) * (item.quantity || 1)
                  ).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};