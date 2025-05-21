// ```jsx
import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { CloseButton } from "./PaymentComponents/CloseButton";
import { PaymentMethodSelector } from "./PaymentComponents/PaymentMethodSelector";
import { PaypalForm } from "./PaymentComponents/PaypalForm";
import { CashForm } from "./PaymentComponents/CashForm";
import { PaymentFooter } from "./PaymentComponents/PaymentFooter";

// Initialize stripePromise
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// PaymentForm component for Stripe card payment
const PaymentForm = ({ paymentDetails, setShowPayment }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSucceeded, setPaymentSucceeded] = useState(false);

  useEffect(() => {
    if (!stripe || !elements) {
      console.warn("Stripe or Elements not initialized");
    }
  }, [stripe, elements]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.error("Stripe or Elements not loaded");
      setError("Payment system not initialized. Please try again.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const cardElement = elements.getElement(CardElement);
      const result = await stripe.confirmCardPayment(paymentDetails.clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: paymentDetails.customerName || "Unknown",
          },
        },
      });

      if (result.error) {
        setError(result.error.message);
        setIsProcessing(false);
      } else if (result.paymentIntent.status === "succeeded") {
        setPaymentSucceeded(true);
        console.log("Payment succeeded with ID:", result.paymentIntent.id);
        // Optionally close the payment screen after a delay
        // setTimeout(() => setShowPayment(false), 2000);
      }
    } catch (error) {
      console.error("Error confirming payment:", error);
      setError("An unexpected error occurred. Please try again.");
      setIsProcessing(false);
    }
  };

  // Format amount for display
  const formatAmount = (amount) => `$${amount.toFixed(2)}`;

  return (
    <div className="container bg-transparent p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <h1 className="text-2xl font-semibold text-[#ffffff] mb-6 text-center">
        Payment Details
      </h1>

      {/* Order Summary */}
      {paymentDetails && (
        <div className="order-summary mb-6 p-4 bg-transparent rounded-lg">
          <div className="flex justify-between mb-2 text-[#ffffff]">
            <span>Order #{paymentDetails.orderId}</span>
          </div>
          <div className="flex justify-between mb-2 text-[#ffffff]">
            <span>Subtotal</span>
            <span>{formatAmount(paymentDetails.amount - paymentDetails.applicationFeeAmount)}</span>
          </div>
          <div className="flex justify-between mb-2 text-[#ffffff]">
            <span>Fee</span>
            <span>{formatAmount(paymentDetails.applicationFeeAmount)}</span>
          </div>
          <div className="flex justify-between font-bold border-t border-[#e6e6e6] pt-2 text-[#ffffff]">
            <span>Total</span>
            <span>{formatAmount(paymentDetails.amount)}</span>
          </div>
        </div>
      )}

      {/* Payment Form */}
      {!paymentSucceeded ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-[#ffffff]">
              Credit or debit card
            </label>
            <div className="border border-[#e6e6e6] rounded-md p-3 bg-white">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#32325d",
                      "::placeholder": { color: "#aab7c4" },
                    },
                    invalid: { color: "#fa755a" },
                  },
                }}
              />
            </div>
            {error && (
              <div className="text-[#fa755a] text-sm mt-2" role="alert">
                {error}
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={!stripe || isProcessing}
            className={`w-full py-3 rounded-md text-lg font-semibold text-white flex items-center justify-center ${
              isProcessing ? "bg-gray-500" : "bg-[#ea7c69] hover:bg-[#db8070]"
            }`}
          >
            {isProcessing ? (
              <>
                <span className="spinner inline-block w-5 h-5 border-2 border-t-white border-gray-300 rounded-full animate-spin mr-2"></span>
                Processing...
              </>
            ) : (
              `Pay ${paymentDetails ? formatAmount(paymentDetails.amount) : ""}`
            )}
          </button>
        </form>
      ) : (
        <div className="text-center">
          <div className="text-5xl text-[#2dce89] mb-4">✓</div>
          <h2 className="text-xl font-semibold text-[#32325d] mb-2">Payment successful!</h2>
          <p className="text-[#6b7c93]">Thank you for your payment. A receipt has been sent to your email.</p>
        </div>
      )}
    </div>
  );
};

export const Payment = ({
  setShowPayment,
  orderData,
  setChangeCart,
  changeCart,
  businessId,
  setPaymentDetails,
  paymentDetails,
}) => {
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [email, setEmail] = useState("levi@example.com");
  const [amount, setAmount] = useState("140");

  // Log paymentDetails and stripePromise status
  useEffect(() => {
    console.log("Payment Details in Payment Component:", paymentDetails);
    stripePromise.then((stripe) => {
      console.log("Stripe SDK initialized:", !!stripe);
    }).catch((error) => {
      console.error("Failed to initialize Stripe SDK:", error);
    });
  }, [paymentDetails]);

  return (
    <div className="bg-[#1F1D2B] flex flex-col justify-between text-white px-6 py-8 border-l border-[#ea7c6965] h-full w-full relative">
      <CloseButton onClose={() => setShowPayment(false)} />
      <div>
        <h2 className="text-2xl font-semibold mb-2">Payment</h2>
        <p className="text-gray-400 text-sm mb-12">2 payment method available</p>

        <PaymentMethodSelector
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
        />

        {paymentMethod === "Credit Card" && paymentDetails && (
          <Elements stripe={stripePromise} options={{ clientSecret: paymentDetails.clientSecret }}>
            <PaymentForm paymentDetails={paymentDetails} setShowPayment={setShowPayment} />
          </Elements>
        )}

        {paymentMethod === "Credit Card" && !paymentDetails && (
          <div className="text-gray-400">Loading payment details...</div>
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

      <PaymentFooter onCancel={() => setShowPayment(false)} />
    </div>
  );
};

export default Payment;
