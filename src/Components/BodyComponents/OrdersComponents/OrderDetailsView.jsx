
import React, { useContext } from "react";
import { ArrowLeft, Download } from "lucide-react";
import { AppContext } from "../../../Service/Context/AppContext";

// Component to display individual order details
export const OrderDetailsView = ({ fullOrderData, onBack }) => {
  if (!fullOrderData || !fullOrderData.orderData) {
    return <div className="text-white p-4">No order data available</div>;
  }

  const {businessData} = useContext(AppContext);

  const { orderData, orderItems } = fullOrderData;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  const generatePDF = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
    // Generate HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Order #${orderData.id} - ${orderData.customerName}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #333;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
          }
          .company-name {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .order-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            flex-wrap: wrap;
          }
          .order-details, .customer-details {
            flex: 1;
            min-width: 200px;
          }
          .order-details h3, .customer-details h3 {
            margin-bottom: 10px;
            color: #555;
          }
          .info-row {
            margin-bottom: 5px;
          }
          .label {
            font-weight: bold;
            display: inline-block;
            width: 120px;
          }
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          .items-table th, .items-table td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
          }
          .items-table th {
            background-color: #f5f5f5;
            font-weight: bold;
          }
          .items-table tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          .summary {
            float: right;
            width: 300px;
            margin-top: 20px;
          }
          .summary table {
            width: 100%;
            border-collapse: collapse;
          }
          .summary td {
            padding: 8px;
            border-bottom: 1px solid #ddd;
          }
          .summary .total-row {
            font-weight: bold;
            border-top: 2px solid #333;
          }
          .footer {
            clear: both;
            margin-top: 50px;
            text-align: center;
            color: #666;
            font-size: 12px;
          }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-name">${businessData?.name || "Business Name"}</div>
          <div>Order Invoice</div>
        </div>

        <div class="order-info">
          <div class="order-details">
            <h3>Order Information</h3>
            <div class="info-row">
              <span class="label">Order ID:</span>
              #${orderData.id}
            </div>
            <div class="info-row">
              <span class="label">Date:</span>
              ${formatDate(orderData.createdAt)}
            </div>
            <div class="info-row">
              <span class="label">Status:</span>
              ${orderData.status.charAt(0).toUpperCase() + orderData.status.slice(1)}
            </div>
            <div class="info-row">
              <span class="label">Delivery Type:</span>
              ${orderData.deliveryType}
            </div>
          </div>

          <div class="customer-details">
            <h3>Customer Information</h3>
            <div class="info-row">
              <span class="label">Name:</span>
              ${orderData.customerName}
            </div>
            <div class="info-row">
              <span class="label">WhatsApp:</span>
              ${orderData.customerWhatsappNumber}
            </div>
          </div>
        </div>

        <table class="items-table">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${orderItems.map(item => `
              <tr>
                <td>
                  <strong>${item.itemName}</strong>
                  ${item.itemDesc ? `<br><small style="color: #666;">${item.itemDesc}</small>` : ''}
                </td>
                <td>${item.itemCategory}</td>
                <td>$${item.itemRegPrice}</td>
                <td>${item.quantity}</td>
                <td>$${(parseFloat(item.itemRegPrice) * item.quantity).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="summary">
          <table>
            <tr>
              <td>Subtotal:</td>
              <td style="text-align: right;">$${orderData.orderValueSubTotal}</td>
            </tr>
            <tr>
              <td>Tax:</td>
              <td style="text-align: right;">$${orderData.orderTax}</td>
            </tr>
            <tr>
              <td>Delivery Charges:</td>
              <td style="text-align: right;">$${orderData.deliveryCharges}</td>
            </tr>
            <tr class="total-row">
              <td>Total:</td>
              <td style="text-align: right;">$${orderData.totalOrder}</td>
            </tr>
          </table>
        </div>

        <div class="footer">
          <p>Thank you for your order!</p>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
      </body>
      </html>
    `;

    // Write content to the new window
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Wait for content to load, then print
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
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
        
        {/* Print PDF Button */}
        <button
          onClick={generatePDF}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm sm:text-base font-medium"
        >
          <Download size={18} />
          Print PDF
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
