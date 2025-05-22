import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const CheckoutForm = ({ paymentDetails, setShowPayment }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [paymentSucceeded, setPaymentSucceeded] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    const cardElement = elements.getElement(CardElement);

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      paymentDetails.clientSecret,
      {
        payment_method: {
          card: cardElement,
          billing_details: { name: paymentDetails.customerName }
        }
      }
    );

    if (error) {
      setError(error.message);
    } else if (paymentIntent.status === "succeeded") {
      setPaymentSucceeded(true);
      console.log("Payment succeeded:", paymentIntent.id);
    }
    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!paymentSucceeded ? (
        <>
          <CardElement />
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={!stripe || isProcessing}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {isProcessing ? "Processing..." : `Pay $${paymentDetails.amount}`}
          </button>
        </>
      ) : (
        <div className="text-green-500 text-xl font-bold">Payment Succeeded!</div>
      )}
    </form>
  );
};

export default CheckoutForm;
