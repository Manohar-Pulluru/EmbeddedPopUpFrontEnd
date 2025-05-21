import React, { useState, useEffect } from "react";
import { OrderTabs } from "./OrderFlowComponents/OrderTabs";
import { CartView } from "./OrderFlowComponents/CartView";
import { DetailsView } from "./OrderFlowComponents/DetailsView";
import { OrderSummary } from "./OrderFlowComponents/OrderSummary";
import { getUserAddress, placeOrder } from "../../../Service/api"; // Add placeOrder import
import { jwtDecode } from "jwt-decode";
import { useAppContext } from "../../../Service/Context/AppContext";

export const Orders = ({
  setShowPayment,
  setPaymentDetails,
  paymentDetails,
  showPayment,
  changeCart,
  items,
  businessAccountId,
  setItems,
  setCustomerName,
  setCustomerWhatsappNumber,
  setOrderData,
}) => {
  const [activeTab, setActiveTab] = useState("Cart");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [state, setState] = useState("");
  const { toggleCart } = useAppContext();
  const tabs = ["Cart", "Details"];
  const [discount] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false); // Add isLoading state for order submission

  const calculateSubtotal = (items) => {
    return items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  };

  useEffect(() => {
    const fetchAddress = async () => {
      const token = localStorage.getItem("aftoAuthToken");
      if (!token) {
        console.log("No token found in localStorage");
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        const email = decodedToken.email;
        const businessId = localStorage.getItem("aftoAuthBusinessId");

        if (!email || !businessId) {
          console.log("Email or businessId missing");
          return;
        }

        const payload = {
          email,
          businessAccountId: businessId,
        };

        console.log("Fetching address with payload:", payload);
        const response = await getUserAddress(payload);

        if (response?.embeddedUser?.otherDetails) {
          const { name, email, phone, address, city, pincode, state } =
            response.embeddedUser.otherDetails;
          setName(name || "");
          setEmail(email || "");
          setPhone(phone || "");
          setAddress(address || "");
          setCity(city || "");
          setPincode(pincode || "");
          setState(state || "");
          console.log("Address data set:", response.embeddedUser.otherDetails);
        } else {
          console.log("No address data in response");
        }
      } catch (error) {
        console.error("Error fetching address:", error);
      }
    };

    fetchAddress();
  }, []);

  useEffect(() => {
    setSubtotal(calculateSubtotal(items));
  }, [items]);

  const handleQuantityChange = (id, value) => {
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        const newQuantity = Math.max(1, Number(value) || 1);
        const newTotalPrice = parseFloat(item.regPrice) * newQuantity;
        return {
          ...item,
          quantity: newQuantity,
          totalPrice: newTotalPrice,
        };
      }
      return item;
    });
    setItems(updatedItems);
    setSubtotal(calculateSubtotal(updatedItems));

    const itemsForStorage = updatedItems.map((item) => ({
      id: item.id,
      itemId: item.itemId,
      itemName: item.itemName,
      regPrice: item.regPrice.toString(),
      imageURL: item.imageURL,
      quantity: item.quantity,
      totalPrice: item.totalPrice,
      note: item.note,
    }));
    localStorage.setItem("cartItems", JSON.stringify(itemsForStorage));
  };

  const handleNoteChange = (id, note) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, note } : item
    );
    setItems(updatedItems);

    const itemsForStorage = updatedItems.map((item) => ({
      id: item.id,
      itemId: item.itemId,
      itemName: item.itemName,
      regPrice: item.regPrice.toString(),
      imageURL: item.imageURL,
      quantity: item.quantity,
      totalPrice: item.totalPrice,
      note: item.note,
    }));
    localStorage.setItem("cartItems", JSON.stringify(itemsForStorage));
  };

  const handleDelete = (id) => {
    toggleCart();
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
    setSubtotal(calculateSubtotal(updatedItems));

    const itemsForStorage = updatedItems.map((item) => ({
      id: item.id,
      itemId: item.itemId,
      itemName: item.itemName,
      regPrice: item.regPrice.toString(),
      imageURL: item.imageURL,
      quantity: item.quantity,
      totalPrice: item.totalPrice,
      note: item.note,
    }));
    localStorage.setItem("cartItems", JSON.stringify(itemsForStorage));
  };

  const handleNext = async () => {
    if (activeTab === "Cart") {
      setActiveTab("Details");
    } else if (activeTab === "Details") {
      // Update customer details
      setCustomerName(name);
      setCustomerWhatsappNumber(phone);

      // Update orderData with the latest customer details and items
      const updatedOrderData = {
        customerName: name || "John Doe",
        customerWhatsappNumber: phone || "+1234567890",
        businessAccountId: businessAccountId,
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

      setOrderData(updatedOrderData);
      console.log("Updated orderData:", updatedOrderData);

      // Place the order
      setIsLoading(true);
      try {
        const response = await placeOrder(updatedOrderData);
        let orderHistory = JSON.parse(localStorage.getItem("orderHistory") || "[]");
        orderHistory.push(response.data);
        localStorage.setItem("orderHistory", JSON.stringify(orderHistory));
        localStorage.setItem("cartItems", JSON.stringify([]));
        setItems([]); // Clear items in state
        // setChangeCart(!changeCart);
        // setPaymentDetails(response.data.paymentIntent)
        setShowPayment(true); // Show payment view (optional, see note below)
        setPaymentDetails(response.data.paymentIntent);
        console.log(showPayment, "showPayment", response.data.paymentIntent);
        toggleCart();
      } catch (error) {
        console.error("Failed to place order:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const isTabDisabled = (tab) => {
    if (activeTab === "Cart") {
      return tab !== "Cart";
    }
    return false;
  };

  return (
    <div className="h-full w-full flex flex-col bg-[#1F1D2B] p-8">
      {/* Header Section */}
      <div className="h-[15%] w-full flex flex-col gap-8">
        <div className="text-2xl font-semibold">
          {activeTab === "Cart"
            ? `Your Cart (${items.length})`
            : activeTab === "Details"
            ? "Customer Details"
            : "Payment"}
        </div>
        <OrderTabs
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isTabDisabled={isTabDisabled}
        />
      </div>

      {/* Content Section */}
      {activeTab === "Cart" ? (
        <>
          <CartView
            items={items}
            handleQuantityChange={handleQuantityChange}
            handleNoteChange={handleNoteChange}
            handleDelete={handleDelete}
          />
          <OrderSummary
            discount={discount}
            subtotal={subtotal}
            handleNext={handleNext}
            isLoading={isLoading} // Pass isLoading to OrderSummary for UI feedback
          />
        </>
      ) : activeTab === "Details" ? (
        <>
          <DetailsView
            name={name}
            setName={setName}
            phone={phone}
            setPhone={setPhone}
            email={email}
            setEmail={setEmail}
            address={address}
            setAddress={setAddress}
            city={city}
            setCity={setCity}
            pincode={pincode}
            setPincode={setPincode}
            state={state}
            setState={setState}
          />
          <OrderSummary
            discount={discount}
            subtotal={subtotal}
            handleNext={handleNext}
            isLoading={isLoading} // Pass isLoading to OrderSummary for UI feedback
          />
        </>
      ) : null}
    </div>
  );
};

export default Orders;