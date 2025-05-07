import React, { useState, useEffect } from "react";
import { updateUserDetails } from "../../Service/api";
import { jwtDecode } from "jwt-decode";
// import { useNavigate } from "react-router-dom";

export const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "your name",
    email: "yourname@gmail.com",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    state: "",
  });
  // const navigate = useNavigate();

  // useEffect(() => {
  //   const token = localStorage.getItem("aftoAuthToken");
  //   if (!token) {
  //     navigate("/login");
  //   }
  // }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    const token = localStorage.getItem("aftoAuthToken");
    // if (!token) {
    //   navigate("/login");
    //   return;
    // }

    try {
      const decodedToken = jwtDecode(token);
      console.log("Decoded aftoAuthToken:", decodedToken);

      

      await updateUserDetails(formData, token);
      console.log("Saved User Details:", formData);

      const payload = {
        email: decodedToken.email || formData.email, // Fallback to formData.email if decodedToken.email is undefined
        businessAccountId: localStorage.getItem("aftoAuthBusinessId"),
        addressDetails: { ...formData }, // Include full formData in addressDetails
      };

      const response  = await updateUserDetails(payload)

      console.log(response, "updateData")
      setIsEditing(false);
    } catch (error) {
      console.error("Error decoding token or saving details:", error);
    }
  };

  return (
    <div className="flex h-screen gap-4 bg-[#252836] p-16">
      {/* Left Sidebar */}
      <div className="h-[480px]">
        <div className="bg-[#1f1d2b] rounded-2xl shadow-lg p-4 w-[300px] flex flex-col">
          {/* Profile Section */}
          <div className="flex items-center mb-4">
            <img
              src="https://images.unsplash.com/photo-1566753323558-f4e0952af115?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFsZXxlbnwwfHwwfHx8MA%3D%3D"
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover"
            />
            <div className="ml-3">
              <p className="text-base font-semibold text-white">{formData.name}</p>
              <p className="text-xs text-white">{formData.email}</p>
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-2">
            <button className="w-full flex items-center py-2 px-3 text-white hover:bg-[#2D303E] cursor-pointer rounded-lg">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              My Profile
            </button>
            <button className="w-full flex items-center py-2 px-3 text-white hover:bg-[#2D303E] cursor-pointer rounded-lg">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Settings
            </button>
            <button className="w-full flex items-center py-2 px-3 text-white hover:bg-[#2D303E] cursor-pointer rounded-lg">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              Notification
              <span className="ml-auto bg-[#ea7c69] text-white text-xs font-semibold px-2 py-1 rounded-full">
                ALLOW
              </span>
            </button>
            <button className="w-full flex items-center py-2 px-3 text-white hover:bg-[#2D303E] cursor-pointer rounded-lg">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Log out
            </button>
          </div>
        </div>
      </div>

      {/* Right Profile Section */}
      <div className="bg-[#1f1d2b] w-[400px] flex flex-col rounded-2xl h-fit shadow-lg p-6 relative">
        {/* Profile Picture and Email */}
        <div className="flex items-center mb-6">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1566753323558-f4e0952af115?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFsZXxlbnwwfHwwfHx8MA%3D%3D"
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover"
            />
          </div>
          <div className="ml-4">
            <p className="text-lg font-semibold text-white">{formData.name}</p>
            <p className="text-sm text-white">{formData.email}</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Name */}
          <div className="flex w-full justify-between py-3 text-md border-b border-[#3a2f2f]">
            <label className="block font-medium text-white">Name</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
                className="bg-[#2D303E] text-white rounded px-2 py-1"
              />
            ) : (
              <p className="text-white">{formData.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="flex w-full justify-between py-3 text-md border-b border-[#3a2f2f]">
            <label className="block font-medium text-white">Email account</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="bg-[#2D303E] text-white rounded px-2 py-1"
              />
            ) : (
              <p className="text-white">{formData.email}</p>
            )}
          </div>

          {/* Phone Number */}
          <div className="flex w-full justify-between py-3 text-md border-b border-[#3a2f2f]">
            <label className="block font-medium text-white">Phone number</label>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                className="bg-[#2D303E] text-white rounded px-2 py-1"
              />
            ) : (
              <p className="text-white">{formData.phone || "Add number"}</p>
            )}
          </div>

          {/* Address */}
          <div className="flex w-full justify-between py-3 text-md border-b border-[#3a2f2f]">
            <label className="block font-medium text-white">Address</label>
            {isEditing ? (
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter your address"
                className="bg-[#2D303E] text-white rounded px-2 py-1"
              />
            ) : (
              <p className="text-white">{formData.address || "Add address"}</p>
            )}
          </div>

          {/* City */}
          <div className="flex w-full justify-between py-3 text-md border-b border-[#3a2f2f]">
            <label className="block font-medium text-white">City</label>
            {isEditing ? (
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Enter city"
                className="bg-[#2D303E] text-white rounded px-2 py-1"
              />
            ) : (
              <p className="text-white">{formData.city || "Add city"}</p>
            )}
          </div>

          {/* Pincode */}
          <div className="flex w-full justify-between py-3 text-md border-b border-[#3a2f2f]">
            <label className="block font-medium text-white">Pincode</label>
            {isEditing ? (
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                placeholder="Enter pincode"
                className="bg-[#2D303E] text-white rounded px-2 py-1"
              />
            ) : (
              <p className="text-white">{formData.pincode || "Add pincode"}</p>
            )}
          </div>

          {/* State */}
          <div className="flex w-full justify-between py-3 text-md border-b border-[#3a2f2f]">
            <label className="block font-medium text-white">State</label>
            {isEditing ? (
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="Enter your state"
                className="bg-[#2D303E] text-white rounded px-2 py-1"
              />
            ) : (
              <p className="text-white">{formData.state || "Add state"}</p>
            )}
          </div>
        </div>

        {/* Buttons */}
        {isEditing ? (
          <button
            onClick={handleSave}
            className="mt-6 font-semibold w-full cursor-pointer bg-[#ea7c69] text-white py-2 rounded-lg hover:bg-[#db8677]"
          >
            Save
          </button>
        ) : (
          <button
            onClick={handleEdit}
            className="mt-6 font-semibold w-full cursor-pointer bg-[#ea7c69] text-white py-2 rounded-lg hover:bg-[#db8677]"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};