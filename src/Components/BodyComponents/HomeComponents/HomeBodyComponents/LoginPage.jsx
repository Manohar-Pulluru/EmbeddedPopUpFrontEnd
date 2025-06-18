// import React, { useState, useEffect, useRef, useContext } from "react";
// import { postWithoutAuth } from "../../../../Service/httpService";
// import { createUser } from "../../../../Service/api";
// import { AppContext } from "../../../../Service/Context/AppContext";

// export const LoginPage = () => {
//   const { setLoginPage, businessId } = useContext(AppContext);
//   const [mode, setMode] = useState("login"); // "login" or "signup"
//   const [step, setStep] = useState(1); // 1 for email, 2 for OTP
//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState(""); // Single string for OTP (e.g., "1234")
//   const [emailError, setEmailError] = useState("");
//   const [otpError, setOtpError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [resendTimer, setResendTimer] = useState(0); // 60-second cooldown
//   const otpInputs = useRef([]); // Refs for OTP input fields

//   // Handle resend OTP timer
//   useEffect(() => {
//     if (resendTimer > 0) {
//       const timer = setInterval(() => {
//         setResendTimer((prev) => prev - 1);
//       }, 1000);
//       return () => clearInterval(timer);
//     }
//   }, [resendTimer]);

//   // Handle email submission
//   const handleEmailSubmit = async () => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       setEmailError("Please enter a valid email address");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const response = await postWithoutAuth("/user/signIn", { email });
//       if (response.data.status) {
//         setEmailError("");
//         setStep(2);
//         setResendTimer(60); // Start 60-second cooldown
//       } else {
//         setEmailError(response.data.message || "Failed to send OTP");
//       }
//     } catch (error) {
//       setEmailError(error.response?.data?.message || "Network error");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle OTP input change
//   const handleOtpChange = (index, value) => {
//     if (!/^\d?$/.test(value)) return; // Allow only single digit or empty

//     const newOtp = otp.split("");
//     newOtp[index] = value;
//     const updatedOtp = newOtp.join("").slice(0, 4); // Ensure max 4 digits
//     setOtp(updatedOtp);

//     // Auto-focus next input
//     if (value && index < 3 && updatedOtp.length <= index + 1) {
//       otpInputs.current[index + 1]?.focus();
//     }
//     // Auto-focus previous input on delete
//     if (!value && index > 0) {
//       otpInputs.current[index - 1]?.focus();
//     }

//     setOtpError(""); // Clear error on input
//   };

//   // Handle OTP paste
//   const handleOtpPaste = (e) => {
//     const pasted = e.clipboardData.getText().replace(/\D/g, "").slice(0, 4);
//     if (pasted.length === 4) {
//       setOtp(pasted);
//       otpInputs.current[3]?.focus(); // Focus last input
//       e.preventDefault();
//     }
//   };

//   // Handle OTP submission
//   const handleOtpSubmit = async () => {
//     if (otp.length !== 4 || !/^\d{4}$/.test(otp)) {
//       setOtpError("Please enter a valid 4-digit OTP");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       // Assuming verifyOTP makes a POST to /user/verifyOtp
//       const response = await postWithoutAuth("/user_otps/verify-otp", {
//         email,
//         otp,
//       });

//       console.log(response?.data?.entity?.token, "response");
//       if (response.data.status) {
//         setOtpError("");
//         localStorage.removeItem("cartItems");
//         localStorage.removeItem("orderHistory");
//         localStorage.setItem("aftoAuthToken", response?.data?.entity?.token);
//         localStorage.setItem("aftoAuthBusinessId", businessId);

//         const createUserResponse = await createUser({
//           businessAccountId: businessId,
//           email: email,
//         });

//         console.log(createUserResponse, "createUserResponse");
//         window.location.reload();
//         setLoginPage(false);
//         console.log(`${mode === "login" ? "Login" : "Signup"} successful`);
//         // Optionally redirect or update app state
//       } else {
//         setOtpError(response.data.message || "Invalid OTP");
//       }
//     } catch (error) {
//       setOtpError(error.response?.data?.message || "OTP verification failed");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle resend OTP
//   const handleResendOtp = async () => {
//     setOtp("");
//     setOtpError("");
//     await handleEmailSubmit();
//   };

