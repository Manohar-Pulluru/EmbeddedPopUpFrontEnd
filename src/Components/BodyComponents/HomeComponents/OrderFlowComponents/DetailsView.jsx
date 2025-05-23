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

  const validateField = (field, value) => {
    let error = "";

    switch (field) {
      case "name":
        if (!value.trim()) error = "Name is required.";
        break;
      case "phone":
        if (!/^\+\d{1,4}\d{7,12}$/.test(value))
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
        if (!/^\d{6}$/.test(value)) error = "Pincode must be 6 digits.";
        break;
      case "state":
        if (!value.trim()) error = "State is required.";
        break;
      default:
        break;
    }

    return error;
  };

  useEffect(() => {
    const isValid =
      !validateField("name", name) &&
      !validateField("phone", phone) &&
      !validateField("email", email) &&
      !validateField("address", address) &&
      !validateField("city", city) &&
      !validateField("pincode", pincode) &&
      !validateField("state", state);

    setIsFormValid(isValid);
  }, [name, phone, email, address, city, pincode, state, setIsFormValid]);

  const handleChange = (setter, field) => (e) => {
    const value = e.target.value;
    setter(value);
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleBlur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const values = { name, phone, email, address, city, pincode, state };
    const error = validateField(field, values[field]);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  return (
    <div className="h-auto w-full overflow-scroll scrollbar-hide flex flex-col gap-6">
      {[
        {
          label: "Name",
          type: "text",
          value: name,
          onChange: setName,
          key: "name",
          name: "disable-autofill-name", // Unique name to prevent autofill
          autoComplete: "new-password", // Non-standard value to disable autofill
        },
        {
          label: "Phone Number",
          type: "tel",
          value: phone,
          onChange: setPhone,
          key: "phone",
          name: "disable-autofill-phone",
          autoComplete: "new-password",
        },
        {
          label: "Email",
          type: "email",
          value: email,
          onChange: setEmail,
          key: "email",
          name: "disable-autofill-email",
          autoComplete: "new-password",
        },
        {
          label: "Address",
          type: "text",
          value: address,
          onChange: setAddress,
          key: "address",
          name: "disable-autofill-address",
          autoComplete: "new-password",
        },
      ].map(({ label, type, value, onChange, key, name, autoComplete }) => (
        <div key={key}>
          <label className="block text-sm font-medium mb-1">{label}</label>
          <input
            type={type}
            value={value}
            name={name}
            autoComplete={autoComplete}
            onChange={handleChange(onChange, key)}
            onBlur={handleBlur(key)}
            placeholder={`Enter your ${label.toLowerCase()}`}
            className="w-full py-4 px-4 rounded-2xl border border-[#393C49] text-lg bg-[#252836] focus:outline-none placeholder:text-white text-white"
          />
          {touched[key] && errors[key] && (
            <p className="text-red-500 text-sm mt-1">{errors[key]}</p>
          )}
        </div>
      ))}

      <div className="flex gap-4">
        {[
          {
            label: "City",
            value: city,
            onChange: setCity,
            key: "city",
            name: "disable-autofill-city",
            autoComplete: "new-password",
          },
          {
            label: "Pincode",
            value: pincode,
            onChange: setPincode,
            key: "pincode",
            name: "disable-autofill-pincode",
            autoComplete: "new-password",
          },
        ].map(({ label, value, onChange, key, name, autoComplete }) => (
          <div className="w-1/2" key={key}>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <input
              type="text"
              value={value}
              name={name}
              autoComplete={autoComplete}
              onChange={handleChange(onChange, key)}
              onBlur={handleBlur(key)}
              placeholder={`Enter ${label.toLowerCase()}`}
              className="w-full py-4 px-4 rounded-2xl border border-[#393C49] text-lg bg-[#252836] focus:outline-none placeholder:text-white text-white"
            />
            {touched[key] && errors[key] && (
              <p className="text-red-500 text-sm mt-1">{errors[key]}</p>
            )}
          </div>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">State</label>
        <input
          type="text"
          value={state}
          name="disable-autofill-state"
          autoComplete="new-password"
          onChange={handleChange(setState, "state")}
          onBlur={handleBlur("state")}
          placeholder="Enter your state"
          className="w-full py-4 px-4 rounded-2xl border border-[#393C49] text-lg bg-[#252836] focus:outline-none placeholder:text-white text-white"
        />
        {touched["state"] && errors["state"] && (
          <p className="text-red-500 text-sm mt-1">{errors["state"]}</p>
        )}
      </div>
    </div>
  );
};