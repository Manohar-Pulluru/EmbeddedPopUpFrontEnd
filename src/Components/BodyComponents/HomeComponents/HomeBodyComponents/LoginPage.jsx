import React, { useState, useEffect, useRef, useContext } from "react";
// import { postWithoutAuth } from "../../../../Service/httpService";
// import { createUser } from "../../../../Service/api";
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
  const [isEmailValidating, setIsEmailValidating] = useState(false);
  const [emailValidationSuccess, setEmailValidationSuccess] = useState(false);
  const [showEmailOtp, setShowEmailOtp] = useState(false);
  const [phoneResendTimer, setPhoneResendTimer] = useState(0);
  const emailOtpInputs = useRef([]);
  const [emailOtp, setEmailOtp] = useState(["", "", "", ""]);
  const [emailOtpError, setEmailOtpError] = useState("");
  const [emailResendTimer, setEmailResendTimer] = useState(0);

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

  // API functions
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
              phone_number: "+91" + signupData.phoneNo,
              avatar_url: "",
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
        setSignupData((prev) => ({
          ...prev,
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
        validateCanadaAddress(suggestion);
      }
      setValidationSuccess(true);
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

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendTimer]);

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

  const handleSignupInputChange = (field, value) => {
    setSignupData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (signupErrors[field]) {
      setSignupErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleSignupSubmit = async () => {
    const errors = validateSignupForm();
    if (Object.keys(errors).length > 0) {
      setSignupErrors(errors);
      return;
    }
    if (!validationSuccess) {
      setSignupErrors((prev) => ({
        ...prev,
        address: "Please validate your address first",
      }));
      return;
    }
    if (!emailValidationSuccess) {
      setSignupErrors((prev) => ({
        ...prev,
        email: "Please verify your email id",
      }));
      return;
    }
    setIsLoading(true);
    try {
      const response = await customerSignup(signupData, businessId);
      if (response?.success) {
        console.log(
          "Account created successfully! Please login with your email."
        );
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
        const token = localStorage.getItem("aftoAuthToken");
        if (token) {
          getCustomerData(signupData.email, businessId).then((customerData) => {
            console.log("Customer Data:", customerData.user.otherDetails);
            const name = customerData.user.otherDetails.name;
            const email = customerData.user.otherDetails.email;
            const phone = customerData.user.otherDetails.phone;
            const address = customerData.user.otherDetails.address;
            const city = customerData.user.otherDetails.city;
            const pincode = customerData.user.otherDetails.pincode;
            const state = customerData.user.otherDetails.state;
            localStorage.setItem(
              "aftoSignupForm",
              JSON.stringify({
                name: name,
                email: email,
                phoneNo: phone,
                address: address,
                city: city,
                pincode: pincode,
                province_or_territory: state,
              })
            );
          });
        }
        setLoginPage(false);
      } else {
        const firstChar = response.message.charAt(0);
        const msgLength = response.message.length;
        if (
          response.message ==
          "Email has already been taken, Phone number has already been taken"
        ) {
          setSignupErrors((prev) => ({
            ...prev,
            phoneNo: "Phone no already used.",
            email: "email already used.",
          }));
        } else if (firstChar == "E") {
          setSignupErrors((prev) => ({
            ...prev,
            email: "email already used.",
          }));
        } else {
          setSignupErrors((prev) => ({
            ...prev,
            phoneNo: "Phone no already used.",
          }));
        }
      }
    } catch (error) {
      console.error("Signup error:", error);
      console.log("An error occurred during signup.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    setIsLoading(true);
    try {
      const UserData = await getCustomerData(email, businessId);
      console.log(UserData, "UserData", email, businessId);
      if (UserData.isNewUser) {
        setEmailError("User not found. Please sign up to create an account.");
        return;
      } else {
        const response = await sendOtp(email);
        if (response.status) {
          setEmailError("");
          setMode("otp");
          setStep(2);
          setResendTimer(60);
        } else {
          setEmailError(response.message || "Failed to send OTP");
        }
      }
    } catch (error) {
      setEmailError(error.response?.message || "Network error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = otp.split("");
    newOtp[index] = value;
    const updatedOtp = newOtp.join("").slice(0, 4);
    setOtp(updatedOtp);
    if (value && index < 3 && updatedOtp.length <= index + 1) {
      otpInputs.current[index + 1]?.focus();
    }
    if (!value && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
    setOtpError("");
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getText().replace(/\D/g, "").slice(0, 4);
    if (pasted.length === 4) {
      setOtp(pasted);
      otpInputs.current[3]?.focus();
      e.preventDefault();
    }
  };

  const handleOtpSubmit = async () => {
    if (otp.length !== 4 || !/^\d{4}$/.test(otp)) {
      setOtpError("Please enter a valid 4-digit OTP");
      return;
    }
    setIsLoading(true);
    try {
      const response = await verifyOtp(email, otp);
      console.log(response?.entity?.token, "response");
      if (response.status) {
        setOtpError("");
        localStorage.setItem("aftoAuthToken", response?.entity?.token);
        getCustomerData(email, businessId).then((customerData) => {
          console.log("Customer Data:", customerData.user.otherDetails);
          const name = customerData.user.otherDetails.name;
          const email = customerData.user.otherDetails.email;
          const phone = customerData.user.otherDetails.phone;
          const address = customerData.user.otherDetails.address;
          const city = customerData.user.otherDetails.city;
          const pincode = customerData.user.otherDetails.pincode;
          const state = customerData.user.otherDetails.state;
          localStorage.setItem(
            "aftoSignupForm",
            JSON.stringify({
              name: name,
              email: email,
              phoneNo: phone,
              address: address,
              city: city,
              pincode: pincode,
              province_or_territory: state,
            })
          );
        });
        const savedSignupForm = localStorage.getItem("aftoSignupForm");
        savedSignupForm &&
          console.log("UserData:", JSON.parse(savedSignupForm));
        setLoginPage(false);
      } else {
        setOtpError(response.message || "Invalid OTP");
      }
    } catch (error) {
      setOtpError(error.response?.message || "OTP verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setOtp("");
    setOtpError("");
    await handleEmailSubmit();
  };

  const handleClose = () => {
    setLoginPage(false);
  };

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

  useEffect(() => {
    if (phoneResendTimer > 0) {
      const timer = setInterval(() => {
        setPhoneResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [phoneResendTimer]);

  const renderPhoneValidateButtonContent = () => {
    if (isEmailValidating) {
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
          <span className="hidden sm:inline">...</span>
        </>
      );
    }
    if (emailValidationSuccess) {
      return (
        <>
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </>
      );
    }
    return (
      <>
        {/* <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
        />
      </svg> */}
        <span className="hidden sm:inline">OTP</span>
      </>
    );
  };

  const handleEmailValidateClick = async () => {
    setEmailOtp(["", "", "", ""]);
    setIsEmailValidating(true);
    setEmailValidationSuccess(false);
    setShowEmailOtp(false);
    const response = await sendOtp(signupData.email);
    setIsEmailValidating(false);
    if (response.status) {
      setShowEmailOtp(true);
      setPhoneResendTimer(60);
    } else {
      setShowEmailOtp(false);
      setSignupErrors((prev) => ({
        ...prev,
        email: response.message || "Failed to send OTP",
      }));
    }
  };

  const handleEmailOtpChange = (idx, value) => {
    if (!/^[0-9]{0,1}$/.test(value)) return;
    const newOtp = [...emailOtp];
    newOtp[idx] = value;
    setEmailOtp(newOtp);
    if (value && idx < 3) {
      emailOtpInputs.current[idx + 1]?.focus();
    }
    if (!value && idx > 0) {
      emailOtpInputs.current[idx - 1]?.focus();
    }
  };

  const handleEmailOtpSubmit = async () => {
    setEmailOtpError("");
    if (emailOtp.join("").length !== 4) {
      setEmailOtpError("Please enter the complete 4-digit code.");
      return;
    }
    try {
      const response = await verifyOtp(signupData.email, emailOtp.join(""));
      console.log(response?.entity?.token, "response");
      if (response.status) {
        setEmailValidationSuccess(true);
        setShowEmailOtp(false);
        localStorage.setItem("aftoAuthToken", response?.entity?.token);
      } else {
        setEmailOtpError(response.message || "Invalid OTP");
      }
    } catch (error) {
      setEmailOtpError(error.response?.message || "OTP verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailResendOtp = async () => {
    const response = await sendOtp(signupData.email);
    setEmailOtp(["", "", "", ""]);
    setEmailOtpError("");
    setEmailResendTimer(30);
    const interval = setInterval(() => {
      setEmailResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
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
          {mode === "login" ? (
            // Login Form
            <div className="w-full">
              <div className="text-center mb-4 sm:mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold mb-1 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  Welcome to Afto
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
              <div className="text-center mt-4">
                <p className="text-slate-400 text-xs sm:text-sm">
                  New user?{" "}
                  <button
                    onClick={() => {
                      setMode("signup");
                      setStep(1);
                      setEmailError("");
                      setSignupData((prev) => ({ ...prev, email }));
                    }}
                    className="text-red-400 hover:text-red-300 font-medium hover:underline transition-colors duration-200"
                  >
                    Signup
                  </button>
                </p>
              </div>
            </div>
          ) : mode === "signup" && step === 1 ? (
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
                <div>
                  <label
                    htmlFor="signup-email"
                    className="block text-xs sm:text-sm font-medium text-slate-300 mb-1"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <input
                      id="signup-email"
                      type="email"
                      value={signupData.email}
                      onChange={(e) => {
                        setIsEmailValidating(false);
                        setEmailValidationSuccess(false);
                        handleSignupInputChange("email", e.target.value);
                      }}
                      placeholder="your@email.com"
                      className="w-full py-2 px-3 rounded-lg border border-slate-600 text-white bg-slate-800/50 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200 text-sm"
                      aria-invalid={!!signupErrors.email}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      disabled={isEmailValidating || !signupData.email}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 py-1.5 px-2.5 rounded-md text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                        emailValidationSuccess
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-yellow-600 hover:bg-yellow-700 text-white"
                      } ${
                        !signupData.email ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      onClick={handleEmailValidateClick}
                    >
                      {renderPhoneValidateButtonContent()}
                    </button>
                  </div>
                  {signupErrors.email && (
                    <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                      {signupErrors.email}
                    </p>
                  )}
                </div>
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
                  </div>
                  {signupErrors.phoneNo && (
                    <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                      {signupErrors.phoneNo}
                    </p>
                  )}
                </div>
                {showEmailOtp && (
                  <div className="sm:col-span-2 mt-2 p-3 bg-slate-800/50 rounded-lg border border-slate-600">
                    <div className="flex items-center gap-2 mb-2">
                      <svg
                        className="w-4 h-4 text-blue-400"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M2.25 6.75A2.25 2.25 0 0 1 4.5 4.5h15a2.25 2.25 0 0 1 2.25 2.25v10.5A2.25 2.25 0 0 1 19.5 19.5h-15A2.25 2.25 0 0 1 2.25 17.25V6.75zm1.5 0v.637l8.25 5.513 8.25-5.513V6.75a.75.75 0 0 0-.75-.75h-15a.75.75 0 0 0-.75.75zm16.5 1.763-7.827 5.237a1.5 1.5 0 0 1-1.646 0L3.75 8.513V17.25c0 .414.336.75.75.75h15a.75.75 0 0 0 .75-.75V8.513z" />
                      </svg>
                      <span className="text-xs font-medium text-slate-300">
                        Email Verification
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mb-2">
                      Enter the 4-digit code sent to your email
                    </p>
                    <div className="flex gap-1 mb-2 justify-center">
                      {[...Array(4)].map((_, idx) => (
                        <input
                          key={idx}
                          ref={(el) => (emailOtpInputs.current[idx] = el)}
                          type="text"
                          value={emailOtp[idx] || ""}
                          onChange={(e) =>
                            handleEmailOtpChange(idx, e.target.value)
                          }
                          maxLength="1"
                          className="w-8 h-8 text-center text-sm font-bold rounded border border-slate-600 text-white bg-slate-800/50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all duration-200"
                          aria-label={`Email OTP digit ${idx + 1}`}
                          disabled={isLoading}
                        />
                      ))}
                    </div>
                    {emailOtpError && (
                      <p className="text-red-400 text-xs mb-2 flex items-center gap-1">
                        {emailOtpError}
                      </p>
                    )}
                    <div className="flex gap-2">
                      {emailResendTimer > 0 ? (
                        <span className="flex-1 py-1.5 px-3 text-xs text-slate-400 text-center">
                          Resend in {emailResendTimer}s
                        </span>
                      ) : (
                        <button
                          onClick={handleEmailResendOtp}
                          className="flex-1 py-1.5 px-3 rounded text-xs text-slate-400 hover:text-white border border-slate-600 hover:border-slate-500 transition-all duration-200"
                        >
                          Resend
                        </button>
                      )}
                      <button
                        onClick={handleEmailOtpSubmit}
                        disabled={isLoading || emailOtp.join("").length !== 4}
                        className={`flex-1 py-1.5 px-3 rounded text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 ${
                          isLoading || emailOtp.join("").length !== 4
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        {isLoading ? "Verifying..." : "Verify"}
                      </button>
                    </div>
                  </div>
                )}
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
                      className={`absolute right-1 top-1/2 -translate-y-1/2 py-0.5 px-2 rounded text-white text-xs transition ${
                        validationSuccess ? "bg-green-700" : "bg-yellow-600"
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
              <div className="text-center mt-4">
                <p className="text-slate-400 text-xs sm:text-sm">
                  Already have an account?{" "}
                  <button
                    onClick={() => {
                      setMode("login");
                      setStep(1);
                      setEmail("");
                      setEmailError("");
                    }}
                    className="text-red-400 hover:text-red-300 font-medium hover:underline transition-colors duration-200"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </div>
          ) : (
            // OTP Input
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
                    Didn't receive the code?{" "}
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
        </div>
      </div>
    </div>
  );
};
