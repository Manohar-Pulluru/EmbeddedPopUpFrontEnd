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

// import React, { useState, useEffect, useRef, useContext } from "react";
// import { postWithoutAuth } from "../../../../Service/httpService";
// import { createUser } from "../../../../Service/api";
// import { AppContext } from "../../../../Service/Context/AppContext";

// export const LoginPage = () => {
//   const { setLoginPage, businessId } = useContext(AppContext);
//   const [mode, setMode] = useState("login"); // "login" or "signup"
//   const [step, setStep] = useState(1); // 1 for email/form, 2 for OTP
//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState(""); // Single string for OTP (e.g., "1234")
//   const [emailError, setEmailError] = useState("");
//   const [otpError, setOtpError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [resendTimer, setResendTimer] = useState(0); // 60-second cooldown
//   const otpInputs = useRef([]); // Refs for OTP input fields

//   // Signup form fields
//   const [signupData, setSignupData] = useState({
//     name: "",
//     email: "",
//     phoneNo: "",
//     address: "",
//     city: "",
//     pincode: "",
//     province_or_territory: "",
//   });
//   const [signupErrors, setSignupErrors] = useState({});

//   // Handle resend OTP timer
//   useEffect(() => {
//     if (resendTimer > 0) {
//       const timer = setInterval(() => {
//         setResendTimer((prev) => prev - 1);
//       }, 1000);
//       return () => clearInterval(timer);
//     }
//   }, [resendTimer]);

//   // Validate signup form
//   const validateSignupForm = () => {
//     const errors = {};
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     const phoneRegex = /^[0-9]{10}$/;

//     if (!signupData.name.trim()) {
//       errors.name = "Name is required";
//     }

//     if (!signupData.email.trim()) {
//       errors.email = "Email is required";
//     } else if (!emailRegex.test(signupData.email)) {
//       errors.email = "Please enter a valid email address";
//     }

//     if (!signupData.phoneNo.trim()) {
//       errors.phoneNo = "Phone number is required";
//     } else if (!phoneRegex.test(signupData.phoneNo.replace(/\D/g, ""))) {
//       errors.phoneNo = "Please enter a valid 10-digit phone number";
//     }

//     if (!signupData.address.trim()) {
//       errors.address = "Address is required";
//     }
//     if (!signupData.city.trim()) {
//       errors.city = "City is required";
//     }
//     if (!signupData.pincode.trim()) {
//       errors.pincode = "Pincode is required";
//     }

//     return errors;
//   };

//   // Handle signup form input changes
//   const handleSignupInputChange = (field, value) => {
//     setSignupData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));

//     // Clear specific field error when user starts typing
//     if (signupErrors[field]) {
//       setSignupErrors((prev) => ({
//         ...prev,
//         [field]: "",
//       }));
//     }
//   };

//   // Handle signup form submission
//   const handleSignupSubmit = async () => {
//     const errors = validateSignupForm();
//     if (Object.keys(errors).length > 0) {
//       setSignupErrors(errors);
//       return;
//     }

//     setIsLoading(true);
//     try {
//       // You can add your signup API call here
//       // For now, we'll simulate a successful signup and switch to login
//       console.log("Signup data:", signupData);

//       // Reset form and switch to login
//       setSignupData({ name: "", email: "", phoneNo: "", address: "" });
//       setSignupErrors({});
//       setMode("login");

//       // Optional: Show a success message
//       alert("Account created successfully! Please login with your email.");
//     } catch (error) {
//       console.error("Signup error:", error);
//       // Handle signup error
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle email submission (for login)
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
//     setSignupData({ name: "", email: "", phoneNo: "", address: "" });
//     setSignupErrors({});
//   };

//   const createUser = async () => {
//     const signupPayload = {
//       name: signupData.name,
//       email: signupData.email,
//       phoneNo: signupData.phoneNo,
//       additional_attributes: {
//         address: signupData.address,
//         city: signupData.city,
//         pincode: signupData.pincode,
//         province_or_territory: signupData.province_or_territory,
//       },
//     };

