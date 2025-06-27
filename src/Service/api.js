// templateService.js
import { getRequest, postRequest } from "./httpService";
import axios from 'axios';

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
  const endpoint = "/embedded/api/calculate-delivery-charge";
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
export async function searchByRetailerIds(businessId, retailerIds) {
  const url = `https://qa3.getafto.com/backend/embedded/user/search-products-by-retailer-id/${businessId}`;
  const payload = {
    _source: { excludes: ["vector_embedding"] },
    query: { terms: { retailer_id: retailerIds } }
  };

  try {
    const { data } = await axios.post(url, payload, {
      headers: {
        "Content-Type": "application/json",
        "embedded-static-token": import.meta.env.VITE_EMBEDDED_STATIC_TOKEN,
        "accept": "application/json, text/plain, */*"
      }
    });
    return data;
  } catch (error) {
    console.error("searchByRetailerIds error:", error);
    throw error;
  }
}



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

export const sendOtp = async (payload) => {
  const endpoint = "/user/signIn";

  try {
    const response = await postRequest(endpoint, payload);
    return response.data;
  } catch (error) {
    console.error("Error while sending OTP:", error);
    throw error;
  }
};

export const verifyOTP = async (payload) => {
  const endpoint = "/user_otps/verify-otp";

  try {
    const response = await postRequest(endpoint, payload);
    return response.data;
  } catch (error) {
    console.error("Error while verifying OTP:", error);
    throw error;
  }
};

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

export const searchProductsElastic = async (businessId, query) => {
  const endpoint = `/embedded/user/search-products-elastic?index=${businessId}&search=${query}`;

  try {
    const response = await getRequest(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error while searching products", error);
    throw error;
  }
};
