import React, { useState, useEffect } from "react";
import { OrderTabs } from "./OrderFlowComponents/OrderTabs";
import { CartView } from "./OrderFlowComponents/CartView";
import { DetailsView } from "./OrderFlowComponents/DetailsView";
import { OrderSummary } from "./OrderFlowComponents/OrderSummary";
import Delivery from "./OrderFlowComponents/Delivery";
import {
  getUserAddress,
  placeOrder,
  getTemplates,
  calculateDeliveryCharge
} from "../../../Service/api";
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
  setSubtotal,
  subtotal,
  deliveryCharge,
  setDeliveryCharge,
}) => {
  const [activeTab, setActiveTab] = useState("Cart");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [state, setState] = useState("");
  const [isFormValid, setIsFormValid] = useState(false); // New state for form validity
  const { toggleCart } = useAppContext();
  const tabs = ["Cart", "Details", "Delivery"];
  const [discount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [deliveryResult, setDeliveryResult] = useState(null);
  // const [deliveryCharge, setDeliveryCharge] = useState(0);
  // const [result, setResult] = useState(null);
  const [restrauntAddress, setRestrauntAddress] = useState(null);

  const calculateSubtotal = (items, deliveryCharge = 0) => {
    return items.reduce((sum, item) => sum + (item.totalPrice || 0), 0) + deliveryCharge;
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

    getTemplates(businessAccountId).then((response) => {
      // console.log("Templates fetched successfully:", response);
      // console.log(response.businessData.address)
      // setRestrauntAddress(response.businessData.address);
      setRestrauntAddress("2275 Britannia Rd W unit 15, Mississauga, ON L5M 2G6, Canada");
    });
  }, []);

  useEffect(() => {
    setSubtotal(calculateSubtotal(items, deliveryCharge));
  }, [items, deliveryCharge]);

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
    setSubtotal(calculateSubtotal(updatedItems, deliveryCharge));

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
    setSubtotal(calculateSubtotal(updatedItems, deliveryCharge));

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
    } else if (activeTab === "Details" && isFormValid) {
      // fetchDeliveryDetails();

      console.log("Restaurant Address:", restrauntAddress);
      console.log("Customer Address:", address, city, pincode, state);
      const res = await calculateDeliveryCharge(restrauntAddress, address + " " + city + " " + state + " " + pincode);
      // const res = await calculateDeliveryCharge(restrauntAddress, address);
      setDeliveryResult(res);
      setDeliveryCharge(res.delivery_charge || 0);
      // console.log("Delivery Result:", res);
      setActiveTab("Delivery");
    } else if (activeTab === "Delivery" && isFormValid) {
      // Only proceed if form is valid
      // Update customer details
      setCustomerName(name);
      setCustomerWhatsappNumber(phone);

      // Construct orderData with user-provided values only
      const updatedOrderData = {
        customerName: name,
        customerWhatsappNumber: phone,
        customerEmail: email,
        businessAccountId: businessAccountId,
        items: items.map((item, index) => ({
          id: item.id,
          sectionTitle: "Rice", // Adjust as needed
          itemId: item.itemId,
          itemName: item.itemName,
          itemDescription: `${item.itemName}.`,
          regPrice: item.regPrice.toString(),
          salePrice: "0",
          imageURL: item.imageURL,
          serial_number: index + 1,
          productTemplateSectionId: "20903f70-bc7a-48f0-89fc-07bbede56cf1",
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
        let orderHistory = JSON.parse(
          localStorage.getItem("orderHistory") || "[]"
        );
        orderHistory.push(response.data);
        localStorage.setItem("orderHistory", JSON.stringify(orderHistory));
        // localStorage.setItem("cartItems", JSON.stringify([]));
        // setItems([]); // Clear items in state
        setShowPayment(true);
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
      <div className="h-[15%] w-full flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-semibold">
            {activeTab === "Cart"
              ? `Your Cart (${items.length})`
              : activeTab === "Details"
              ? "Customer Details"
              : "Payment"}
          </div>
          <div className="text-lg text-[#ffffff9c]">
            {/* show current date and day */}
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
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
            isLoading={isLoading}
            items={items}
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
            setIsFormValid={setIsFormValid} // Pass setIsFormValid to DetailsView
          />
          <OrderSummary
            discount={discount}
            subtotal={subtotal}
            handleNext={handleNext}
            isLoading={isLoading}
            items={items}
            isFormValid={isFormValid} // Pass isFormValid to OrderSummary
          />
        </>
      ) : activeTab === "Delivery" ? (
        <>
          <Delivery
            handleNext={handleNext}
            result={deliveryResult}
            origin={restrauntAddress}
            destination={`${address}, ${city}, ${pincode}, ${state}`}
            calculateSubtotal={calculateSubtotal}
            setSubtotal={setSubtotal}
            items={items}
            deliveryCharge={deliveryCharge}
            setDeliveryCharge={setDeliveryCharge}
          />
          <OrderSummary
            discount={discount}
            subtotal={subtotal}
            deliveryCharge={deliveryCharge}
            handleNext={handleNext}
            isLoading={isLoading}
            items={items}
            isFormValid={isFormValid} // Pass isFormValid to OrderSummary
          />
        </>
      ) : null}
    </div>
  );
};

export default Orders;
