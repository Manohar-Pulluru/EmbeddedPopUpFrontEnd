import React, { useState, useEffect } from "react";

export const DetailsView = ({
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
}) => {
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

  // split initial phone (if any) into countryCode & phoneNumber
  const [countryCode, setCountryCode] = useState("+1");
  const [phoneNumber, setPhoneNumber] = useState("");

  // list of provinces fetched from API
  const [provinces, setProvinces] = useState([]);

  useEffect(() => {
    if (phone && phone.startsWith("+")) {
      const match = phone.match(/^\+(\d{1,4})(\d*)$/);
      if (match) {
        setCountryCode(`+${match[1]}`);
        setPhoneNumber(match[2]);
      }
    }
  }, []); // run once on mount

  useEffect(() => {
    fetch("https://countriesnow.space/api/v0.1/countries/states", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country: "Canada" }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.data && Array.isArray(data.data.states)) {
          setProvinces(data.data.states.map((s) => s.name));
        }
      })
      .catch(() => {
        setProvinces([]);
      });
  }, []); // fetch provinces once

  const validateField = (field, value) => {
    let error = "";

    switch (field) {
      case "name":
        if (!value.trim()) error = "Name is required.";
        break;
      case "phone":
        if (!/^\+\d{1,1}\d{7,12}$/.test(value))
          error = "Phone number must include country code (e.g., +14155552671).";
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
        if (!/^\d{5}$/.test(value)) error = "Pincode must be 5 digits.";
        break;
      case "state":
        if (!value.trim()) error = "Province is required.";
        break;
      default:
        break;
    }

    return error;
  };

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
  }, [
    name,
    countryCode,
    phoneNumber,
    email,
    address,
    city,
    pincode,
    state,
    setIsFormValid,
    setPhone,
  ]);

  const handleChange = (setter, field) => (e) => {
    const value = e.target.value;
    setter(value);

    if (touched[field]) {
      const values = {
        name,
        phone: countryCode + phoneNumber,
        email,
        address,
        city,
        pincode,
        state,
      };
      const error = validateField(field, values[field]);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleCountryCodeChange = (e) => {
    const value = e.target.value;
    setCountryCode(value);
    if (touched.phone) {
      const combined = value + phoneNumber;
      const error = validateField("phone", combined);
      setErrors((prev) => ({ ...prev, phone: error }));
      setPhone(combined);
    } else {
      setPhone(value + phoneNumber);
    }
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    setPhoneNumber(value);
    if (touched.phone) {
      const combined = countryCode + value;
      const error = validateField("phone", combined);
      setErrors((prev) => ({ ...prev, phone: error }));
      setPhone(combined);
    } else {
      setPhone(countryCode + value);
    }
  };

  const handleBlur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const values = {
      name,
      phone: countryCode + phoneNumber,
      email,
      address,
      city,
      pincode,
      state,
    };
    const error = validateField(field, values[field]);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  return (
    <div className="h-auto w-full overflow-scroll scrollbar-hide flex flex-col gap-6">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          type="text"
          value={name}
          autoComplete="new-password"
          onChange={handleChange(setName, "name")}
          onBlur={handleBlur("name")}
          placeholder="Enter your name"
          className="w-full py-4 px-4 rounded-2xl border border-[#393C49] text-lg bg-[#252836] focus:outline-none placeholder:text-white text-white"
        />
        {touched.name && errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      {/* Phone Number */}
      <div>
        <label className="block text-sm font-medium mb-1">Phone Number</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={countryCode}
            onChange={handleCountryCodeChange}
            onBlur={handleBlur("phone")}
            placeholder="+1"
            className="w-1/4 py-4 px-4 rounded-2xl border border-[#393C49] text-lg bg-[#252836] focus:outline-none placeholder:text-white text-white"
          />
          <input
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            onBlur={handleBlur("phone")}
            placeholder="Enter your phone number"
            className="w-3/4 py-4 px-4 rounded-2xl border border-[#393C49] text-lg bg-[#252836] focus:outline-none placeholder:text-white text-white"
          />
        </div>
        {touched.phone && errors.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          value={email}
          autoComplete="new-password"
          onChange={handleChange(setEmail, "email")}
          onBlur={handleBlur("email")}
          placeholder="Enter your email"
          className="w-full py-4 px-4 rounded-2xl border border-[#393C49] text-lg bg-[#252836] focus:outline-none placeholder:text-white text-white"
        />
        {touched.email && errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium mb-1">Address</label>
        <input
          type="text"
          value={address}
          autoComplete="new-password"
          onChange={handleChange(setAddress, "address")}
          onBlur={handleBlur("address")}
          placeholder="Enter your address"
          className="w-full py-4 px-4 rounded-2xl border border-[#393C49] text-lg bg-[#252836] focus:outline-none placeholder:text-white text-white"
        />
        {touched.address && errors.address && (
          <p className="text-red-500 text-sm mt-1">{errors.address}</p>
        )}
      </div>

      {/* City & Pincode */}
      <div className="flex gap-4">
        <div className="w-1/2">
          <label className="block text-sm font-medium mb-1">City</label>
          <input
            type="text"
            value={city}
            autoComplete="new-password"
            onChange={handleChange(setCity, "city")}
            onBlur={handleBlur("city")}
            placeholder="Enter city"
            className="w-full py-4 px-4 rounded-2xl border border-[#393C49] text-lg bg-[#252836] focus:outline-none placeholder:text-white text-white"
          />
          {touched.city && errors.city && (
            <p className="text-red-500 text-sm mt-1">{errors.city}</p>
          )}
        </div>
        <div className="w-1/2">
          <label className="block text-sm font-medium mb-1">Pincode</label>
          <input
            type="text"
            value={pincode}
            autoComplete="new-password"
            onChange={handleChange(setPincode, "pincode")}
            onBlur={handleBlur("pincode")}
            placeholder="Enter pincode"
            className="w-full py-4 px-4 rounded-2xl border border-[#393C49] text-lg bg-[#252836] focus:outline-none placeholder:text-white text-white"
          />
          {touched.pincode && errors.pincode && (
            <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>
          )}
        </div>
      </div>

      {/* State Dropdown */}
      <div>
        <label className="block text-sm font-medium mb-1">Province/Territory</label>
        <select
          value={state}
          onChange={handleChange(setState, "state")}
          onBlur={handleBlur("state")}
          className="w-full py-4 px-4 rounded-2xl border border-[#393C49] text-lg bg-[#252836] focus:outline-none text-white"
        >
          <option value="">Select Province</option>
          {provinces.map((prov) => (
            <option key={prov} value={prov}>
              {prov}
            </option>
          ))}
        </select>
        {touched.state && errors.state && (
          <p className="text-red-500 text-sm mt-1">{errors.state}</p>
        )}
      </div>
    </div>
  );
};