//   // Handle close button
//   const handleClose = () => {
//     setLoginPage(false);
//   };

//   // Toggle between login and signup
//   const toggleMode = () => {
//     setMode(mode === "login" ? "signup" : "login");
//     setStep(1);
//     setEmail("");
//     setOtp("");
//     setEmailError("");
//     setOtpError("");
//     setResendTimer(0);
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-[#0000008a] bg-opacity-50 z-20 p-4">
//       <div className="bg-[#252836] text-white w-full max-w-[700px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] min-h-[400px] rounded-2xl shadow-lg relative flex flex-col items-center justify-center p-4 sm:p-6 mx-4">
//         {/* Close Button */}
//         <button
//           onClick={handleClose}
//           className="absolute top-3 right-3 sm:top-4 sm:right-4 text-[#EA7C69] hover:text-white p-1"
//           aria-label="Close login modal"
//         >
//           <svg
//             width="20"
//             height="20"
//             className="sm:w-6 sm:h-6"
//             viewBox="0 0 24 24"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               d="M18 6L6 18M6 6L18 18"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             />
//           </svg>
//         </button>

//         {step === 1 ? (
//           // Step 1: Email Input
//           <div className="w-full max-w-[400px] flex flex-col items-center px-2 sm:px-0">
//             <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 text-center">
//               {mode === "login" ? "Login" : "Signup"}
//             </h2>
//             <div className="w-full mb-4">
//               <label
//                 htmlFor="email-input"
//                 className="block text-sm font-medium text-[#ffffffb4] mb-1"
//               >
//                 Email Address
//               </label>
//               <input
//                 id="email-input"
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="Enter your email"
//                 className="w-full py-3 px-4 rounded-lg border border-[#393C49] text-white bg-[#1F1D2B] placeholder-[#ffffff9c] focus:outline-none focus:border-[#EA7C69] text-sm sm:text-base"
//                 aria-invalid={!!emailError}
//                 aria-describedby={emailError ? "email-error" : undefined}
//                 disabled={isLoading}
//               />
//               {emailError && (
//                 <p id="email-error" className="text-[#EA7C69] text-sm mt-1">
//                   {emailError}
//                 </p>
//               )}
//             </div>
//             <button
//               onClick={handleEmailSubmit}
//               disabled={isLoading}
//               className={`px-6 py-3 rounded-2xl bg-[#EA7C69] cursor-pointer text-white font-medium w-full text-sm sm:text-base ${
//                 isLoading
//                   ? "opacity-50 cursor-not-allowed"
//                   : "hover:bg-[#d68475]"
//               }`}
//             >
//               {isLoading ? "Sending..." : "Request OTP"}
//             </button>
//           </div>
//         ) : (
//           // Step 2: OTP Input
//           <div className="w-full max-w-[400px] flex flex-col items-center px-2 sm:px-0">
//             <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 text-center">
//               Enter OTP
//             </h2>
//             <p className="text-[#ffffffb4] text-sm mb-4 sm:mb-6 text-center px-2">
//               An OTP has been sent to <span className="break-all">{email}</span>
//             </p>
//             <div className="flex gap-2 sm:gap-4 mb-4 justify-center" onPaste={handleOtpPaste}>
//               {[...Array(4)].map((_, index) => (
//                 <input
//                   key={index}
//                   ref={(el) => (otpInputs.current[index] = el)}
//                   type="text"
//                   value={otp[index] || ""}
//                   onChange={(e) => handleOtpChange(index, e.target.value)}
//                   maxLength="1"
//                   className="w-10 h-10 sm:w-12 sm:h-12 text-center text-lg sm:text-2xl rounded-lg border border-[#393C49] text-white bg-[#1F1D2B] focus:outline-none focus:border-[#EA7C69]"
//                   aria-label={`OTP digit ${index + 1}`}
//                   disabled={isLoading}
//                 />
//               ))}
//             </div>
//             {otpError && (
//               <p className="text-[#EA7C69] text-sm mb-4 text-center px-2">{otpError}</p>
//             )}
//             <button
//               onClick={handleOtpSubmit}
//               disabled={isLoading}
//               className={`px-6 py-3 cursor-pointer rounded-2xl bg-[#EA7C69] text-white font-medium w-full text-sm sm:text-base ${
//                 isLoading
//                   ? "opacity-50 cursor-not-allowed"
//                   : "hover:bg-[#d68475]"
//               }`}
//             >
//               {isLoading ? "Verifying..." : "Submit"}
//             </button>
//             <p className="text-[#ffffffb4] text-sm mt-4 text-center px-2">
//               {resendTimer > 0 ? (
//                 `Resend OTP in ${resendTimer}s`
//               ) : (
//                 <>
//                   Didn't receive the OTP?{" "}
//                   <span
//                     onClick={handleResendOtp}
//                     className="text-[#EA7C69] cursor-pointer hover:underline"
//                   >
//                     Resend OTP
//                   </span>
//                 </>
//               )}
//             </p>
//           </div>
//         )}

//         <p className="text-[#ffffffb4] text-sm mt-4 sm:mt-6 text-center px-2">
//           {mode === "login"
//             ? "Don't have an account?"
//             : "Already have an account?"}{" "}
//           <span
//             onClick={toggleMode}
//             className="text-[#EA7C69] cursor-pointer hover:underline"
//           >
//             {mode === "login" ? "Signup" : "Login"}
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// };

import React, { useState, useEffect, useRef, useContext } from "react";
import { postWithoutAuth } from "../../../../Service/httpService";
import { createUser } from "../../../../Service/api";
import { AppContext } from "../../../../Service/Context/AppContext";

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

  // Signup form fields
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    phoneNo: "",
    address: ""
  });
  const [signupErrors, setSignupErrors] = useState({});

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

    return errors;
  };

  // Handle signup form input changes
  const handleSignupInputChange = (field, value) => {
    setSignupData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear specific field error when user starts typing
    if (signupErrors[field]) {
      setSignupErrors(prev => ({
        ...prev,
        [field]: ""
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

    setIsLoading(true);
    try {
      // You can add your signup API call here
      // For now, we'll simulate a successful signup and switch to login
      console.log("Signup data:", signupData);
      
      // Reset form and switch to login
      setSignupData({ name: "", email: "", phoneNo: "", address: "" });
      setSignupErrors({});
      setMode("login");
      
      // Optional: Show a success message
      alert("Account created successfully! Please login with your email.");
      
    } catch (error) {
      console.error("Signup error:", error);
      // Handle signup error
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
      const response = await postWithoutAuth("/user/signIn", { email });
      if (response.data.status) {
        setEmailError("");
        setStep(2);
        setResendTimer(60); // Start 60-second cooldown
      } else {
        setEmailError(response.data.message || "Failed to send OTP");
      }
    } catch (error) {
      setEmailError(error.response?.data?.message || "Network error");
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
      // Assuming verifyOTP makes a POST to /user/verifyOtp
      const response = await postWithoutAuth("/user_otps/verify-otp", {
        email,
        otp,
      });

      console.log(response?.data?.entity?.token, "response");
      if (response.data.status) {
        setOtpError("");
        localStorage.removeItem("cartItems");
        localStorage.removeItem("orderHistory");
        localStorage.setItem("aftoAuthToken", response?.data?.entity?.token);
        localStorage.setItem("aftoAuthBusinessId", businessId);

        const createUserResponse = await createUser({
          businessAccountId: businessId,
          email: email,
        });

        console.log(createUserResponse, "createUserResponse");
        window.location.reload();
        setLoginPage(false);
        console.log(`${mode === "login" ? "Login" : "Signup"} successful`);
        // Optionally redirect or update app state
      } else {
        setOtpError(response.data.message || "Invalid OTP");
      }
    } catch (error) {
      setOtpError(error.response?.data?.message || "OTP verification failed");
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
    setSignupData({ name: "", email: "", phoneNo: "", address: "" });
    setSignupErrors({});
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0000008a] bg-opacity-50 z-20 p-4">
      <div className="bg-[#252836] text-white w-full max-w-[700px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] min-h-[400px] max-h-[90vh] overflow-y-auto rounded-2xl shadow-lg relative flex flex-col items-center justify-center p-4 sm:p-6 mx-4">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-[#EA7C69] hover:text-white p-1 z-10"
          aria-label="Close login modal"
        >
          <svg
            width="20"
            height="20"
            className="sm:w-6 sm:h-6"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {mode === "signup" ? (
          // Signup Form
          <div className="w-full max-w-[400px] flex flex-col items-center px-2 sm:px-0">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 text-center">
              Create Account
            </h2>
            
            <div className="w-full space-y-4">
              {/* Name Field */}
              <div>
                <label
                  htmlFor="signup-name"
                  className="block text-sm font-medium text-[#ffffffb4] mb-1"
                >
                  Full Name
                </label>
                <input
                  id="signup-name"
                  type="text"
                  value={signupData.name}
                  onChange={(e) => handleSignupInputChange("name", e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full py-3 px-4 rounded-lg border border-[#393C49] text-white bg-[#1F1D2B] placeholder-[#ffffff9c] focus:outline-none focus:border-[#EA7C69] text-sm sm:text-base"
                  aria-invalid={!!signupErrors.name}
                  disabled={isLoading}
                />
                {signupErrors.name && (
                  <p className="text-[#EA7C69] text-sm mt-1">{signupErrors.name}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="signup-email"
                  className="block text-sm font-medium text-[#ffffffb4] mb-1"
                >
                  Email Address
                </label>
                <input
                  id="signup-email"
                  type="email"
                  value={signupData.email}
                  onChange={(e) => handleSignupInputChange("email", e.target.value)}
                  placeholder="Enter your email"
                  className="w-full py-3 px-4 rounded-lg border border-[#393C49] text-white bg-[#1F1D2B] placeholder-[#ffffff9c] focus:outline-none focus:border-[#EA7C69] text-sm sm:text-base"
                  aria-invalid={!!signupErrors.email}
                  disabled={isLoading}
                />
                {signupErrors.email && (
                  <p className="text-[#EA7C69] text-sm mt-1">{signupErrors.email}</p>
                )}
              </div>

              {/* Phone Number Field */}
              <div>
                <label
                  htmlFor="signup-phone"
                  className="block text-sm font-medium text-[#ffffffb4] mb-1"
                >
                  Phone Number
                </label>
                <input
                  id="signup-phone"
                  type="tel"
                  value={signupData.phoneNo}
                  onChange={(e) => handleSignupInputChange("phoneNo", e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full py-3 px-4 rounded-lg border border-[#393C49] text-white bg-[#1F1D2B] placeholder-[#ffffff9c] focus:outline-none focus:border-[#EA7C69] text-sm sm:text-base"
                  aria-invalid={!!signupErrors.phoneNo}
                  disabled={isLoading}
                />
                {signupErrors.phoneNo && (
                  <p className="text-[#EA7C69] text-sm mt-1">{signupErrors.phoneNo}</p>
                )}
              </div>

              {/* Address Field */}
              <div>
                <label
                  htmlFor="signup-address"
                  className="block text-sm font-medium text-[#ffffffb4] mb-1"
                >
                  Address
                </label>
                <textarea
                  id="signup-address"
                  value={signupData.address}
                  onChange={(e) => handleSignupInputChange("address", e.target.value)}
                  placeholder="Enter your address"
                  rows="3"
                  className="w-full py-3 px-4 rounded-lg border border-[#393C49] text-white bg-[#1F1D2B] placeholder-[#ffffff9c] focus:outline-none focus:border-[#EA7C69] text-sm sm:text-base resize-none"
                  aria-invalid={!!signupErrors.address}
                  disabled={isLoading}
                />
                {signupErrors.address && (
                  <p className="text-[#EA7C69] text-sm mt-1">{signupErrors.address}</p>
                )}
              </div>
            </div>

            <button
              onClick={handleSignupSubmit}
              disabled={isLoading}
              className={`px-6 py-3 rounded-2xl bg-[#EA7C69] cursor-pointer text-white font-medium w-full text-sm sm:text-base mt-6 ${
                isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-[#d68475]"
              }`}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </div>
        ) : step === 1 ? (
          // Step 1: Email Input (Login)
          <div className="w-full max-w-[400px] flex flex-col items-center px-2 sm:px-0">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 text-center">
              Login
            </h2>
            <div className="w-full mb-4">
              <label
                htmlFor="email-input"
                className="block text-sm font-medium text-[#ffffffb4] mb-1"
              >
                Email Address
              </label>
              <input
                id="email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full py-3 px-4 rounded-lg border border-[#393C49] text-white bg-[#1F1D2B] placeholder-[#ffffff9c] focus:outline-none focus:border-[#EA7C69] text-sm sm:text-base"
                aria-invalid={!!emailError}
                aria-describedby={emailError ? "email-error" : undefined}
                disabled={isLoading}
              />
              {emailError && (
                <p id="email-error" className="text-[#EA7C69] text-sm mt-1">
                  {emailError}
                </p>
              )}
            </div>
            <button
              onClick={handleEmailSubmit}
              disabled={isLoading}
              className={`px-6 py-3 rounded-2xl bg-[#EA7C69] cursor-pointer text-white font-medium w-full text-sm sm:text-base ${
                isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-[#d68475]"
              }`}
            >
              {isLoading ? "Sending..." : "Request OTP"}
            </button>
          </div>
        ) : (
          // Step 2: OTP Input
          <div className="w-full max-w-[400px] flex flex-col items-center px-2 sm:px-0">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 text-center">
              Enter OTP
            </h2>
            <p className="text-[#ffffffb4] text-sm mb-4 sm:mb-6 text-center px-2">
              An OTP has been sent to <span className="break-all">{email}</span>
            </p>
            <div className="flex gap-2 sm:gap-4 mb-4 justify-center" onPaste={handleOtpPaste}>
              {[...Array(4)].map((_, index) => (
                <input
                  key={index}
                  ref={(el) => (otpInputs.current[index] = el)}
                  type="text"
                  value={otp[index] || ""}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  maxLength="1"
                  className="w-10 h-10 sm:w-12 sm:h-12 text-center text-lg sm:text-2xl rounded-lg border border-[#393C49] text-white bg-[#1F1D2B] focus:outline-none focus:border-[#EA7C69]"
                  aria-label={`OTP digit ${index + 1}`}
                  disabled={isLoading}
                />
              ))}
            </div>
            {otpError && (
              <p className="text-[#EA7C69] text-sm mb-4 text-center px-2">{otpError}</p>
            )}
            <button
              onClick={handleOtpSubmit}
              disabled={isLoading}
              className={`px-6 py-3 cursor-pointer rounded-2xl bg-[#EA7C69] text-white font-medium w-full text-sm sm:text-base ${
                isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-[#d68475]"
              }`}
            >
              {isLoading ? "Verifying..." : "Submit"}
            </button>
            <p className="text-[#ffffffb4] text-sm mt-4 text-center px-2">
              {resendTimer > 0 ? (
                `Resend OTP in ${resendTimer}s`
              ) : (
                <>
                  Didn't receive the OTP?{" "}
                  <span
                    onClick={handleResendOtp}
                    className="text-[#EA7C69] cursor-pointer hover:underline"
                  >
                    Resend OTP
                  </span>
                </>
              )}
            </p>
          </div>
        )}

        <p className="text-[#ffffffb4] text-sm mt-4 sm:mt-6 text-center px-2">
          {mode === "login"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <span
            onClick={toggleMode}
            className="text-[#EA7C69] cursor-pointer hover:underline"
          >
            {mode === "login" ? "Signup" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
};
