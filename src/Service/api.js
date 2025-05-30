// templateService.js
import { getRequest, postRequest } from "./httpService";

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
