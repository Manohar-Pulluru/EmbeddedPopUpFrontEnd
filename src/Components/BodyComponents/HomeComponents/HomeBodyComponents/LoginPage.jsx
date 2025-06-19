import React, { useState, useEffect, useRef, useContext } from "react";
import { postWithoutAuth } from "../../../../Service/httpService";
import { createUser } from "../../../../Service/api";
import { AppContext } from "../../../../Service/Context/AppContext";

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || "";

export const LoginPage = () => {
  const { setLoginPage, businessId } = useContext(AppContext);
  const [mode, setMode] = useState("login"); // "login" or "signup"
  const [step, setStep] = useState(1); // 1 for email/form, 2 for OTP
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(""); // Single string for OTP (e.g., "1234")
  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0); // 60-second cooldown
  const otpInputs = useRef([]); // Refs for OTP input fields
  const [isAddressValidating, setIsAddressValidating] = useState(false);
  const [validationSuccess, setValidationSuccess] = useState(false);

  // Signup form fields
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    phoneNo: "",
    address: "",
    city: "",
    pincode: "",
    province_or_territory: "",
  });
  const [signupErrors, setSignupErrors] = useState({});

  // api's:
  const sendOtp = async (email) => {
    try {
      const response = await fetch(
        "https://qa3.getafto.com/backend/user/signIn",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error sending OTP:", error);
      return { status: false, message: "Network error" };
    }
  };

  const verifyOtp = async (email, otp) => {
    try {
      const response = await fetch(
        "https://qa3.getafto.com/backend/user_otps/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp }),
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error verifying OTP:", error);
      return { status: false, message: "Network error" };
    }
  };

  const customerSignup = async (signupData, businessAccountId) => {
    try {
      const response = await fetch(
        "https://qa3.getafto.com/backend/embedded/user/signup-chatwoot",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "embedded-static-token":
              "mw7f8Ch2MSC300bHKEthp9CGZEIJL8A17d7fuYzT1PcROuHNPEVmEFYUyfmDrIFvpHglqusu4OwvUjAKpZM9ptRbAD7UihMOX2u6bZAdIkjLb7iDRqUIozYCi94HlIvoJO2IyX6AWBhacbHiVQE349ruLWwhfPlNXtoUg8xWweWtuHuaZDZD",
          },
          body: JSON.stringify({
            signupData: {
              name: signupData.name,
              email: signupData.email,
              blocked: false,
              phone_number: signupData.phoneNo,
              avatar_url: "", // Optional: Add avatar if needed
              additional_attributes: {
                address: signupData.address,
                city: signupData.city,
                pincode: signupData.pincode,
                province_or_territory: signupData.province_or_territory,
              },
            },
            businessAccountId,
          }),
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Customer signup failed:", error);
      return { status: false, message: "Network error" };
    }
  };

  const getCustomerData = async (email, businessAccountId) => {
    try {
      const response = await fetch(
        "https://qa3.getafto.com/backend/embedded/user/signin-chatwoot",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "embedded-static-token":
              "mw7f8Ch2MSC300bHKEthp9CGZEIJL8A17d7fuYzT1PcROuHNPEVmEFYUyfmDrIFvpHglqusu4OwvUjAKpZM9ptRbAD7UihMOX2u6bZAdIkjLb7iDRqUIozYCi94HlIvoJO2IyX6AWBhacbHiVQE349ruLWwhfPlNXtoUg8xWweWtuHuaZDZD",
          },
          body: JSON.stringify({
            businessAccountId,
            email,
          }),
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching customer data:", error);
      return { status: false, message: "Network error" };
    }
  };

  const validateCanadaAddress = async (enteredAddress) => {
    setIsAddressValidating(true);
    setValidationSuccess(false);
    try {
      const payload = {
        address: { regionCode: "CA", addressLines: [enteredAddress] },
      };

      const response = await fetch(
        `https://addressvalidation.googleapis.com/v1:validateAddress?key=${GOOGLE_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      const pa = data?.result?.address?.postalAddress;
      if (pa) {
        // const formattedAddress = data?.result?.address?.formattedAddress || enteredAddress;
        setSignupData((prev) => ({
          ...prev,
          // address: formattedAddress,
          city: pa.locality || "",
          pincode: pa.postalCode || "",
          province_or_territory: pa.administrativeArea || "",
        }));
      } else if (data?.result?.suggestions?.length) {
        const suggestion = data.result.suggestions[0].address.formattedAddress;
        setSignupData((prev) => ({
          ...prev,
          address: suggestion,
        }));
        validateCanadaAddress(suggestion); // recursive call
      }
      setValidationSuccess(true);
      setTimeout(() => setValidationSuccess(false), 3000);
    } catch (err) {
      console.error("Address validation failed", err);
    } finally {
      setIsAddressValidating(false);
    }
  };

  const handleValidateClick = () => {
    if (!signupData.address.trim()) {
      setSignupErrors((prev) => ({
        ...prev,
        address: "Address is required",
      }));
      return;
    }
    validateCanadaAddress(signupData.address);
  };

  // Handle resend OTP timer
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendTimer]);

  // Validate signup form
  const validateSignupForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!signupData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!signupData.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(signupData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!signupData.phoneNo.trim()) {
      errors.phoneNo = "Phone number is required";
    } else if (!phoneRegex.test(signupData.phoneNo.replace(/\D/g, ""))) {
      errors.phoneNo = "Please enter a valid 10-digit phone number";
    }

    if (!signupData.address.trim()) {
      errors.address = "Address is required";
    }
    if (!signupData.city.trim()) {
      errors.city = "City is required";
    }
    if (!signupData.pincode.trim()) {
      errors.pincode = "Pincode is required";
    }

    return errors;
  };

  // Handle signup form input changes
  const handleSignupInputChange = (field, value) => {
    setSignupData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear specific field error when user starts typing
    if (signupErrors[field]) {
      setSignupErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // Handle signup form submission
  const handleSignupSubmit = async () => {
    const errors = validateSignupForm();
    if (Object.keys(errors).length > 0) {
      setSignupErrors(errors);
      return;
    }
    // 👉 block if address never validated
    if (!validationSuccess) {
      setSignupErrors((prev) => ({
        ...prev,
        address: "Please validate your address first",
      }));
      return;
    }

    // Block if phone not validated
    // if (!phoneValidationSuccess) {
    //   setSignupErrors((prev) => ({
    //     ...prev,
    //     phoneNo: "Please verify your WhatsApp number",
    //   }));
    //   return;
    // }

    localStorage.setItem(
      "aftoSignupForm",
      JSON.stringify({
        name: signupData.name,
        email: signupData.email,
        phoneNo: signupData.phoneNo,
        address: signupData.address,
        city: signupData.city,
        pincode: signupData.pincode,
        province_or_territory: signupData.province_or_territory,
      })
    );

    // Get and log the just-saved signup data from localStorage
    const savedSignupForm = localStorage.getItem("aftoSignupForm");
    console.log("UserData:", savedSignupForm ? JSON.parse(savedSignupForm) : null);

    setIsLoading(true);
    try {
      const response = await customerSignup(signupData, businessId);

      if (response?.status) {
        alert("Account created successfully! Please login with your email.");
        setSignupData({
          name: "",
          email: "",
          phoneNo: "",
          address: "",
          city: "",
          pincode: "",
          province_or_territory: "",
        });
        setSignupErrors({});
        setMode("login");
        setStep(1);
      } else {
        alert(response?.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("An error occurred during signup.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle email submission (for login)
  const handleEmailSubmit = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      // const response = await postWithoutAuth("/user/signIn", { email });
      const response = await sendOtp(email);
      if (response.status) {
        setEmailError("");
        setStep(2);
        setResendTimer(60); // Start 60-second cooldown
      } else {
        setEmailError(response.message || "Failed to send OTP");
      }
    } catch (error) {
      setEmailError(error.response?.message || "Network error");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return; // Allow only single digit or empty

    const newOtp = otp.split("");
    newOtp[index] = value;
    const updatedOtp = newOtp.join("").slice(0, 4); // Ensure max 4 digits
    setOtp(updatedOtp);

    // Auto-focus next input
    if (value && index < 3 && updatedOtp.length <= index + 1) {
      otpInputs.current[index + 1]?.focus();
    }
    // Auto-focus previous input on delete
    if (!value && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }

    setOtpError(""); // Clear error on input
  };

  // Handle OTP paste
  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getText().replace(/\D/g, "").slice(0, 4);
    if (pasted.length === 4) {
      setOtp(pasted);
      otpInputs.current[3]?.focus(); // Focus last input
      e.preventDefault();
    }
  };

  // Handle OTP submission
  const handleOtpSubmit = async () => {
    if (otp.length !== 4 || !/^\d{4}$/.test(otp)) {
      setOtpError("Please enter a valid 4-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      // const response = await postWithoutAuth("/user_otps/verify-otp", {
      //   email,
      //   otp,
      // });
      const response = await verifyOtp(email, otp);

      console.log(response?.entity?.token, "response");
      if (response.status) {
        setOtpError("");

        const createUserResponse = await createUser({
          businessAccountId: businessId,
          email: email,
        });

        console.log(createUserResponse, "createUserResponse");
        setLoginPage(false);
        console.log(`${mode === "login" ? "Login" : "Signup"} successful`);
        localStorage.setItem("aftoAuthToken", response?.entity?.token);

        getCustomerData(email, businessId).then((customerData) => {
          if (customerData.status) {
            localStorage.setItem("aftoAuthCustomerId", customerData.entity.id);
            localStorage.setItem(
              "aftoAuthCustomerName",
              customerData.entity.name
            );
            localStorage.setItem(
              "aftoAuthCustomerEmail",
              customerData.entity.email
            );
          } else {
            console.error(
              "Failed to fetch customer data:",
              customerData.message
            );
          }
        });
      } else {
        setOtpError(response.message || "Invalid OTP");
      }
    } catch (error) {
      setOtpError(error.response?.message || "OTP verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resend OTP
  const handleResendOtp = async () => {
    setOtp("");
    setOtpError("");
    await handleEmailSubmit();
  };

  // Handle close button
  const handleClose = () => {
    setLoginPage(false);
  };

  // Toggle between login and signup
  const toggleMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    setStep(1);
    setEmail("");
    setOtp("");
    setEmailError("");
    setOtpError("");
    setResendTimer(0);
    setSignupData({
      name: "",
      email: "",
      phoneNo: "",
      address: "",
      city: "",
      pincode: "",
      province_or_territory: "",
    });
    setSignupErrors({});
  };

  // Render validate button content based on state
  const renderValidateButtonContent = () => {
    if (isAddressValidating) {
      return (
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 sm:w-3 sm:h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs hidden sm:inline">...</span>
        </div>
      );
    }

    if (validationSuccess) {
      return (
        <div className="flex items-center gap-1">
          <svg
            className="w-2 h-2 sm:w-3 sm:h-3"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-xs hidden sm:inline">Done</span>
        </div>
      );
    }

    return <span className="text-xs font-medium">Validate</span>;
  };

  const [isPhoneValidating, setIsPhoneValidating] = useState(false);
  const [phoneValidationSuccess, setPhoneValidationSuccess] = useState(false);
  const [showPhoneOtp, setShowPhoneOtp] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState(["", "", "", "", "", ""]); // 6 digit
  const phoneOtpInputs = useRef([]); // for input refs
  const [phoneOtpError, setPhoneOtpError] = useState("");
  const [phoneResendTimer, setPhoneResendTimer] = useState(0);

  useEffect(() => {
    if (phoneResendTimer > 0) {
      const timer = setInterval(() => {
        setPhoneResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [phoneResendTimer]);

  // Send WhatsApp OTP (mock or replace with your API)
  const sendPhoneOtp = async (phoneNo) => {
    try {
      // You may need to update the URL and params as per your backend
      const response = await fetch(
        "https://qa3.getafto.com/backend/whatsapp/send-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phone_number: phoneNo }),
        }
      );
      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Error sending WhatsApp OTP:", err);
      return { status: false, message: "Network error" };
    }
  };

  const verifyPhoneOtp = async (phoneNo, otp) => {
    try {
      const response = await fetch(
        "https://qa3.getafto.com/backend/whatsapp/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phone_number: phoneNo, otp }),
        }
      );
      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Error verifying WhatsApp OTP:", err);
      return { status: false, message: "Network error" };
    }
  };

  /* Updated renderPhoneValidateButtonContent function */
  const renderPhoneValidateButtonContent = () => {
    if (isPhoneValidating) {
      return (
        <>
          <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="hidden sm:inline">Sending...</span>
        </>
      );
    }

    if (phoneValidationSuccess) {
      return (
        <>
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          <span className="hidden sm:inline">Verified</span>
        </>
      );
    }

    return (
      <>
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.485 3.488" />
        </svg>
        <span className="hidden sm:inline">Verify</span>
      </>
    );
  };

  const handlePhoneValidateClick = async () => {
    setIsPhoneValidating(true);
    setPhoneValidationSuccess(false);
    setShowPhoneOtp(false);
    setPhoneOtp(["", "", "", "", "", ""]);
    setPhoneOtpError("");

    // const response = await sendPhoneOtp(signupData.phoneNo);
    const response = { status: true };

    setIsPhoneValidating(false);
    if (response.status) {
      setShowPhoneOtp(true);
      setPhoneResendTimer(60);
      setPhoneOtpError("");
    } else {
      setShowPhoneOtp(false);
      setPhoneOtpError(response.message || "Could not send OTP.");
    }
  };

  const handlePhoneOtpChange = (idx, value) => {
    if (!/^\d?$/.test(value)) return; // only digit or empty

    const newOtp = [...phoneOtp];
    newOtp[idx] = value;
    setPhoneOtp(newOtp);

    setPhoneOtpError(""); // clear error

    // Auto focus next input
    if (value && idx < 5) {
      phoneOtpInputs.current[idx + 1]?.focus();
    }
    // Auto focus prev input on delete
    if (!value && idx > 0) {
      phoneOtpInputs.current[idx - 1]?.focus();
    }
  };

  const handlePhoneOtpSubmit = async () => {
    const enteredOtp = phoneOtp.join("");
    if (enteredOtp.length !== 6) {
      setPhoneOtpError("Please enter the 6-digit OTP");
      return;
    }
    setIsPhoneValidating(true);
    setPhoneOtpError("");
    const response = await verifyPhoneOtp(signupData.phoneNo, enteredOtp);
    setIsPhoneValidating(false);

    if (response.status) {
      setPhoneValidationSuccess(true);
      setShowPhoneOtp(false);
      setSignupErrors((prev) => ({ ...prev, phoneNo: undefined }));
      setPhoneOtpError("");
    } else {
      setPhoneValidationSuccess(false);
      setPhoneOtpError(response.message || "Invalid OTP");
    }
  };

  const handlePhoneResendOtp = async () => {
    if (phoneResendTimer > 0) return;
    setPhoneOtp(["", "", "", "", "", ""]);
    setPhoneOtpError("");
    await handlePhoneValidateClick();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-black/80 via-gray-900/90 to-black/80 backdrop-blur-sm z-50 p-2 sm:p-4">
      <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 text-white w-full max-w-xs sm:max-w-md md:max-w-lg max-h-[98vh] overflow-y-auto rounded-2xl shadow-xl border border-slate-700/50 relative backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-orange-500/10 rounded-2xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-20 text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-all duration-200"
          aria-label="Close login modal"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="relative z-10 p-4 sm:p-6 flex flex-col items-center">
          {mode === "signup" ? (
            // Signup Form
            <div className="w-full">
              <div className="text-center mb-4 sm:mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold mb-1 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  Create Account
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm">
                  Join us and get started today
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-2 mb-4">
                {/* Name */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="signup-name"
                    className="block text-xs sm:text-sm font-medium text-slate-300 mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    id="signup-name"
                    type="text"
                    value={signupData.name}
                    onChange={(e) =>
                      handleSignupInputChange("name", e.target.value)
                    }
                    placeholder="Enter your full name"
                    className="w-full py-2 px-3 rounded-lg border border-slate-600 text-white bg-slate-800/50 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200 text-sm"
                    aria-invalid={!!signupErrors.name}
                    disabled={isLoading}
                  />
                  {signupErrors.name && (
                    <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                      {signupErrors.name}
                    </p>
                  )}
                </div>
                {/* Email */}
                <div>
                  <label
                    htmlFor="signup-email"
                    className="block text-xs sm:text-sm font-medium text-slate-300 mb-1"
                  >
                    Email
                  </label>
                  <input
                    id="signup-email"
                    type="email"
                    value={signupData.email}
                    onChange={(e) =>
                      handleSignupInputChange("email", e.target.value)
                    }
                    placeholder="your@email.com"
                    className="w-full py-2 px-3 rounded-lg border border-slate-600 text-white bg-slate-800/50 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200 text-sm"
                    aria-invalid={!!signupErrors.email}
                    disabled={isLoading}
                  />
                  {signupErrors.email && (
                    <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                      {signupErrors.email}
                    </p>
                  )}
                </div>
                {/* Phone + OTP (keep both inside grid col) */}
                <div>
                  <label
                    htmlFor="signup-phone"
                    className="block text-xs sm:text-sm font-medium text-slate-300 mb-1"
                  >
                    Phone
                  </label>
                  <div className="relative">
                    <input
                      id="signup-phone"
                      type="tel"
                      value={signupData.phoneNo}
                      onChange={(e) =>
                        handleSignupInputChange("phoneNo", e.target.value)
                      }
                      placeholder="(555) 000-0000"
                      className="w-full py-2 px-3 pr-20 rounded-lg border border-slate-600 text-white bg-slate-800/50 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200 text-sm"
                      aria-invalid={!!signupErrors.phoneNo}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      disabled={isPhoneValidating || !signupData.phoneNo}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 py-1.5 px-2.5 rounded-md text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                        phoneValidationSuccess
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      } ${
                        !signupData.phoneNo
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={handlePhoneValidateClick}
                    >
                      {renderPhoneValidateButtonContent()}
                    </button>
                  </div>
                  {signupErrors.phoneNo && (
                    <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                      {signupErrors.phoneNo}
                    </p>
                  )}
                </div>
                {showPhoneOtp && (
                  <div className="sm:col-span-2 mt-2 p-3 bg-slate-800/50 rounded-lg border border-slate-600">
                    <div className="flex items-center gap-2 mb-2">
                      <svg
                        className="w-4 h-4 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17.472 ..." />
                      </svg>
                      <span className="text-xs font-medium text-slate-300">
                        WhatsApp Verification
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mb-2">
                      Enter the 6-digit code sent to your WhatsApp
                    </p>
                    <div className="flex gap-1 mb-2 justify-center">
                      {[...Array(6)].map((_, idx) => (
                        <input
                          key={idx}
                          ref={(el) => (phoneOtpInputs.current[idx] = el)}
                          type="text"
                          value={phoneOtp[idx] || ""}
                          onChange={(e) =>
                            handlePhoneOtpChange(idx, e.target.value)
                          }
                          maxLength="1"
                          className="w-8 h-8 text-center text-sm font-bold rounded border border-slate-600 text-white bg-slate-800/50 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/20 transition-all duration-200"
                          aria-label={`WhatsApp OTP digit ${idx + 1}`}
                          disabled={isLoading}
                        />
                      ))}
                    </div>
                    {phoneOtpError && (
                      <p className="text-red-400 text-xs mb-2 flex items-center gap-1">
                        {phoneOtpError}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={handlePhoneOtpSubmit}
                        disabled={isLoading || phoneOtp.join("").length !== 6}
                        className={`flex-1 py-1.5 px-3 rounded text-xs font-medium bg-green-600 hover:bg-green-700 text-white transition-all duration-200 ${
                          isLoading || phoneOtp.join("").length !== 6
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        {isLoading ? "Verifying..." : "Verify"}
                      </button>
                      {phoneResendTimer > 0 ? (
                        <span className="flex-1 py-1.5 px-3 text-xs text-slate-400 text-center">
                          Resend in {phoneResendTimer}s
                        </span>
                      ) : (
                        <button
                          onClick={handlePhoneResendOtp}
                          className="flex-1 py-1.5 px-3 rounded text-xs text-slate-400 hover:text-white border border-slate-600 hover:border-slate-500 transition-all duration-200"
                        >
                          Resend
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Address */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="signup-address"
                    className="block text-xs sm:text-sm font-medium text-slate-300 mb-1"
                  >
                    Address
                  </label>
                  <div className="relative">
                    <textarea
                      id="signup-address"
                      value={signupData.address}
                      onChange={(e) =>
                        handleSignupInputChange("address", e.target.value)
                      }
                      placeholder="Enter your address"
                      rows="2"
                      className="w-full py-2 px-3 rounded-lg border border-slate-600 text-white bg-slate-800/50 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200 resize-none text-sm"
                      aria-invalid={!!signupErrors.address}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      disabled={isAddressValidating}
                      className={`absolute right-1 top-1/2 -translate-y-1/2 py-0.5 px-2 rounded bg-green-600 text-white text-xs transition ${
                        validationSuccess ? "bg-green-700" : ""
                      }`}
                      onClick={handleValidateClick}
                    >
                      {renderValidateButtonContent()}
                    </button>
                  </div>
                  {signupErrors.address && (
                    <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                      {signupErrors.address}
                    </p>
                  )}
                </div>
                {/* City */}
                <div>
                  <label
                    htmlFor="signup-city"
                    className="block text-xs sm:text-sm font-medium text-slate-300 mb-1"
                  >
                    City
                  </label>
                  <input
                    id="signup-city"
                    type="text"
                    value={signupData.city}
                    onChange={(e) =>
                      handleSignupInputChange("city", e.target.value)
                    }
                    placeholder="Your city"
                    className="w-full py-2 px-3 rounded-lg border border-slate-600 text-white bg-slate-800/50 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200 text-sm"
                    aria-invalid={!!signupErrors.city}
                    disabled={isLoading}
                  />
                  {signupErrors.city && (
                    <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                      {signupErrors.city}
                    </p>
                  )}
                </div>
                {/* Pincode */}
                <div>
                  <label
                    htmlFor="signup-pincode"
                    className="block text-xs sm:text-sm font-medium text-slate-300 mb-1"
                  >
                    Pincode
                  </label>
                  <input
                    id="signup-pincode"
                    type="text"
                    value={signupData.pincode}
                    onChange={(e) =>
                      handleSignupInputChange("pincode", e.target.value)
                    }
                    placeholder="123456"
                    className="w-full py-2 px-3 rounded-lg border border-slate-600 text-white bg-slate-800/50 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200 text-sm"
                    aria-invalid={!!signupErrors.pincode}
                    disabled={isLoading}
                  />
                  {signupErrors.pincode && (
                    <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                      {signupErrors.pincode}
                    </p>
                  )}
                </div>
                {/* Province */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="signup-province"
                    className="block text-xs sm:text-sm font-medium text-slate-300 mb-1"
                  >
                    Province/Territory (Optional)
                  </label>
                  <input
                    id="signup-province"
                    type="text"
                    value={signupData.province_or_territory}
                    onChange={(e) =>
                      handleSignupInputChange(
                        "province_or_territory",
                        e.target.value
                      )
                    }
                    placeholder="Your province or territory"
                    className="w-full py-2 px-3 rounded-lg border border-slate-600 text-white bg-slate-800/50 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200 text-sm"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <button
                onClick={handleSignupSubmit}
                disabled={isLoading}
                className={`w-full py-3 rounded-lg bg-[#d96b57] hover:bg-[#e2855a] text-white font-semibold text-base transition-all duration-200 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Creating...
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
          ) : step === 1 ? (
            // Step 1: Email Input (Login)
            <div className="w-full">
              <div className="text-center mb-4 sm:mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold mb-1 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  Welcome Back
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm">
                  Sign in to your account
                </p>
              </div>
              <div className="mb-3">
                <label
                  htmlFor="email-input"
                  className="block text-xs sm:text-sm font-medium text-slate-300 mb-1"
                >
                  Email
                </label>
                <input
                  id="email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full py-2 px-3 rounded-lg border border-slate-600 text-white bg-slate-800/50 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200 text-sm"
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? "email-error" : undefined}
                  disabled={isLoading}
                />
                {emailError && (
                  <p
                    id="email-error"
                    className="text-red-400 text-xs mt-1 flex items-center gap-1"
                  >
                    {emailError}
                  </p>
                )}
              </div>
              <button
                onClick={handleEmailSubmit}
                disabled={isLoading}
                className={`w-full py-3 rounded-lg bg-[#d96b57] hover:bg-[#e2855a] text-white font-semibold text-base transition-all duration-200 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Sending...
                  </span>
                ) : (
                  "Send OTP"
                )}
              </button>
            </div>
          ) : (
            // Step 2: OTP Input
            <div className="w-full">
              <div className="text-center mb-4 sm:mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold mb-1 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  Verify Email
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm mb-1">
                  Check your inbox for a 4-digit code
                </p>
                <p className="text-white font-medium break-all text-xs sm:text-sm">
                  {email}
                </p>
              </div>
              <div
                className="flex gap-2 mb-3 justify-center"
                onPaste={handleOtpPaste}
              >
                {[...Array(4)].map((_, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (otpInputs.current[idx] = el)}
                    type="text"
                    value={otp[idx] || ""}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    maxLength="1"
                    className="w-10 h-10 sm:w-12 sm:h-12 text-center text-xl font-bold rounded-lg border-2 border-slate-600 text-white bg-slate-800/50 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200 text-base"
                    aria-label={`OTP digit ${idx + 1}`}
                    disabled={isLoading}
                  />
                ))}
              </div>
              {otpError && (
                <div className="mb-2 p-2 rounded bg-red-500/10 border border-red-500/20 text-center">
                  <p className="text-red-400 text-xs flex items-center justify-center gap-2">
                    {otpError}
                  </p>
                </div>
              )}
              <button
                onClick={handleOtpSubmit}
                disabled={isLoading}
                className={`w-full py-3 rounded-lg bg-[#d96b57] hover:bg-[#e2855a] text-white font-semibold text-base transition-all duration-200 mb-2 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Verifying...
                  </span>
                ) : (
                  "Verify OTP"
                )}
              </button>
              <div className="text-center">
                {resendTimer > 0 ? (
                  <p className="text-slate-400 text-xs flex items-center justify-center gap-1">
                    <svg
                      className="w-3 h-3 animate-pulse"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Resend in {resendTimer}s
                  </p>
                ) : (
                  <p className="text-slate-400 text-xs">
                    Didn&apos;t receive the code?{" "}
                    <button
                      onClick={handleResendOtp}
                      className="text-red-400 hover:text-red-300 font-medium hover:underline transition-colors duration-200"
                    >
                      Resend OTP
                    </button>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Toggle between login and signup */}
          <div className="mt-4 sm:mt-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent flex-1"></div>
              <span className="text-slate-400 text-xs">or</span>
              <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent flex-1"></div>
            </div>
            <p className="text-slate-400 text-xs">
              {mode === "login"
                ? "Don't have an account?"
                : "Already have an account?"}{" "}
              <button
                onClick={toggleMode}
                className="text-red-400 hover:text-red-300 font-medium hover:underline transition-colors duration-200"
              >
                {mode === "login" ? "Create Account" : "Sign In"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
