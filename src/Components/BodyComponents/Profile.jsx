import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../../Service/Context/AppContext";

// Mock API functions for demonstration
const updateUserDetails = async (payload, token) => {
  console.log("Updating user details:", payload);
  return { success: true };
};

const getUserAddress = async (payload) => {
  console.log("Fetching user address:", payload);
  return {
    embeddedUser: {
      otherDetails: {
        name: "John Doe",
        email: "john@example.com",
        phone: "+1234567890",
        address: "123 Main Street",
        city: "New York",
        pincode: "10001",
        state: "NY",
      },
    },
  };
};

const jwtDecode = (token) => ({
  name: "John Doe",
  email: "john@example.com",
});

export const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "your name",
    email: "yourname@gmail.com",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    state: "",
  });
  const [hasToken, setHasToken] = useState(false);
  const { isMobile } = useContext(AppContext);

  // Simulate localStorage for demo
  const mockLocalStorage = {
    getItem: (key) => {
      if (key === "aftoAuthToken") return "mock-token";
      if (key === "aftoAuthBusinessId") return "mock-business-id";
      return null;
    },
  };

  // Populate form data from token and fetch address if token exists
  useEffect(() => {
    const token = mockLocalStorage.getItem("aftoAuthToken");
    if (token) {
      setHasToken(true);
      try {
        const decodedToken = jwtDecode(token);
        setFormData((prev) => ({
          ...prev,
          name: decodedToken.name || prev.name,
          email: decodedToken.email || prev.email,
        }));

        // Fetch address details
        const fetchAddress = async () => {
          try {
            const email = decodedToken.email;
            const businessAccountId =
              mockLocalStorage.getItem("aftoAuthBusinessId");

            if (!email || !businessAccountId) {
              console.log("Email or businessAccountId missing");
              return;
            }

            const payload = {
              email,
              businessAccountId,
            };

            console.log("Fetching address with payload:", payload);
            const response = await getUserAddress(payload);

            if (response?.embeddedUser?.otherDetails) {
              const { name, email, phone, address, city, pincode, state } =
                response.embeddedUser.otherDetails;
              setFormData((prev) => ({
                ...prev,
                name: name || prev.name,
                email: email || prev.email,
                phone: phone || "",
                address: address || "",
                city: city || "",
                pincode: pincode || "",
                state: state || "",
              }));
              console.log(
                "Address data set:",
                response.embeddedUser.otherDetails
              );
            } else {
              console.log("No address data in response");
            }
          } catch (error) {
            console.error("Error fetching address:", error);
          }
        };

        fetchAddress();
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    const token = mockLocalStorage.getItem("aftoAuthToken");
    try {
      const decodedToken = jwtDecode(token);
      console.log("Decoded aftoAuthToken:", decodedToken);

      const payload = {
        email: decodedToken.email || formData.email,
        businessAccountId: mockLocalStorage.getItem("aftoAuthBusinessId"),
        addressDetails: { ...formData },
      };

      const response = await updateUserDetails(payload, token);
      console.log("Update response:", response);
      setIsEditing(false);

      // Refetch address after save to ensure UI is up-to-date
      const fetchAddress = async () => {
        try {
          const email = decodedToken.email;
          const businessAccountId =
            mockLocalStorage.getItem("aftoAuthBusinessId");

          if (!email || !businessAccountId) {
            console.log("Email or businessAccountId missing");
            return;
          }

          const payload = {
            email,
            businessAccountId,
          };

          console.log("Fetching address with payload:", payload);
          const response = await getUserAddress(payload);

          if (response?.embeddedUser?.otherDetails) {
            const { name, email, phone, address, city, pincode, state } =
              response.embeddedUser.otherDetails;
            setFormData((prev) => ({
              ...prev,
              name: name || prev.name,
              email: email || prev.email,
              phone: phone || "",
              address: address || "",
              city: city || "",
              pincode: pincode || "",
              state: state || "",
            }));
            console.log(
              "Address data set:",
              response.embeddedUser.otherDetails
            );
          } else {
            console.log("No address data in response");
          }
        } catch (error) {
          console.error("Error fetching address:", error);
        }
      };

      fetchAddress();
    } catch (error) {
      console.error("Error decoding token or saving details:", error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const triggerLogout = () => {
    localStorage.removeItem("aftoAuthToken");
    window.location.reload();
  };

  return (
    <div className="h-screen overflow-scroll bg-[#252836]">
      {/* Mobile Header */}
      <div className="lg:hidden bg-gray-800/90 backdrop-blur-sm px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-lg border-b border-gray-700">
        <button
          onClick={toggleSidebar}
          className="text-white p-2 rounded-lg hover:bg-gray-700 transition-all duration-200"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <h1 className="text-white text-lg font-semibold">My Profile</h1>
        <div className="w-10"></div>
      </div>

      <div className="flex min-h-screen">
        {/* Sidebar Overlay for Mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-60 z-40 lg:hidden transition-opacity duration-300"
            onClick={toggleSidebar}
          ></div>
        )}

        {/* Sidebar */}

        <div
          className={`lg:hidden fixed top-0 left-0 h-full w-80 bg-gradient-to-b from-gray-800 to-gray-900 transform transition-all duration-300 ease-in-out z-50 shadow-2xl
          lg:relative lg:transform-none lg:w-80 lg:min-h-screen
          ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
        >
          <div className="p-6 h-full flex flex-col">
            {/* Mobile Close Button */}
            <div className="lg:hidden flex justify-end mb-4">
              <button
                onClick={toggleSidebar}
                className="text-white p-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Profile Header */}
            <div className="flex items-center mb-8 p-4 bg-gray-700/50 rounded-xl backdrop-blur-sm">
              <div className="relative">
                <img
                  src="https://qa3.getafto.com/images/face5.svg"
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover ring-4 ring-[#EA7C69]/30"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-800"></div>
              </div>
              <div className="ml-4 flex-1 min-w-0">
                <p className="text-white font-semibold text-lg truncate">
                  {formData.name}
                </p>
                <p className="text-gray-300 text-sm truncate">
                  {formData.email}
                </p>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-3 flex-1">
              <button className="w-full flex items-center py-3 px-4 text-white bg-gradient-to-r from-[#EA7C69] to-[#d67159] rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                <svg
                  className="w-5 h-5 mr-3"
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
                <span className="font-medium">My Profile</span>
              </button>

              <button
                onClick={triggerLogout}
                className="w-full flex items-center py-3 px-4 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-xl transition-all duration-200 group"
              >
                <svg
                  className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform"
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
                <span>Log out</span>
              </button>
            </nav>

            {/* Footer */}
            <div className="mt-auto pt-6 border-t border-gray-700">
              <p className="text-gray-400 text-xs text-center">
                FoodApp © 2025
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-h-screen lg:overflow-y-auto">
          <div className="max-w-4xl mx-auto p-4 lg:p-8">
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-700/50">
              {/* Profile Header Section */}
              <div className="bg-gradient-to-r from-[#EA7C69] via-[#d67159] to-[#EA7C69] px-6 py-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    <div className="relative">
                      <img
                        src="https://qa3.getafto.com/images/face5.svg"
                        alt="Profile"
                        className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-2xl"
                      />
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="text-center sm:text-left flex-1">
                      <h1 className="text-white text-3xl font-bold mb-2">
                        {formData.name}
                      </h1>
                      <p className="text-orange-100 text-lg mb-4 break-all">
                        {formData.email}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        {isEditing ? (
                          <>
                            <button
                              onClick={handleSave}
                              className="bg-white text-[#EA7C69] px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                              💾 Save Changes
                            </button>
                            <button
                              onClick={() => setIsEditing(false)}
                              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white hover:text-[#EA7C69] transition-all duration-200"
                            >
                              ✕ Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={handleEdit}
                            className="bg-white text-[#EA7C69] px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                          >
                            ✏️ Edit Profile
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="p-6 lg:p-8">
                <div className="flex items-center mb-8">
                  <h2 className="text-white text-2xl font-bold">
                    Personal Information
                  </h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-gray-600 to-transparent ml-6"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Name Field */}
                  <div className="lg:col-span-2">
                    <label className="block text-gray-300 font-medium mb-3 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-[#EA7C69]"
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
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700/50 text-white px-4 py-4 rounded-xl border border-gray-600 focus:border-[#EA7C69] focus:outline-none focus:ring-2 focus:ring-[#EA7C69]/20 backdrop-blur-sm transition-all duration-200"
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <div className="bg-gray-700/30 text-white px-4 py-4 rounded-xl border border-gray-600/50 min-h-[3.5rem] flex items-center">
                        {formData.name}
                      </div>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="lg:col-span-2">
                    <label className="block text-gray-300 font-medium mb-3 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-[#EA7C69]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      Email Address
                      {hasToken && (
                        <span className="ml-2 text-xs bg-gray-600 px-2 py-1 rounded-full">
                          Verified
                        </span>
                      )}
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={hasToken}
                        className="w-full bg-gray-700/50 text-white px-4 py-4 rounded-xl border border-gray-600 focus:border-[#EA7C69] focus:outline-none focus:ring-2 focus:ring-[#EA7C69]/20 backdrop-blur-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="Enter your email"
                      />
                    ) : (
                      <div className="bg-gray-700/30 text-white px-4 py-4 rounded-xl border border-gray-600/50 min-h-[3.5rem] flex items-center break-all">
                        {formData.email}
                      </div>
                    )}
                  </div>

                  {/* Phone Field */}
                  <div>
                    <label className="block text-gray-300 font-medium mb-3 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-[#EA7C69]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700/50 text-white px-4 py-4 rounded-xl border border-gray-600 focus:border-[#EA7C69] focus:outline-none focus:ring-2 focus:ring-[#EA7C69]/20 backdrop-blur-sm transition-all duration-200"
                        placeholder="Enter your phone number"
                      />
                    ) : (
                      <div className="bg-gray-700/30 text-white px-4 py-4 rounded-xl border border-gray-600/50 min-h-[3.5rem] flex items-center">
                        {formData.phone || (
                          <span className="text-gray-400">
                            Add phone number
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* State Field */}
                  <div>
                    <label className="block text-gray-300 font-medium mb-3 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-[#EA7C69]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Province/Territory
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700/50 text-white px-4 py-4 rounded-xl border border-gray-600 focus:border-[#EA7C69] focus:outline-none focus:ring-2 focus:ring-[#EA7C69]/20 backdrop-blur-sm transition-all duration-200"
                        placeholder="Enter state"
                      />
                    ) : (
                      <div className="bg-gray-700/30 text-white px-4 py-4 rounded-xl border border-gray-600/50 min-h-[3.5rem] flex items-center">
                        {formData.state || (
                          <span className="text-gray-400">Add state</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Address Field */}
                  <div className="lg:col-span-2">
                    <label className="block text-gray-300 font-medium mb-3 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-[#EA7C69]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      Address
                    </label>
                    {isEditing ? (
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full bg-gray-700/50 text-white px-4 py-4 rounded-xl border border-gray-600 focus:border-[#EA7C69] focus:outline-none focus:ring-2 focus:ring-[#EA7C69]/20 backdrop-blur-sm transition-all duration-200 resize-none"
                        placeholder="Enter your address"
                      />
                    ) : (
                      <div className="bg-gray-700/30 text-white px-4 py-4 rounded-xl border border-gray-600/50 min-h-[6rem] flex items-start pt-4">
                        {formData.address || (
                          <span className="text-gray-400">Add address</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* City and Pincode Row */}
                  <div>
                    <label className="block text-gray-300 font-medium mb-3 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-[#EA7C69]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      City
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700/50 text-white px-4 py-4 rounded-xl border border-gray-600 focus:border-[#EA7C69] focus:outline-none focus:ring-2 focus:ring-[#EA7C69]/20 backdrop-blur-sm transition-all duration-200"
                        placeholder="Enter city"
                      />
                    ) : (
                      <div className="bg-gray-700/30 text-white px-4 py-4 rounded-xl border border-gray-600/50 min-h-[3.5rem] flex items-center">
                        {formData.city || (
                          <span className="text-gray-400">Add city</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-300 font-medium mb-3 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-[#EA7C69]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                        />
                      </svg>
                      Pincode
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700/50 text-white px-4 py-4 rounded-xl border border-gray-600 focus:border-[#EA7C69] focus:outline-none focus:ring-2 focus:ring-[#EA7C69]/20 backdrop-blur-sm transition-all duration-200"
                        placeholder="Enter pincode"
                      />
                    ) : (
                      <div className="bg-gray-700/30 text-white px-4 py-4 rounded-xl border border-gray-600/50 min-h-[3.5rem] flex items-center">
                        {formData.pincode || (
                          <span className="text-gray-400">Add pincode</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                {!isEditing && (
                  <div className="mt-8 pt-8 border-t border-gray-700/50">
                    <h3 className="text-white text-lg font-semibold mb-4">
                      Quick Actions
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      <button className="flex items-center px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 transition-colors">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                        Change Password
                      </button>
                      <button className="flex items-center px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 transition-colors">
                        <svg
                          className="w-4 h-4 mr-2"
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
                        Notifications
                      </button>
                      <button className="flex items-center px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 transition-colors">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                          />
                        </svg>
                        Share Profile
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
