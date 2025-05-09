import React, { useEffect, useState } from "react";
import { Orders } from "./HomeComponents/Orders";
import { HomeBody } from "./HomeComponents/HomeBody";
import { Payment } from "./HomeComponents/Payment";

export const Home = () => {
  const [showPayment, setShowPayment] = useState(false);
  const [changeCart, setChangeCart] = useState(false);
  const [items, setItems] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerWhatsappNumber, setCustomerWhatsappNumber] = useState("");
  const [businessId, setBusinessId] = useState("80b6fc97-aa38-46b1-bee8-a106d9b7cd96");

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

    // useEffect(() => {
    //   const handleMessage = (event) => {
    //     // Ensure it's from the expected origin (change port if needed)
    //     if (event.origin !== "http://127.0.0.1:5500") return;
  
    //     if (event.data.businessId) {
    //       console.log("Received businessId:", event.data.businessId);
    //       setBusinessId(event.data.businessId);
    //     }
    //   };
  
    //   window.addEventListener("message", handleMessage);
    //   return () => window.removeEventListener("message", handleMessage);
    // }, []);

  // Prepare orderData for Payment component
  const orderData = {
    customerName: customerName || "John Doe",
    customerWhatsappNumber: customerWhatsappNumber || "+1234567890",
    businessAccountId: businessId || "80b6fc97-aa38-46b1-bee8-a106d9b7cd96",
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
  };

  return (
    <div className="h-full w-full flex">
      <div className={`${showPayment ? "w-[40%]" : "w-[70%]"} h-full`}>
        <HomeBody
          toggleChangeCart={toggleChangeCart}
          changeCart={changeCart}
          showPayment={showPayment}
          setShowPayment={setShowPayment}
        />
      </div>
      <div className="w-[30%] h-full">
        <Orders
          showPayment={showPayment}
          changeCart={changeCart}
          setShowPayment={setShowPayment}
          items={items}
          setItems={setItems}
          setCustomerName={setCustomerName}
          setCustomerWhatsappNumber={setCustomerWhatsappNumber}
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
          />
        </div>
      )}
    </div>
  );
};

export default Home;
