import React, { useState, useEffect } from "react";
import { OrderTabs } from "./OrderFlowComponents/OrderTabs";
import { CartView } from "./OrderFlowComponents/CartView";
import { DetailsView } from "./OrderFlowComponents/DetailsView";
import { OrderSummary } from "./OrderFlowComponents/OrderSummary";
import { getUserAddress } from "../../../Service/api";
import { jwtDecode } from "jwt-decode";

export const Orders = ({
  setShowPayment,
  showPayment,
  changeCart,
  items,
  setItems,
  setCustomerName,
  setCustomerWhatsappNumber,
}) => {
  const [activeTab, setActiveTab] = useState("Cart");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [state, setState] = useState("");
  const tabs = ["Cart", "Details"];
  const [discount] = useState(0);
  const [subtotal, setSubtotal] = useState(0);

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

  const handleNext = () => {

    if (activeTab === "Cart") {
      setActiveTab("Details");
    } else if (activeTab === "Details") {
      setCustomerName(name);
      console.log("Cart To Detaols")
      setCustomerWhatsappNumber(phone);
      setShowPayment(true);
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
          />
        </>
      ) : null}
    </div>
  );
};

export default Orders;