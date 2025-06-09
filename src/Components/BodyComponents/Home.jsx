import React, { useEffect, useState } from "react";
import { Orders } from "./HomeComponents/Orders";
import { HomeBody } from "./HomeComponents/HomeBody";
// import { Payment } from "./HomeComponents/Payment";
import Payment from "./HomeComponents/Payment";

export const Home = ({ businessId }) => {
  const [showPayment, setShowPayment] = useState(false);
  const [changeCart, setChangeCart] = useState(false);
  const [items, setItems] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerWhatsappNumber, setCustomerWhatsappNumber] = useState("");
  const [orderData, setOrderData] = useState({}); // Initialize as empty
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [subtotal, setSubtotal] = useState(0);
  const [deliveryCharge, setDeliveryCharge] = useState(0)

  const toggleChangeCart = () => {
    setChangeCart(!changeCart);
  };

  // Fetch items from localStorage on mount or when changeCart changes
  useEffect(() => {
    const cartItemsString = localStorage.getItem("cartItems");
    let cartItems = [];
    if (cartItemsString) {
      try {
        const parsedItems = JSON.parse(cartItemsString);
        if (Array.isArray(parsedItems)) {
          cartItems = parsedItems.map((item) => ({
            id: item.id || item.itemId,
            itemId: item.itemId || item.id,
            itemName: item.itemName || "Unnamed Item",
            regPrice: parseFloat(item.regPrice || item.salePrice || 0),
            imageURL: item.imageURL,
            quantity: item.quantity || 1,
            totalPrice:
              (parseFloat(item.regPrice || item.salePrice || 0) || 0) *
              (item.quantity || 1),
            note: item.note || "",
            name: item.itemName || "Unnamed Item",
            unitPrice: parseFloat(item.regPrice || item.salePrice || 0),
            image: item.imageURL,
          }));
        }
      } catch (err) {
        console.error("Failed to parse cartItems:", err);
      }
    }
    setItems(cartItems);
  }, [changeCart]);

  // Update orderData whenever customerName, customerWhatsappNumber, or items change
  useEffect(() => {
    setOrderData({
      customerName: customerName || "John Doe",
      customerWhatsappNumber: customerWhatsappNumber || "+1234567890",
      businessAccountId: businessId,
      items: items.map((item, index) => ({
        id: item.id,
        sectionTitle: "Rice", // Hardcoded for now, adjust as needed
        itemId: item.itemId,
        itemName: item.itemName,
        itemDescription: `${item.itemName}.`, // Simple description based on name
        regPrice: item.regPrice.toString(),
        salePrice: "0", // Hardcoded, adjust if salePrice is available
        imageURL: item.imageURL,
        serial_number: index + 1,
        productTemplateSectionId: "20903f70-bc7a-48f0-89fc-07bbede56cf1", // Hardcoded, adjust as needed
        isHSTApplied: false,
        HSTPercentage: "13.00",
        inventoryId: null,
        inventoryName: null,
        isSyncToInventory: false,
        createdAt: "2025-04-18T14:23:31.222Z",
        updatedAt: "2025-04-18T14:23:31.222Z",
        quantity: item.quantity,
      })),
    });
  }, [customerName, customerWhatsappNumber, items, businessId]);

  console.log("orderData__", orderData);

  return (
    <div className="h-full w-full flex">
      <div className={`${showPayment ? "w-[40%]" : "w-[70%]"} h-full`}>
        <HomeBody
          toggleChangeCart={toggleChangeCart}
          changeCart={changeCart}
          showPayment={showPayment}
          setShowPayment={setShowPayment}
          businessId={businessId}
        />
      </div>
      <div className="w-[30%] h-full">
        <Orders
          showPayment={showPayment}
          changeCart={changeCart}
          setShowPayment={setShowPayment}
          items={items}
          setPaymentDetails={setPaymentDetails}
          paymentDetails={paymentDetails}
          setItems={setItems}
          setCustomerName={setCustomerName}
          setCustomerWhatsappNumber={setCustomerWhatsappNumber}
          setOrderData={setOrderData} // Pass setOrderData to Orders
          businessAccountId={businessId}
          setSubtotal={setSubtotal}
          subtotal={subtotal}
          deliveryCharge={deliveryCharge}
          setDeliveryCharge={setDeliveryCharge}
        />
      </div>
      {showPayment && (
        <div className="w-[30%] h-full">
          <Payment
            showPayment={showPayment}
            setShowPayment={setShowPayment}
            orderData={orderData}
            setChangeCart={setChangeCart}
            changeCart={changeCart}
            setPaymentDetails={setPaymentDetails}
            paymentDetails={paymentDetails}
            setOrderData={setOrderData}
            setSubtotal={setSubtotal}
            subtotal={subtotal}
            deliveryCharge={deliveryCharge}
          />
        </div>
      )}
    </div>
  );
};

export default Home;
