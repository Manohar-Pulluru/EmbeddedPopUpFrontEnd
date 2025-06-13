import React, { useState, useEffect } from "react";

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
        state: "NY"
      }
    }
  };
};

const jwtDecode = (token) => ({
  name: "John Doe",
  email: "john@example.com"
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

  // Simulate localStorage for demo
  const mockLocalStorage = {
    getItem: (key) => {
      if (key === "aftoAuthToken") return "mock-token";
      if (key === "aftoAuthBusinessId") return "mock-business-id";
      return null;
    }
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
            const businessAccountId = mockLocalStorage.getItem("aftoAuthBusinessId");

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
          const businessAccountId = mockLocalStorage.getItem("aftoAuthBusinessId");

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

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Mobile Header */}
      <div className="lg:hidden bg-gray-800 px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <button
          onClick={toggleSidebar}
          className="text-white p-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-white text-lg font-semibold">Profile</h1>
        <div className="w-10"></div>
      </div>

      <div className="flex">
        {/* Sidebar Overlay for Mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
            onClick={toggleSidebar}
          ></div>
        )}

        {/* Sidebar */}
        <div className={`
          fixed top-0 left-0 h-full w-80 bg-[#252836] transform transition-transform duration-300 ease-in-out z-50
          lg:relative lg:transform-none lg:w-80 lg:min-h-screen
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-6">
            {/* Mobile Close Button */}
            <div className="lg:hidden flex justify-end mb-4">
              <button
                onClick={toggleSidebar}
                className="text-white p-2 rounded-lg hover:bg-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Profile Header */}
            <div className="flex items-center mb-8">
              <img
                src="https://images.unsplash.com/photo-1566753323558-f4e0952af115?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFsZXxlbnwwfHwwfHx8MA%3D%3D"
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="ml-4 flex-1 min-w-0">
                <p className="text-white font-semibold text-lg truncate">
                  {formData.name}
                </p>
                <p className="text-gray-300 text-sm truncate">{formData.email}</p>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-2">
              <button className="w-full flex items-center py-3 px-4 text-white bg-[#EA7C69] rounded-lg">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="font-medium">My Profile</span>
              </button>
              
              <button className="w-full flex items-center py-3 px-4 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Settings</span>
              </button>
              
              <button className="w-full flex items-center justify-between py-3 px-4 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span>Notifications</span>
                </div>
                <span className="bg-[#EA7C69] text-white text-xs font-semibold px-2 py-1 rounded-full">
                  ALLOW
                </span>
              </button>
              
              <button className="w-full flex items-center py-3 px-4 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Log out</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-h-screen lg:min-h-0">
          <div className="max-w-2xl mx-auto p-4 lg:p-8">
            <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
              {/* Profile Header Section */}
              <div className="bg-[#EA7C69] px-6 py-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-start">
                  <img
                    src="https://images.unsplash.com/photo-1566753323558-f4e0952af115?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFsZXxlbnwwfHwwfHx8MA%3D%3D"
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg mb-4 sm:mb-0"
                  />
                  <div className="sm:ml-6 text-center sm:text-left">
                    <h1 className="text-white text-2xl font-bold">{formData.name}</h1>
                    <p className="text-orange-100 text-lg">{formData.email}</p>
                    <div className="mt-3">
                      {isEditing ? (
                        <div className="flex flex-col sm:flex-row gap-3">
                          <button
                            onClick={handleSave}
                            className="bg-white text-[#EA7C69] px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                          >
                            Save Changes
                          </button>
                          <button
                            onClick={() => setIsEditing(false)}
                            className="bg-transparent border-2 border-white text-white px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-[#EA7C69] transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={handleEdit}
                          className="bg-white text-[#EA7C69] px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                        >
                          Edit Profile
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="p-6">
                <h2 className="text-white text-xl font-semibold mb-6">Personal Information</h2>
                
                <div className="space-y-6">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <label className="block text-gray-300 font-medium">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-[#EA7C69] focus:outline-none"
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <p className="text-white bg-gray-700 px-4 py-3 rounded-lg">{formData.name}</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label className="block text-gray-300 font-medium">Email Address</label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={hasToken}
                        className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-[#EA7C69] focus:outline-none disabled:opacity-50"
                        placeholder="Enter your email"
                      />
                    ) : (
                      <p className="text-white bg-gray-700 px-4 py-3 rounded-lg break-all">{formData.email}</p>
                    )}
                  </div>

                  {/* Phone Field */}
                  <div className="space-y-2">
                    <label className="block text-gray-300 font-medium">Phone Number</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-[#EA7C69] focus:outline-none"
                        placeholder="Enter your phone number"
                      />
                    ) : (
                      <p className="text-white bg-gray-700 px-4 py-3 rounded-lg">{formData.phone || "Add phone number"}</p>
                    )}
                  </div>

                  {/* Address Field */}
                  <div className="space-y-2">
                    <label className="block text-gray-300 font-medium">Address</label>
                    {isEditing ? (
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-[#EA7C69] focus:outline-none resize-none"
                        placeholder="Enter your address"
                      />
                    ) : (
                      <p className="text-white bg-gray-700 px-4 py-3 rounded-lg">{formData.address || "Add address"}</p>
                    )}
                  </div>

                  {/* City and Pincode Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-gray-300 font-medium">City</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-[#EA7C69] focus:outline-none"
                          placeholder="Enter city"
                        />
                      ) : (
                        <p className="text-white bg-gray-700 px-4 py-3 rounded-lg">{formData.city || "Add city"}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-gray-300 font-medium">Pincode</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-[#EA7C69] focus:outline-none"
                          placeholder="Enter pincode"
                        />
                      ) : (
                        <p className="text-white bg-gray-700 px-4 py-3 rounded-lg">{formData.pincode || "Add pincode"}</p>
                      )}
                    </div>
                  </div>

                  {/* State Field */}
                  <div className="space-y-2">
                    <label className="block text-gray-300 font-medium">State</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-[#EA7C69] focus:outline-none"
                        placeholder="Enter state"
                      />
                    ) : (
                      <p className="text-white bg-gray-700 px-4 py-3 rounded-lg">{formData.state || "Add state"}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
