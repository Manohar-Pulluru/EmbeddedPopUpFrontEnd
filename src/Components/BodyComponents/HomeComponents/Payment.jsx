import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { CloseButton } from "./PaymentComponents/CloseButton";
import { PaymentMethodSelector } from "./PaymentComponents/PaymentMethodSelector";
import { PaypalForm } from "./PaymentComponents/PaypalForm";
import { CashForm } from "./PaymentComponents/CashForm";
import { PaymentFooter } from "./PaymentComponents/PaymentFooter";

// Initialize stripePromise with the publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentForm = ({ paymentDetails, setShowPayment }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSucceeded, setPaymentSucceeded] = useState(false);

  // Log initialization status
  useEffect(() => {
    if (!stripe || !elements) {
      console.warn("Stripe or Elements not initialized");
    }
  }, [stripe, elements]);

  // Format amount for display (Stripe amounts are in cents)
  const formatAmount = (amount) => `$${amount.toFixed(2)}`;

  // Handle form submission
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

  return (
    <div className="container bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <h1 className="text-2xl font-semibold text-[#32325d] mb-6 text-center">
        Complete Your Payment
      </h1>

      {/* Order Summary */}
      {paymentDetails && (
        <div className="order-summary mb-6 p-4 bg-[#f8f9fa] rounded-lg">
          <div className="flex justify-between mb-2 text-[#32325d]">
            <span>Order #{paymentDetails.orderId}</span>
          </div>
          <div className="flex justify-between mb-2 text-[#32325d]">
            <span>Subtotal</span>
            <span>{formatAmount(paymentDetails.amount - paymentDetails.applicationFeeAmount)}</span>
          </div>
          <div className="flex justify-between mb-2 text-[#32325d]">
            <span>Fee</span>
            <span>{formatAmount(paymentDetails.applicationFeeAmount)}</span>
          </div>
          <div className="flex justify-between font-bold border-t border-[#e6e6e6] pt-2 text-[#32325d]">
            <span>Total</span>
            <span>{formatAmount(paymentDetails.amount)}</span>
          </div>
        </div>
      )}

      {/* Payment Form */}
      {!paymentSucceeded ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-[#6b7c93]">
              Credit or debit card
            </label>
            <div className="border border-[#e6e6e6] rounded-md p-3 bg-white">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#32325d",
                      fontFamily:
                        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
                      "::placeholder": { color: "#aab7c4" },
                    },
                    invalid: { color: "#fa755a" },
                  },
                }}
                onChange={(event) => {
                  setError(event.error ? event.error.message : null);
                }}
              />
            </div>
            {error && (
              <div className="text-[#fa755a] text-sm mt-2" role="alert" id="card-errors">
                {error}
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={!stripe || isProcessing}
            className={`w-full py-3 rounded-md text-lg font-semibold text-white flex items-center justify-center transition-all duration-200 ${
              isProcessing ? "bg-[#6772e5] opacity-50 cursor-not-allowed" : "bg-[#6772e5] hover:bg-[#5469d4]"
            }`}
          >
            {isProcessing ? (
              <>
                <span className="spinner inline-block w-5 h-5 border-3 border-t-white border-[rgba(255,255,255,0.3)] rounded-full animate-spin mr-2"></span>
                Processing...
              </>
            ) : (
              `Pay ${paymentDetails ? formatAmount(paymentDetails.amount) : ""}`
            )}
          </button>
        </form>
      ) : (
        <div className="text-center success-message">
          <div className="text-5xl text-[#2dce89] mb-4 success-icon">✓</div>
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
    <div className="bg-[#f7f8f9] flex flex-col justify-between px-6 py-8 h-full w-full relative">
      <CloseButton onClose={() => setShowPayment(false)} />
      <div>
        <h2 className="text-2xl font-semibold text-[#32325d] mb-2">Payment</h2>
        <p className="text-[#6b7c93] text-sm mb-12">2 payment methods available</p>

        <PaymentMethodSelector
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
        />

        {paymentMethod === "Credit Card" && paymentDetails && (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret: paymentDetails.clientSecret,
              stripeAccount: paymentDetails.stripeAccountId, // Pass the connected account ID
            }}
          >
            <PaymentForm paymentDetails={paymentDetails} setShowPayment={setShowPayment} />
          </Elements>
        )}

        {paymentMethod === "Credit Card" && !paymentDetails && (
          <div className="text-[#6b7c93]">Loading payment details...</div>
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