//     console.log("Signup data:", signupPayload);
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-[#0000008a] bg-opacity-50 z-20 p-4">
//       <div className="bg-[#252836] text-white w-full max-w-[700px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] min-h-[400px] max-h-[90vh] overflow-y-auto rounded-2xl shadow-lg relative flex flex-col items-center justify-center p-4 sm:p-6 mx-4">
//         {/* Close Button */}
//         <button
//           onClick={handleClose}
//           className="absolute top-3 right-3 sm:top-4 sm:right-4 text-[#EA7C69] hover:text-white p-1 z-10"
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

//         {mode === "signup" ? (
//           // Signup Form
//           <div className="w-full max-w-[400px] flex flex-col items-center px-2 sm:px-0">
//             <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 text-center">
//               Create Account
//             </h2>

//             <div className="w-full space-y-4">
//               {/* Name Field */}
//               <div>
//                 <label
//                   htmlFor="signup-name"
//                   className="block text-sm font-medium text-[#ffffffb4] mb-1"
//                 >
//                   Full Name
//                 </label>
//                 <input
//                   id="signup-name"
//                   type="text"
//                   value={signupData.name}
//                   onChange={(e) =>
//                     handleSignupInputChange("name", e.target.value)
//                   }
//                   placeholder="Enter your full name"
//                   className="w-full py-3 px-4 rounded-lg border border-[#393C49] text-white bg-[#1F1D2B] placeholder-[#ffffff9c] focus:outline-none focus:border-[#EA7C69] text-sm sm:text-base"
//                   aria-invalid={!!signupErrors.name}
//                   disabled={isLoading}
//                 />
//                 {signupErrors.name && (
//                   <p className="text-[#EA7C69] text-sm mt-1">
//                     {signupErrors.name}
//                   </p>
//                 )}
//               </div>

//               {/* Email Field */}
//               <div>
//                 <label
//                   htmlFor="signup-email"
//                   className="block text-sm font-medium text-[#ffffffb4] mb-1"
//                 >
//                   Email Address
//                 </label>
//                 <input
//                   id="signup-email"
//                   type="email"
//                   value={signupData.email}
//                   onChange={(e) =>
//                     handleSignupInputChange("email", e.target.value)
//                   }
//                   placeholder="Enter your email"
//                   className="w-full py-3 px-4 rounded-lg border border-[#393C49] text-white bg-[#1F1D2B] placeholder-[#ffffff9c] focus:outline-none focus:border-[#EA7C69] text-sm sm:text-base"
//                   aria-invalid={!!signupErrors.email}
//                   disabled={isLoading}
//                 />
//                 {signupErrors.email && (
//                   <p className="text-[#EA7C69] text-sm mt-1">
//                     {signupErrors.email}
//                   </p>
//                 )}
//               </div>

//               {/* Phone Number Field */}
//               <div>
//                 <label
//                   htmlFor="signup-phone"
//                   className="block text-sm font-medium text-[#ffffffb4] mb-1"
//                 >
//                   Phone Number
//                 </label>
//                 <input
//                   id="signup-phone"
//                   type="tel"
//                   value={signupData.phoneNo}
//                   onChange={(e) =>
//                     handleSignupInputChange("phoneNo", e.target.value)
//                   }
//                   placeholder="Enter your phone number"
//                   className="w-full py-3 px-4 rounded-lg border border-[#393C49] text-white bg-[#1F1D2B] placeholder-[#ffffff9c] focus:outline-none focus:border-[#EA7C69] text-sm sm:text-base"
//                   aria-invalid={!!signupErrors.phoneNo}
//                   disabled={isLoading}
//                 />
//                 {signupErrors.phoneNo && (
//                   <p className="text-[#EA7C69] text-sm mt-1">
//                     {signupErrors.phoneNo}
//                   </p>
//                 )}
//               </div>

//               {/* Address Field */}
//               <div>
//                 <label
//                   htmlFor="signup-address"
//                   className="block text-sm font-medium text-[#ffffffb4] mb-1"
//                 >
//                   Address
//                 </label>
//                 <textarea
//                   id="signup-address"
//                   value={signupData.address}
//                   onChange={(e) =>
//                     handleSignupInputChange("address", e.target.value)
//                   }
//                   placeholder="Enter your address"
//                   rows="3"
//                   className="w-full py-3 px-4 rounded-lg border border-[#393C49] text-white bg-[#1F1D2B] placeholder-[#ffffff9c] focus:outline-none focus:border-[#EA7C69] text-sm sm:text-base resize-none"
//                   aria-invalid={!!signupErrors.address}
//                   disabled={isLoading}
//                 />
//                 {signupErrors.address && (
//                   <p className="text-[#EA7C69] text-sm mt-1">
//                     {signupErrors.address}
//                   </p>
//                 )}
//               </div>
//             </div>
//             {/* City Field */}
//             <div>
//               <label
//                 htmlFor="signup-city"
//                 className="block text-sm font-medium text-[#ffffffb4] mb-1"
//               >
//                 City
//               </label>
//               <input
//                 id="signup-city"
//                 type="text"
//                 value={signupData.city}
//                 onChange={(e) =>
//                   handleSignupInputChange("city", e.target.value)
//                 }
//                 placeholder="Enter your city"
//                 className="w-full py-3 px-4 rounded-lg border border-[#393C49] text-white bg-[#1F1D2B] placeholder-[#ffffff9c] focus:outline-none focus:border-[#EA7C69] text-sm sm:text-base"
//                 aria-invalid={!!signupErrors.city}
//                 disabled={isLoading}
//               />
//               {signupErrors.city && (
//                 <p className="text-[#EA7C69] text-sm mt-1">
//                   {signupErrors.city}
//                 </p>
//               )}
//             </div>

//             {/* Pincode Field */}
//             <div>
//               <label
//                 htmlFor="signup-pincode"
//                 className="block text-sm font-medium text-[#ffffffb4] mb-1"
//               >
//                 Pincode
//               </label>
//               <input
//                 id="signup-pincode"
//                 type="text"
//                 value={signupData.pincode}
//                 onChange={(e) =>
//                   handleSignupInputChange("pincode", e.target.value)
//                 }
//                 placeholder="Enter your pincode"
//                 className="w-full py-3 px-4 rounded-lg border border-[#393C49] text-white bg-[#1F1D2B] placeholder-[#ffffff9c] focus:outline-none focus:border-[#EA7C69] text-sm sm:text-base"
//                 aria-invalid={!!signupErrors.pincode}
//                 disabled={isLoading}
//               />
//               {signupErrors.pincode && (
//                 <p className="text-[#EA7C69] text-sm mt-1">
//                   {signupErrors.pincode}
//                 </p>
//               )}
//             </div>

//             {/* Province Field */}
//             <div>
//               <label
//                 htmlFor="signup-province"
//                 className="block text-sm font-medium text-[#ffffffb4] mb-1"
//               >
//                 Province/Territory
//               </label>
//               <input
//                 id="signup-province"
//                 type="text"
//                 value={signupData.province_or_territory}
//                 onChange={(e) =>
//                   handleSignupInputChange(
//                     "province_or_territory",
//                     e.target.value
//                   )
//                 }
//                 placeholder="Enter your province or territory"
//                 className="w-full py-3 px-4 rounded-lg border border-[#393C49] text-white bg-[#1F1D2B] placeholder-[#ffffff9c] focus:outline-none focus:border-[#EA7C69] text-sm sm:text-base"
//                 disabled={isLoading}
//               />
//             </div>

//             <button
//               onClick={handleSignupSubmit}
//               disabled={isLoading}
//               className={`px-6 py-3 rounded-2xl bg-[#EA7C69] cursor-pointer text-white font-medium w-full text-sm sm:text-base mt-6 ${
//                 isLoading
//                   ? "opacity-50 cursor-not-allowed"
//                   : "hover:bg-[#d68475]"
//               }`}
//             >
//               {isLoading ? "Creating Account..." : "Create Account"}
//             </button>
//           </div>
//         ) : step === 1 ? (
//           // Step 1: Email Input (Login)
//           <div className="w-full max-w-[400px] flex flex-col items-center px-2 sm:px-0">
//             <h2 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 text-center">
//               Login
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
//             <div
//               className="flex gap-2 sm:gap-4 mb-4 justify-center"
//               onPaste={handleOtpPaste}
//             >
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
//               <p className="text-[#EA7C69] text-sm mb-4 text-center px-2">
//                 {otpError}
//               </p>
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
      localStorage.setItem("aftoAuthToken", response?.entity?.token);
      if (response.status) {
        setOtpError("");

        const createUserResponse = await createUser({
          businessAccountId: businessId,
          email: email,
        });

        console.log(createUserResponse, "createUserResponse");
        setLoginPage(false);
        console.log(`${mode === "login" ? "Login" : "Signup"} successful`);
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

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-black/80 via-gray-900/90 to-black/80 backdrop-blur-sm z-50 p-4">
      <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 text-white w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl max-h-[95vh] overflow-y-auto rounded-3xl shadow-2xl border border-slate-700/50 relative backdrop-blur-xl">
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-orange-500/10 rounded-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all duration-200"
          aria-label="Close login modal"
        >
          <svg
            width="20"
            height="20"
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

        <div className="relative z-10 p-6 sm:p-8 lg:p-10 flex flex-col items-center">
          {mode === "signup" ? (
            // Signup Form
            <div className="w-full max-w-md">
              <div className="text-center mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  Create Account
                </h2>
                <p className="text-slate-400 text-sm">
                  Join us and get started today
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {/* Name Field */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="signup-name"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      id="signup-name"
                      type="text"
                      value={signupData.name}
                      onChange={(e) =>
                        handleSignupInputChange("name", e.target.value)
                      }
                      placeholder="Enter your full name"
                      className="w-full py-3 px-4 rounded-xl border border-slate-600 text-white bg-slate-800/50 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200 backdrop-blur-sm"
                      aria-invalid={!!signupErrors.name}
                      disabled={isLoading}
                    />
                    {signupErrors.name && (
                      <div className="absolute inset-0 rounded-xl border-2 border-red-500/50 pointer-events-none"></div>
                    )}
                  </div>
                  {signupErrors.name && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {signupErrors.name}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label
                    htmlFor="signup-email"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      id="signup-email"
                      type="email"
                      value={signupData.email}
                      onChange={(e) =>
                        handleSignupInputChange("email", e.target.value)
                      }
                      placeholder="your@email.com"
                      className="w-full py-3 px-4 rounded-xl border border-slate-600 text-white bg-slate-800/50 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200 backdrop-blur-sm"
                      aria-invalid={!!signupErrors.email}
                      disabled={isLoading}
                    />
                    {signupErrors.email && (
                      <div className="absolute inset-0 rounded-xl border-2 border-red-500/50 pointer-events-none"></div>
                    )}
                  </div>
                  {signupErrors.email && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {signupErrors.email}
                    </p>
                  )}
                </div>

                {/* Phone Number Field */}
                <div>
                  <label
                    htmlFor="signup-phone"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    Phone Number
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
                      className="w-full py-3 px-4 rounded-xl border border-slate-600 text-white bg-slate-800/50 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200 backdrop-blur-sm"
                      aria-invalid={!!signupErrors.phoneNo}
                      disabled={isLoading}
                    />
                    {signupErrors.phoneNo && (
                      <div className="absolute inset-0 rounded-xl border-2 border-red-500/50 pointer-events-none"></div>
                    )}
                  </div>
                  {signupErrors.phoneNo && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {signupErrors.phoneNo}
                    </p>
                  )}
                </div>

                {/* City Field */}
                <div>
                  <label
                    htmlFor="signup-city"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    City
                  </label>
                  <div className="relative">
                    <input
                      id="signup-city"
                      type="text"
                      value={signupData.city}
                      onChange={(e) =>
                        handleSignupInputChange("city", e.target.value)
                      }
                      placeholder="Your city"
                      className="w-full py-3 px-4 rounded-xl border border-slate-600 text-white bg-slate-800/50 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200 backdrop-blur-sm"
                      aria-invalid={!!signupErrors.city}
                      disabled={isLoading}
                    />
                    {signupErrors.city && (
                      <div className="absolute inset-0 rounded-xl border-2 border-red-500/50 pointer-events-none"></div>
                    )}
                  </div>
                  {signupErrors.city && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {signupErrors.city}
                    </p>
                  )}
                </div>

                {/* Pincode Field */}
                <div>
                  <label
                    htmlFor="signup-pincode"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    Pincode
                  </label>
                  <div className="relative">
                    <input
                      id="signup-pincode"
                      type="text"
                      value={signupData.pincode}
                      onChange={(e) =>
                        handleSignupInputChange("pincode", e.target.value)
                      }
                      placeholder="123456"
                      className="w-full py-3 px-4 rounded-xl border border-slate-600 text-white bg-slate-800/50 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200 backdrop-blur-sm"
                      aria-invalid={!!signupErrors.pincode}
                      disabled={isLoading}
                    />
                    {signupErrors.pincode && (
                      <div className="absolute inset-0 rounded-xl border-2 border-red-500/50 pointer-events-none"></div>
                    )}
                  </div>
                  {signupErrors.pincode && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {signupErrors.pincode}
                    </p>
                  )}
                </div>

                {/* Address Field */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="signup-address"
                    className="block text-sm font-medium text-slate-300 mb-2"
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
                      placeholder="Enter your full address"
                      rows="3"
                      className="w-full py-3 px-4 rounded-xl border border-slate-600 text-white bg-slate-800/50 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200 resize-none backdrop-blur-sm"
                      aria-invalid={!!signupErrors.address}
                      disabled={isLoading}
                    />
                    {signupErrors.address && (
                      <div className="absolute inset-0 rounded-xl border-2 border-red-500/50 pointer-events-none"></div>
                    )}
                  </div>
                  {signupErrors.address && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {signupErrors.address}
                    </p>
                  )}
                </div>

                {/* Province Field */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="signup-province"
                    className="block text-sm font-medium text-slate-300 mb-2"
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
                    className="w-full py-3 px-4 rounded-xl border border-slate-600 text-white bg-slate-800/50 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200 backdrop-blur-sm"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <button
                onClick={handleSignupSubmit}
                disabled={isLoading}
                className={`w-full py-4 rounded-xl bg-[#d96b57] hover:from-[#d96b57] hover:to-[#d96b57] text-white font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg ${
                  isLoading
                    ? "opacity-50 cursor-not-allowed transform-none"
                    : ""
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
                    Creating Account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
          ) : step === 1 ? (
            // Step 1: Email Input (Login)
            <div className="w-full max-w-md">
              <div className="text-center mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  Welcome Back
                </h2>
                <p className="text-slate-400 text-sm">
                  Sign in to your account
                </p>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="email-input"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full py-4 px-4 rounded-xl border border-slate-600 text-white bg-slate-800/50 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200 text-lg backdrop-blur-sm"
                    aria-invalid={!!emailError}
                    aria-describedby={emailError ? "email-error" : undefined}
                    disabled={isLoading}
                  />
                  {emailError && (
                    <div className="absolute inset-0 rounded-xl border-2 border-red-500/50 pointer-events-none"></div>
                  )}
                </div>
                {emailError && (
                  <p
                    id="email-error"
                    className="text-red-400 text-sm mt-2 flex items-center gap-1"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {emailError}
                  </p>
                )}
              </div>

              <button
                onClick={handleEmailSubmit}
                disabled={isLoading}
                className={`w-full py-4 rounded-xl bg-[#d96b57] hover:from-[#d96b57] hover:to-[#d96b57] text-white font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg cursor-pointer ${
                  isLoading
                    ? "opacity-50 cursor-not-allowed transform-none"
                    : ""
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
                    Sending OTP...
                  </div>
                ) : (
                  "Send OTP"
                )}
              </button>
            </div>
          ) : (
            // Step 2: OTP Input
            <div className="w-full max-w-md">
              <div className="text-center mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  Verify Your Email
                </h2>
                <p className="text-slate-400 text-sm mb-2">
                  We've sent a 4-digit code to
                </p>
                <p className="text-white font-medium break-all">{email}</p>
              </div>

              <div
                className="flex gap-3 mb-6 justify-center"
                onPaste={handleOtpPaste}
              >
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="relative">
                    <input
                      ref={(el) => (otpInputs.current[index] = el)}
                      type="text"
                      value={otp[index] || ""}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      maxLength="1"
                      className="w-14 h-14 sm:w-16 sm:h-16 text-center text-2xl font-bold rounded-xl border-2 border-slate-600 text-white bg-slate-800/50 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200 backdrop-blur-sm"
                      aria-label={`OTP digit ${index + 1}`}
                      disabled={isLoading}
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-red-500/10 to-orange-500/10 pointer-events-none"></div>
                  </div>
                ))}
              </div>

              {otpError && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-center">
                  <p className="text-red-400 text-sm flex items-center justify-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {otpError}
                  </p>
                </div>
              )}

              <button
                onClick={handleOtpSubmit}
                disabled={isLoading}
                className={`w-full py-4 rounded-xl bg-[#d96b57] hover:from-[#d96b57] hover:to-[#d96b57] text-white font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg mb-4 ${
                  isLoading
                    ? "opacity-50 cursor-not-allowed transform-none"
                    : ""
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
                  </div>
                ) : (
                  "Verify OTP"
                )}
              </button>

              <div className="text-center">
                {resendTimer > 0 ? (
                  <p className="text-slate-400 text-sm flex items-center justify-center gap-2">
                    <svg
                      className="w-4 h-4 animate-pulse"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Resend available in {resendTimer}s
                  </p>
                ) : (
                  <p className="text-slate-400 text-sm">
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

          {/* Toggle between login and signup */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent flex-1"></div>
              <span className="text-slate-400 text-sm">or</span>
              <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent flex-1"></div>
            </div>

            <p className="text-slate-400 text-sm">
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
