import React, { useEffect, useState, useMemo } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { CloseButton } from "./PaymentComponents/CloseButton";
import { PaymentMethodSelector } from "./PaymentComponents/PaymentMethodSelector";
import { ApplePayForm } from "./PaymentComponents/ApplePayForm";
import { GooglePayForm } from "./PaymentComponents/GooglePayForm";
import { PaymentFooter } from "./PaymentComponents/PaymentFooter";
import { useAppContext } from "../../../Service/Context/AppContext";

// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Payment form logic
const PaymentForm = ({
  setPaymentSucceeded,
  paymentDetails,
  deliveryCharge,
  paymentSucceeded,
  setSubtotal
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { setActiveTab, setShowPayment } = useAppContext();

  // Log initialization and paymentDetails
  useEffect(() => {
    console.log("PaymentDetails:", paymentDetails);
    if (!stripe || !elements) {
      console.warn("Stripe or Elements not initialized");
    }
  }, [stripe, elements]);

  // Format amount for display
  const formatAmount = (amount) => `$${amount.toFixed(2)}`;

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.error("Stripe or Elements not loaded");
      setError("Payment system not initialized. Please try again.");
      return;
    }

    if (!paymentDetails.clientSecret) {
      setError("Invalid payment details. Please try again.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const cardElement = elements.getElement(CardElement);
      const result = await stripe.confirmCardPayment(
        paymentDetails.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: paymentDetails.customerName || "Unknown",
            },
          },
        }
      );

      if (result.error) {
        setError(result.error.message);
        setIsProcessing(false);
      } else if (result.paymentIntent.status === "succeeded") {
        setPaymentSucceeded(true); // Update parent state
        console.log("Payment succeeded with ID:", result.paymentIntent.id);
      }
    } catch (error) {
      console.error("Error confirming payment:", error);
      setError("An unexpected error occurred. Please try again.");
      setIsProcessing(false);
    }
  };

  // Check for missing payment details
  if (!paymentDetails || !paymentDetails.clientSecret) {
    return (
      <div className="text-[#fa755a] text-center text-sm md:text-base">
        Error: Payment details are missing or invalid.
      </div>
    );
  }

  return (
    <div className="container bg-transparent p-2 md:p-6 rounded-lg max-w-md mx-auto">
      <h1 className="text-base md:text-2xl font-semibold text-[#ffffff] mb-3 md:mb-6 text-center">
        Payment Details
      </h1>

      {/* Order Summary */}
      <div className="order-summary mb-3 md:mb-6 p-2 md:p-4 bg-transparent rounded-lg">
        <div className="flex justify-between mb-1 md:mb-2 text-[#ffffff] text-xs md:text-base">
          <span>Order #{paymentDetails.orderId}</span>
        </div>
        <div className="flex justify-between mb-1 md:mb-2 text-[#ffffff] text-xs md:text-base">
          <span>Subtotal</span>
          <span>
            {formatAmount(
              paymentDetails.amount - paymentDetails.applicationFeeAmount
            )}
          </span>
        </div>
        <div className="flex justify-between mb-1 md:mb-2 text-[#ffffff] text-xs md:text-base">
          <span>Delivery</span>
          <span>
            {formatAmount(
              // paymentDetails.deliveryCharges
              deliveryCharge
            )}
          </span>
        </div>
        <div className="flex justify-between mb-1 md:mb-2 text-[#ffffff] text-xs md:text-base">
          <span>Fee</span>
          <span>{formatAmount(paymentDetails.applicationFeeAmount)}</span>
        </div>
        <div className="flex justify-between font-bold border-t border-[#e6e6e6] pt-1 md:pt-2 text-[#ffffff] text-xs md:text-base">
          <span>Total</span>
          <span>{formatAmount(paymentDetails.amount)}</span>
        </div>
      </div>

      {/* Payment Form or Success Message */}
      {/* here there is a problem in this box */}
      {!paymentSucceeded ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-3 md:mb-4">
            <label className="block text-xs md:text-sm font-medium mb-1 md:mb-2 text-[#ffffff]">
              Credit or debit card
            </label>
            <div className="border border-[#e6e6e6] rounded-md p-2 md:p-3 bg-white">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "12px",
                      color: "#32325d",
                      "::placeholder": { color: "#aab7c4" },
                    },
                    invalid: { color: "#fa755a" },
                  },
                }}
                onChange={(event) =>
                  setError(event.error ? event.error.message : null)
                }
              />
            </div>
            {error && (
              <div
                className="text-[#fa755a] text-xs md:text-sm mt-1 md:mt-2"
                role="alert"
              >
                {error}
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={!stripe || isProcessing}
            className={`w-full py-2 md:py-3 rounded-md text-sm md:text-lg font-semibold text-white flex items-center justify-center transition-colors duration-200 ${
              isProcessing
                ? "bg-gray-500 opacity-50 cursor-not-allowed"
                : "bg-[#ea7c69] hover:bg-[#db8070]"
            }`}
          >
            {isProcessing ? (
              <>
                <span className="inline-block w-3 h-3 md:w-5 md:h-5 border-2 border-t-white border-gray-300 rounded-full animate-spin mr-2"></span>
                <span className="text-xs md:text-base">Processing...</span>
              </>
            ) : (
              `Pay ${formatAmount(paymentDetails.amount)}`
            )}
          </button>
        </form>
      ) : (
        <div className="text-center">
          <div className="text-2xl md:text-5xl text-[#2dce89] mb-2 md:mb-4">
            ✓
          </div>
          <h2 className="text-base md:text-xl font-semibold text-[#ffffff] mb-1 md:mb-2">
            Payment successful!
          </h2>
          <p className="text-[#ffffff] mb-2 md:mb-4 text-xs md:text-base">
            Thank you for your payment. A receipt has been sent to your email.
          </p>
          <button
            onClick={() => {
              setSubtotal(0);
              localStorage.setItem("cartItems", JSON.stringify([]));
              window.location.reload();
              setShowPayment(false);
              setActiveTab("Cart");
            }}
            className="bg-[#ea7c69] hover:bg-[#db8070] text-white py-2 px-4 rounded-md text-xs md:text-base"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

// Payment component
const Payment = ({
  orderData,
  paymentDetails,
  setShowPayment,
  setSubtotal,
  deliveryCharge,
}) => {
  const { toggleCart, setActiveTab } = useAppContext();
  const options = useMemo(
    () => ({
      clientSecret: paymentDetails.clientSecret,
      stripeAccount: paymentDetails.stripeAccountId,
    }),
    [paymentDetails.clientSecret, paymentDetails.stripeAccountId]
  );

  // Initialize stripePromise inside Payment
  const stripePromise = loadStripe(
    import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
    {
      stripeAccount: paymentDetails.stripeAccountId, // Add stripeAccount here
    }
  );

  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [email, setEmail] = useState("levi@example.com");
  const [amount, setAmount] = useState(paymentDetails.amount || "140");
  const [paymentSucceeded, setPaymentSucceeded] = useState(false); // Moved state to Payment component

  // Log paymentDetails and stripePromise status
  useEffect(() => {
    console.log("Payment Details in Payment Component:", paymentDetails);
    stripePromise
      .then((stripe) => {
        console.log("Stripe SDK initialized:", !!stripe);
      })
      .catch((error) => {
        console.error("Failed to initialize Stripe SDK:", error);
      });
  }, [paymentDetails]);

  // Main render
  return (
    <div className="bg-[#1F1D2B] flex flex-col justify-between text-white px-3 md:px-6 py-4 md:py-8 border-l border-[#ea7c6965] h-full w-full relative">
      <CloseButton
        onClose={() => {
          console.log(paymentSucceeded, "Payment succeeded status");
          if (paymentSucceeded) {
            setSubtotal(0);
            localStorage.setItem("cartItems", JSON.stringify([]));
            // toggleCart();
            window.location.reload();
          }
          setShowPayment(false);
          setActiveTab("Cart");
        }}
      />
      <div>
        <h2 className="text-lg md:text-2xl font-semibold mb-1 md:mb-2">
          Payment
        </h2>
        <p className="text-gray-400 text-xs md:text-sm mb-6 md:mb-12">
          3 payment methods available
        </p>

        <PaymentMethodSelector
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
        />

        {/* {paymentMethod === "Credit Card" && paymentDetails && (
          <Elements
            stripe={stripePromise}
            // options={{
            //   clientSecret: paymentDetails.clientSecret,
            //   stripeAccount: paymentDetails.stripeAccountId,
            // }}
            options={options} // Use the options object created above
          >
            <PaymentForm setPaymentSucceeded={setPaymentSucceeded} />
          </Elements>
        )}

        {paymentMethod === "Credit Card" && !paymentDetails && (
          <div className="text-gray-400 text-sm md:text-base">
            Loading payment details...
          </div>
        )} */}

        {paymentMethod === "Credit Card" &&
        paymentDetails &&
        paymentDetails.clientSecret ? (
          <Elements stripe={stripePromise} options={options}>
            <PaymentForm
              setPaymentSucceeded={setPaymentSucceeded}
              paymentDetails={paymentDetails}
              deliveryCharge={deliveryCharge}
              paymentSucceeded={paymentSucceeded}
              setSubtotal={setSubtotal}
            />
          </Elements>
        ) : paymentMethod === "Credit Card" ? (
          <div className="text-gray-400 text-sm md:text-base">
            Loading payment details...
          </div>
        ) : null}

        {paymentMethod === "Apple Pay" && (
          <ApplePayForm
            email={email}
            setEmail={setEmail}
            amount={amount}
            setAmount={setAmount}
          />
        )}

        {paymentMethod === "Google Pay" && (
          <GooglePayForm amount={amount} setAmount={setAmount} />
        )}
      </div>

      <PaymentFooter onCancel={() => setShowPayment(false)} />
    </div>
  );
};

export default Payment;
