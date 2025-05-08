import React, { useState, useEffect } from "react";
import { placeOrder } from "../../../Service/api";
import { CloseButton } from "./PaymentComponents/CloseButton";
import { PaymentMethodSelector } from "./PaymentComponents/PaymentMethodSelector";
import { CreditCardForm } from "./PaymentComponents/CreditCardForm";
import { PaypalForm } from "./PaymentComponents/PaypalForm";
import { CashForm } from "./PaymentComponents/CashForm";
import { PaymentFooter } from "./PaymentComponents/PaymentFooter";

export const Payment = ({
  setShowPayment,
  orderData,
  setChangeCart,
  changeCart,
}) => {

  console.log(orderData, "orderData__")
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [cardholderName, setCardholderName] = useState("Levi Ackerman");
  const [cardNumber, setCardNumber] = useState("2564 1421 0987 1244");
  const [expirationDate, setExpirationDate] = useState("02/2022");
  const [cvv, setCvv] = useState("***");
  const [email, setEmail] = useState("levi@example.com");
  const [amount, setAmount] = useState("140");
  const [businessId, setBusinessId] = useState("80b6fc97-aa38-46b1-bee8-a106d9b7cd96");

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

  const handleConfirmPayment = async () => {
    const payload = {
      customerName: orderData.customerName || "John Doe",
      customerWhatsappNumber: orderData.customerWhatsappNumber || "+1234567890",
      businessAccountId:
        orderData.businessAccountId || businessId,
      items: orderData.items.map((item, index) => ({
        id: item.id,
        sectionTitle: item.sectionTitle || "Rice",
        itemId: item.itemId,
        itemName: item.itemName,
        itemDescription: item.itemDescription || `${item.itemName}.`,
        regPrice: item.regPrice,
        salePrice: item.salePrice || "0",
        imageURL: item.imageURL,
        serial_number: item.serial_number || index + 1,
        productTemplateSectionId:
          item.productTemplateSectionId ||
          "20903f70-bc7a-48f0-89fc-07bbede56cf1",
        isHSTApplied: item.isHSTApplied || false,
        HSTPercentage: item.HSTPercentage || "13.00",
        inventoryId: item.inventoryId || null,
        inventoryName: item.inventoryName || null,
        isSyncToInventory: item.isSyncToInventory || false,
        createdAt: item.createdAt || "2025-04-18T14:23:31.222Z",
        updatedAt: item.updatedAt || "2025-04-18T14:23:31.222Z",
        quantity: item.quantity,
      })),
    };

    console.log(JSON.stringify(payload, null, 2));

    try {
      const response = await placeOrder(payload);
      let orderHistory = JSON.parse(
        localStorage.getItem("orderHistory") || "[]"
      );
      orderHistory.push(response.data);
      localStorage.setItem("orderHistory", JSON.stringify(orderHistory));
      localStorage.setItem("cartItems", JSON.stringify([]));
      setChangeCart(!changeCart);
      setShowPayment(false);
    } catch (error) {
      console.error("Failed to place order:", error);
    }
  };

  return (
    <div className="bg-[#1F1D2B] flex flex-col justify-between text-white px-6 py-8 border-l border-[#ea7c6965] h-full w-full relative">
      <CloseButton onClose={() => setShowPayment(false)} />
      <div>
        <h2 className="text-2xl font-semibold mb-2">Payment</h2>
        <p className="text-gray-400 text-sm mb-12">
          3 payment method available
        </p>

        <PaymentMethodSelector
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
        />

        {paymentMethod === "Credit Card" && (
          <CreditCardForm
            cardholderName={cardholderName}
            setCardholderName={setCardholderName}
            cardNumber={cardNumber}
            setCardNumber={setCardNumber}
            expirationDate={expirationDate}
            setExpirationDate={setExpirationDate}
            cvv={cvv}
            setCvv={setCvv}
          />
        )}

        {paymentMethod === "Paypal" && (
          <PaypalForm
            email={email}
            setEmail={setEmail}
            amount={amount}
            setAmount={setAmount}
          />
        )}

        {paymentMethod === "Cash" && (
          <CashForm amount={amount} setAmount={setAmount} />
        )}
      </div>

      <PaymentFooter
        onCancel={() => setShowPayment(false)}
        onConfirm={handleConfirmPayment}
      />
    </div>
  );
};

export default Payment;
