import React from "react";

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
  setState
}) => {
  return (
    <div className="h-auto w-full overflow-scroll scrollbar-hide flex flex-col gap-6">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          type="text"
          value={name}
          autoComplete="off"
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="w-full py-4 px-4 rounded-2xl border border-[#393C49] text-lg bg-[#252836] focus:outline-none placeholder:text-white text-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Phone Number</label>
        <input
          type="tel"
          value={phone}
          autoComplete="off"

          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter your phone number"
          className="w-full py-4 px-4 rounded-2xl border border-[#393C49] text-lg bg-[#252836] focus:outline-none placeholder:text-white text-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          value={email}
          autoComplete="off"

          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full py-4 px-4 rounded-2xl border border-[#393C49] text-lg bg-[#252836] focus:outline-none placeholder:text-white text-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Address</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter your address"
          className="w-full py-4 px-4 rounded-2xl border border-[#393C49] text-lg bg-[#252836] focus:outline-none placeholder:text-white text-white"
        />
      </div>
      <div className="flex gap-4">
        <div className="w-1/2">
          <label className="block text-sm font-medium mb-1">City</label>
          <input
            type="text"
            value={city}
            autoComplete="off"

            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city"
            className="w-full py-4 px-4 rounded-2xl border border-[#393C49] text-lg bg-[#252836] focus:outline-none placeholder:text-white text-white"
          />
        </div>
        <div className="w-1/2">
          <label className="block text-sm font-medium mb-1">Pincode</label>
          <input
            type="text"
            value={pincode}
            autoComplete="off"

            onChange={(e) => setPincode(e.target.value)}
            placeholder="Enter pincode"
            className="w-full py-4 px-4 rounded-2xl border border-[#393C49] text-lg bg-[#252836] focus:outline-none placeholder:text-white text-white"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">State</label>
        <input
          type="text"
          value={state}
          autoComplete="off"

          onChange={(e) => setState(e.target.value)}
          placeholder="Enter your state"
          className="w-full py-4 px-4 rounded-2xl border border-[#393C49] text-lg bg-[#252836] focus:outline-none placeholder:text-white text-white"
        />
      </div>
    </div>
  );
};
