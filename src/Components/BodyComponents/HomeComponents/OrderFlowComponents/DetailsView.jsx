import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AppContext } from "../../../../Service/Context/AppContext";

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || "";

export const DetailsView = () => {
  const {
    name,
    setName,
    phone,
    setPhone,
    email,
    setEmail,
    address,
    setAddress,
    city,
    setCity,
    pincode,
    setPincode,
    state,
    setState,
    setIsFormValid,
  } = useContext(AppContext);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({
    name: false,
    phone: false,
    email: false,
    address: false,
    city: false,
    pincode: false,
    state: false,
  });

  // New states for validation button
  const [isValidating, setIsValidating] = useState(false);
  const [validationSuccess, setValidationSuccess] = useState(false);

  // split initial phone into countryCode & phoneNumber
  const defaultCode =
    phone && phone.startsWith("+")
      ? (phone.match(/^\+\d{1,1}/) || ["+1"])[0]
      : "+1";
  const [countryCode, setCountryCode] = useState(defaultCode);
  const [phoneNumber, setPhoneNumber] = useState(
    phone && phone.startsWith("+")
      ? phone.slice(defaultCode.length)
      : phone || ""
  );

  const validateField = (field, value) => {
    let error = "";
    switch (field) {
      case "name":
        if (!value.trim()) error = "Name is required.";
        break;
      case "phone":
        if (!/^\+\d{1,1}\d{10}$/.test(value))
          error = "Phone must include country code and exactly 10 digits (e.g. +14155552671).";
        break;
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          error = "Invalid email address.";
        break;
      case "address":
        if (!value.trim()) error = "Address is required.";
        break;
      case "city":
        if (!value.trim()) error = "City is required.";
        break;
      case "pincode":
        if (!/^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/.test(value))
          error = "Pincode must be in format A1A 1A1.";
        break;
      case "state":
        if (!value.trim()) error = "Province is required.";
        break;
      default:
    }
    return error;
  };

  const validateCanadaAddress = async (enteredAddress) => {
    setIsValidating(true);
    setValidationSuccess(false);

    try {
      const payload = {
        address: { regionCode: "CA", addressLines: [enteredAddress] },
      };
      const { data } = await axios.post(
        `https://addressvalidation.googleapis.com/v1:validateAddress?key=${GOOGLE_API_KEY}`,
        payload
      );
      const pa = data?.result?.address?.postalAddress;
      if (pa) {
        setCity(pa.locality || "");
        setState(pa.administrativeArea || "");
        setPincode(pa.postalCode || "");
        setTouched((t) => ({
          ...t,
          city: true,
          state: true,
          pincode: true,
        }));
        setErrors((prev) => ({
          ...prev,
          city: "",
          state: "",
          pincode: "",
          address: "",
        }));
        setValidationSuccess(true);
        // Reset success state after 3 seconds
        setTimeout(() => setValidationSuccess(false), 3000);
      } else if (data?.result?.suggestions?.length) {
        const suggestion = data.result.suggestions[0].address.formattedAddress;
        setAddress(suggestion);
        validateCanadaAddress(suggestion);
        return; // Don't set loading to false yet, let the recursive call handle it
      } else {
        setErrors((prev) => ({
          ...prev,
          address: "Unable to validate address",
        }));
      }
    } catch {
      setErrors((prev) => ({ ...prev, address: "Validation error" }));
    } finally {
      setIsValidating(false);
    }
  };

  // Reset validation states when address changes
  useEffect(() => {
    setValidationSuccess(false);
  }, [address]);

  // overall form validity
  useEffect(() => {
    const fullPhone = countryCode + phoneNumber;
    const isValid =
      !validateField("name", name) &&
      !validateField("phone", fullPhone) &&
      !validateField("email", email) &&
      !validateField("address", address) &&
      !validateField("city", city) &&
      !validateField("pincode", pincode) &&
      !validateField("state", state);
    setIsFormValid(isValid);
    setPhone(fullPhone);
  }, [name, countryCode, phoneNumber, email, address, city, pincode, state]);

  // Handlers for inputs
  const handleChange = (setter, field) => (e) => {
    setter(e.target.value);
    if (touched[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: validateField(field, e.target.value),
      }));
    }
  };

  const handleBlur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const vals = {
      name,
      phone: countryCode + phoneNumber,
      email,
      address,
      city,
      pincode,
      state,
    };
    setErrors((prev) => ({
      ...prev,
      [field]: validateField(field, vals[field]),
    }));
    if (field === "address" && !validateField("address", vals.address)) {
      validateCanadaAddress(vals.address);
    }
  };

  const handleValidateClick = () => {
    setTouched((prev) => ({ ...prev, address: true }));
    if (!validateField("address", address)) {
      validateCanadaAddress(address);
    } else {
      setErrors((prev) => ({
        ...prev,
        address: validateField("address", address),
      }));
    }
  };

  // Render validate button content based on state
  const renderValidateButtonContent = () => {
    if (isValidating) {
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
          <svg className="w-2 h-2 sm:w-3 sm:h-3" fill="currentColor" viewBox="0 0 20 20">
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

    return <span className="text-xs font-medium">Valid</span>;
  };

  return (
    <div className="h-auto w-full overflow-scroll scrollbar-hide flex flex-col gap-3 sm:gap-6 mt-4">
      {/* Name */}
      <div>
        <label className="block text-xs sm:text-sm font-medium mb-1">Name</label>
        <input
          type="text"
          value={name}
          onChange={handleChange(setName, "name")}
          onBlur={handleBlur("name")}
          placeholder="Enter your name"
          className="w-full py-2 px-3 sm:py-4 sm:px-4 rounded-lg sm:rounded-2xl border border-[#393C49] text-sm sm:text-lg bg-[#252836] focus:outline-none placeholder:text-white text-white"
        />
        {touched.name && errors.name && (
          <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.name}</p>
        )}
      </div>

      {/* Phone Number */}
      <div>
        <label className="block text-xs sm:text-sm font-medium mb-1">Phone Number</label>
        <div className="flex gap-1 sm:gap-2">
          <input
            type="text"
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            onBlur={handleBlur("phone")}
            placeholder="+1"
            className="w-1/4 py-2 px-2 sm:py-4 sm:px-4 rounded-lg sm:rounded-2xl border border-[#393C49] text-sm sm:text-lg bg-[#252836] focus:outline-none placeholder:text-white text-white"
          />
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            onBlur={handleBlur("phone")}
            placeholder="Enter your phone number"
            className="w-3/4 py-2 px-3 sm:py-4 sm:px-4 rounded-lg sm:rounded-2xl border border-[#393C49] text-sm sm:text-lg bg-[#252836] focus:outline-none placeholder:text-white text-white"
          />
        </div>
        {touched.phone && errors.phone && (
          <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.phone}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-xs sm:text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={handleChange(setEmail, "email")}
          onBlur={handleBlur("email")}
          placeholder="Enter your email"
          className="w-full py-2 px-3 sm:py-4 sm:px-4 rounded-lg sm:rounded-2xl border border-[#393C49] text-sm sm:text-lg bg-[#252836] focus:outline-none placeholder:text-white text-white"
        />
        {touched.email && errors.email && (
          <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.email}</p>
        )}
      </div>

      {/* Address */}
      <div>
        <label className="block text-xs sm:text-sm font-medium mb-1">Address</label>
        <div className="relative">
          <input
            type="text"
            value={address}
            onChange={handleChange(setAddress, "address")}
            onBlur={handleBlur("address")}
            placeholder="Enter your address"
            className="w-full py-2 px-3 pr-16 sm:py-4 sm:px-4 sm:pr-24 rounded-lg sm:rounded-2xl border border-[#393C49] text-sm sm:text-lg bg-[#252836] focus:outline-none placeholder:text-white text-white"
          />
          <button
            type="button"
            disabled={isValidating}
            className={`absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 py-1 px-2 sm:px-3 rounded-md sm:rounded-lg text-white text-xs transition ${
              validationSuccess
                ? "bg-green-600"
                : isValidating
                ? "bg-blue-600 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
            onClick={handleValidateClick}
          >
            {renderValidateButtonContent()}
          </button>
        </div>
        {touched.address && errors.address && (
          <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.address}</p>
        )}
      </div>

      {/* City & Pincode */}
      <div className="flex gap-2 sm:gap-4">
        <div className="w-1/2">
          <label className="block text-xs sm:text-sm font-medium mb-1">City</label>
          <input
            type="text"
            value={city}
            onChange={handleChange(setCity, "city")}
            onBlur={handleBlur("city")}
            placeholder="Enter city"
            className="w-full py-2 px-2 sm:py-4 sm:px-4 rounded-lg sm:rounded-2xl border border-[#393C49] text-sm sm:text-lg bg-[#252836] focus:outline-none placeholder:text-white text-white"
          />
          {touched.city && errors.city && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.city}</p>
          )}
        </div>
        <div className="w-1/2">
          <label className="block text-xs sm:text-sm font-medium mb-1">Pincode</label>
          <input
            type="text"
            value={pincode}
            onChange={handleChange(setPincode, "pincode")}
            onBlur={handleBlur("pincode")}
            placeholder="Enter pincode"
            className="w-full py-2 px-2 sm:py-4 sm:px-4 rounded-lg sm:rounded-2xl border border-[#393C49] text-sm sm:text-lg bg-[#252836] focus:outline-none placeholder:text-white text-white"
          />
          {touched.pincode && errors.pincode && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.pincode}</p>
          )}
        </div>
      </div>

      {/* Province/Territory */}
      <div>
        <label className="block text-xs sm:text-sm font-medium mb-1">
          Province/Territory
        </label>
        <input
          type="text"
          value={state}
          onChange={handleChange(setState, "state")}
          onBlur={handleBlur("state")}
          placeholder="Enter province"
          className="w-full py-2 px-3 sm:py-4 sm:px-4 rounded-lg sm:rounded-2xl border border-[#393C49] text-sm sm:text-lg bg-[#252836] focus:outline-none placeholder:text-white text-white"
        />
        {touched.state && errors.state && (
          <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.state}</p>
        )}
      </div>
    </div>
  );
};
