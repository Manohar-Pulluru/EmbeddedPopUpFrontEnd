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
