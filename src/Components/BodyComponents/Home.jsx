import React, { useContext, useEffect, useState } from "react";
import { Orders } from "./HomeComponents/Orders";
import { HomeBody } from "./HomeComponents/HomeBody";
// import { Payment } from "./HomeComponents/Payment";
import Payment from "./HomeComponents/Payment";
import App from "../../App";
import { AppContext } from "../../Service/Context/AppContext";
import AlertCard from "./HomeComponents/HomeBodyComponents/AlertCard";
import CartButton from "./HomeComponents/HomeBodyComponents/CartButton";
import UserProfile from "./HomeComponents/HomeBodyComponents/UserProfile";
import { getCartItems } from "../../Service/api";

export const Home = () => {
  const {
    businessId,
    showPayment,
    setShowPayment,
    changeCart,
    setChangeCart,
    items,
    setItems,
    customerName,
    setCustomerName,
    customerWhatsappNumber,
    setCustomerWhatsappNumber,
    orderData,
    setOrderData,
    paymentDetails,
    setPaymentDetails,
    subtotal,
    setSubtotal,
    deliveryCharge,
    setDeliveryCharge,
    mode,
    setMode,
    toggleChangeCart,
    isCartOpen,
    setIsCartOpen,
    setActiveIndex,
    isMobile,
    showAlert,
    setShowAlert,
    populateItems
  } = useContext(AppContext);

  // Fetch items from localStorage on mount or when changeCart changes
  useEffect(() => {
    // const cartItemsString = localStorage.getItem("cartItems");
    // let cartItems = [];
    // if (cartItemsString) {
    //   try {
    //     const parsedItems = JSON.parse(cartItemsString);
    //     if (Array.isArray(parsedItems)) {
    //       cartItems = parsedItems.map((item) => ({
    //         id: item.id || item.itemId,
    //         itemId: item.itemId || item.id,
    //         itemName: item.itemName || "Unnamed Item",
    //         regPrice: parseFloat(item.regPrice || item.salePrice || 0),
    //         imageURL: item.imageURL,
    //         quantity: item.quantity || 1,
    //         totalPrice:
    //           (parseFloat(item.regPrice || item.salePrice || 0) || 0) *
    //           (item.quantity || 1),
    //         note: item.note || "",
    //         name: item.itemName || "Unnamed Item",
    //         unitPrice: parseFloat(item.regPrice || item.salePrice || 0),
    //         image: item.imageURL,
    //       }));
    //     }
    //   } catch (err) {
    //     console.error("Failed to parse cartItems:", err);
    //   }
    // }
    // setItems(cartItems);

    const orderId = localStorage.getItem("cartOrderId");
    console.log("Order Id",orderId);
    if (!orderId) return setItems([]);

    getCartItems(orderId)
      .then(({ orderItems }) => {
        // map the API fields into the shape your components expect:
        const normalized = orderItems.map((i) => ({
          id: i.id,
          itemId: i.productRetailerId,
          itemName: i.itemName,
          itemRegPrice: parseFloat(i.itemRegPrice) || 0,
          regPrice: parseFloat(i.itemRegPrice) || 0, // optional alias
          imageURL: i.imageUrl,
          quantity: i.quantity,
          totalPrice: (parseFloat(i.itemRegPrice) || 0) * i.quantity,
          note: i.note || "",
        }));
        setItems(normalized);
        console.log("Items: ", items)
      })
      .catch(console.error);
  }, [changeCart]);

  // Update orderData whenever customerName, customerWhatsappNumber, or items change
  useEffect(() => {
    setOrderData({
      customerName: customerName || "John Doe",
      customerWhatsappNumber: customerWhatsappNumber || "+1234567890",
      businessAccountId: businessId,
      deliveryCharge: deliveryCharge,
      deliveryType: "delivery",
      items: items.map((item, index) => ({
        id: item.id,
        sectionTitle: "Rice", // Hardcoded for now, adjust as needed
        itemId: item.itemId,
        itemName: item.itemName,
        itemDescription: `${item.itemName}.`, // Simple description based on name
        // regPrice: item.regPrice.toString(),
        regPrice: String(item.itemRegPrice ?? 0),
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


  return (
    <div className="h-full w-full relative">
      {/* <div
        className={`${
          showPayment ? "sm:w-[40%] w-full" : "sm:w-[70%] w-full"
        } h-[90vh] sm:h-full`}
      > */}

      <AlertCard
        isVisible={showAlert}
        onClose={() => {
          setShowAlert(false);
        }}
        // itemName="Pizza Margherita"
        autoCloseDelay={5000}
      />

      {/* {!isCartOpen && <CartButton />} */}
      {!isCartOpen && <UserProfile />}

      <div
        className={`
          w-full h-[100vh]
          ${isCartOpen ? "pointer-events-none" : ""}
        `}
      >
        <HomeBody />
      </div>
      {/* // the cart tab should come here */}

      {isCartOpen && (
        <div
          className="fixed top-0 right-0 bottom-0 h-full w-full flex justify-end bg-gradient-to-br from-black/80 via-gray-900/90 to-black/80 backdrop-blur-sm"
          onClick={() => {
            setIsCartOpen(false);
            setActiveIndex(0);
          }}
        >
          <div
            className="sm:w-1/3 w-full sm:h-[100vh] h-[calc(100vh-64px)]"
            onClick={(e) => e.stopPropagation()}
          >
            <Orders />
          </div>
          {showPayment && (
            <div
              className="absolute sm:relative sm:w-1/3 w-full h-[100vh] z-300"
              onClick={(e) => e.stopPropagation()}
            >
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
      )}
    </div>
  );
};

export default Home;
