// templateService.js
import { getRequest, postRequest, deleteRequest, postWithoutAuth } from "./httpService";
import axios from 'axios';
// import { getRequest, postRequest } from "./httpService";

// const ELASTIC_AUTH_TOKEN = import.meta.env.VITE_ELASTIC_AUTH_TOKEN;
// const ELASTIC_AUTH_TOKEN = "Basic ZWxhc3RpYzpJbXlkUnpPZ1o2UnhkVjZUTHdDOA==";

export const getTemplateData = async (templateId) => {
  const endpoint = `/embedded/getTemplateSectionsItems/${templateId}`;

  try {
    const response = await getRequest(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error fetching template data:", error);
    throw error;
  }
};

export const getTemplates = async (businessId) => {
  const endpoint = "/embedded/getTemplates/" + businessId;

  try {
    const response = await getRequest(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error fetching templates:", error);
    throw error;
  }
};

export const calculateDeliveryCharge = async (
  origin_address,
  destination_address
) => {
  const endpoint = "/embedded/api/calculate-delivery-charge/new";
  try {
    const response = await postRequest(endpoint, {
      origin_address,
      destination_address,
    });
    return response.data;
  } catch (error) {
    console.error("Error calculating delivery charge:", error);
    throw error;
  }
  //   try {
  //     const resp = await fetch(
  //       "https://qa3.getafto.com/backend/embedded/api/calculate-delivery-charge",
  //       {
  //         method: "POST",
  //         headers: {
  //           "embedded-static-token":
  //             "mw7f8Ch2MSC300bHKEthp9CGZEIJL8A17d7fuYzT1PcROuHNPEVmEFYUyfmDrIFvpHglqusu4OwvUjAKpZM9ptRbAD7UihMOX2u6bZAdIkjLb7iDRqUIozYCi94HlIvoJO2IyX6AWBhacbHiVQE349ruLWwhfPlNXtoUg8xWweWtuHuaZDZD",
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           origin_address,
  //           destination_address,
  //         }),
  //       }
  //     );

  //     if (!resp.ok) {
  //       const errText = await resp.text();
  //       throw new Error(`Error ${resp.status}: ${errText}`);
  //     }

  //     const data = await resp.json();
  //     setResult(data);
  //   } catch (err) {
  //     console.error(err);
  //   }

  };

export const sendChatMessage = async (sessionId, message, businessId) => {
  const url = 'https://chatbot-qa.getafto.com/api/chat/message';
  // const url = 'https://chatbot.getafto.com/api/chat/message';
  const payload = {
    session_id: sessionId,
    message,
    business_id: businessId,
  };

  try {
    const response = await axios.post(url, payload, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data; // or return response if you need status, headers, etc.
  } catch (error) {
    console.error('sendChatMessage error:', error);
    throw error;
  }
}
// export async function searchByRetailerIds(businessId, retailerIds) {
//   const url = `https://qa3.getafto.com/backend/embedded/user/search-products-by-retailer-id/${businessId}`;
//   const payload = {
//     _source: { excludes: ["vector_embedding"] },
//     query: { terms: { retailer_id: retailerIds } }
//   };

//   try {
//     const { data } = await axios.post(url, payload, {
//       headers: {
//         "Content-Type": "application/json",
//         "embedded-static-token": import.meta.env.VITE_EMBEDDED_STATIC_TOKEN,
//         "accept": "application/json, text/plain, */*"
//       }
//     });
//     return data;
//   } catch (error) {
//     console.error("searchByRetailerIds error:", error);
//     throw error;
//   }
// }

export const searchByRetailerIds = async (businessId, retailerIds) => {
  const endpoint = `/embedded/user/search-products-by-retailer-id/${businessId}`;
  const payload = {
    _source: { excludes: ["vector_embedding"] },
    query: { terms: { retailer_id: retailerIds } },
  };

  try {
    const response = await postRequest(endpoint, payload);
    return response.data;
  } catch (error) {
    console.error("searchByRetailerIds error:", error);
    throw error;
  }
};


export const placeOrder = async (payload) => {
  const endpoint = "/embedded/order/create";

  try {
    const response = await postRequest(endpoint, payload);
    return response.data;
  } catch (error) {
    console.error("Error placing order:", error);
    throw error;
  }
};

// export const sendOtp = async (payload) => {
//   const endpoint = "/user/signIn";

//   try {
//     const response = await postRequest(endpoint, payload);
//     return response.data;
//   } catch (error) {
//     console.error("Error while sending OTP:", error);
//     throw error;
//   }
// };

// export const verifyOTP = async (payload) => {
//   const endpoint = "/user_otps/verify-otp";

//   try {
//     const response = await postRequest(endpoint, payload);
//     return response.data;
//   } catch (error) {
//     console.error("Error while verifying OTP:", error);
//     throw error;
//   }
// };

export const createUser = async (payload) => {
  const endpoint = "/embedded/user/signup";

  try {
    const response = await postRequest(endpoint, payload);
    return response.data;
  } catch (error) {
    console.error("Error while creating user", error);
    throw error;
  }
};

export const updateUserDetails = async (payload) => {
  const endpoint = "/embedded/user/update";

  try {
    const response = await postRequest(endpoint, payload);
    return response.data;
  } catch (error) {
    console.error("Error while updating user details", error);
    throw error;
  }
};

export const getUserAddress = async (payload) => {
  const endpoint = "/embedded/user/getAddress";

  try {
    const response = await postRequest(endpoint, payload);
    return response.data;
  } catch (error) {
    console.error("Error while fetching user details", error);
    throw error;
  }
};

export const searchItems = async (businessId, query) => {
  const endpoint = "/embedded/searchTemplates/" + businessId + "?q=" + query;

  try {
    const response = await getRequest(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error while searching items", error);
    throw error;
  }
};

// curl --location 'http://localhost:5000/embedded/user/search-products-elastic?index=91182be9-9446-4e29-9ade-b0312b238668&search=mi' \
// --header 'embedded-static-token: mw7f8Ch2MSC300bHKEthp9CGZEIJL8A17d7fuYzT1PcROuHNPEVmEFYUyfmDrIFvpHglqusu4OwvUjAKpZM9ptRbAD7UihMOX2u6bZAdIkjLb7iDRqUIozYCi94HlIvoJO2IyX6AWBhacbHiVQE349ruLWwhfPlNXtoUg8xWweWtuHuaZDZD'

export const searchProductsElastic = async (payload) => {
  const endpoint = `/embedded/user/search-products-elastic?index=${businessId}&search=${query}`;

  try {
    const response = await getRequest(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error while searching products", error);
    throw error;
  }
};

export const addItemToCart = async (payload) => {
  const endpoint = "/embedded/order/create/incomplete";
  try {
    const response = await postRequest(endpoint, payload);
    return response.data;
  } catch (error) {
    console.error("Error while adding item to cart", error);
    throw error;
  }
};

export const updateCart = async (payload) => {
  const endpoint = "/embedded/order/update/incomplete";

  try {
    const response = await postRequest(endpoint, payload);
    return response.data;
  } catch (error) {
    console.error("Error while updating cart", error);
    throw error;
  }
}

export const getCartItems = async (orderId) => {
  const endpoint = `embedded/order/${orderId}`;

  try {
    const response = await getRequest(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error while fetching cart items", error);
    throw error;
  }
};

// DELETE an item from the cart
export const deleteCartItem = async (itemId) => {
  const endpoint = `/embedded/order/item/${itemId}`;
  try {
    const response = await deleteRequest(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error while deleting cart item", error);
    throw error;
  }
};

// UPDATE just the quantity of a cart item
export const updateCartItemQuantity = async (itemId, quantity) => {
  const endpoint = `/embedded/order/item/${itemId}/${quantity}`;
  try {
    // the curl sends an empty body, so we just invoke postRequest without payload
    const response = await getRequest(endpoint, {});
    return response.data;
  } catch (error) {
    console.error("Error while updating cart item quantity", error);
    throw error;
  }
};

// CONFIRM the entire order
export const confirmOrder = async (orderId, payload) => {
  const endpoint = `/embedded/order/confirm/${orderId}`;
  try {
    const response = await postRequest(endpoint, payload);
    return response.data;
  } catch (error) {
    console.error("Error while confirming order", error);
    throw error;
  }
};

// GET a user’s order history
export const getUserOrderHistory = async (customerId, businessAccountId) => {
  const endpoint = `/embedded/orders/${customerId}/${businessAccountId}`;
  try {
    const response = await getRequest(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error while fetching user order history", error);
    throw error;
  }
};

// Send OTP (no auth required)
export const sendOtp = async (email) => {
  const endpoint = "/user/signIn";
  try {
    const response = await postWithoutAuth(endpoint, { email });
    return response.data;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};

// Verify OTP (no auth required)
export const verifyOtp = async (email, otp) => {
  const endpoint = "/user_otps/verify-otp";
  try {
    const response = await postWithoutAuth(endpoint, { email, otp });
    return response.data;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
};

// Customer Signup (requires embedded-static-token)
export const customerSignup = async (signupData, businessAccountId) => {
  const endpoint = "/embedded/user/signup-chatwoot";
  const payload = {
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
  };

  try {
    const response = await postRequest(endpoint, payload);
    return response.data;
  } catch (error) {
    console.error("Customer signup failed:", error);
    throw error;
  }
};

// Get Customer Data (requires embedded-static-token)
export const getCustomerData = async (email, businessAccountId) => {
  const endpoint = "/embedded/user/signin-chatwoot";
  const payload = { businessAccountId, email };

  try {
    const response = await postRequest(endpoint, payload);
    return response.data;
  } catch (error) {
    console.error("Error fetching customer data:", error);
    throw error;
  }
};
