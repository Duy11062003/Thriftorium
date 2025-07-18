import axios from "axios";

const API_URL = "http://104.43.89.177/api/Subcription";

export const getSubscriptionByAccountId = async (accountId) => {
  try {
    const response = await axios.get(`${API_URL}/get-all-Subcription-by-id/${accountId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSubscriptionsByPlanId = async (planId) => {
  try {
    const response = await axios.get(`${API_URL}/get-subcription-by-plan/${planId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateSubscriptionStatus = async (id, status) => {
  try {
    const response = await axios.put(`${API_URL}/update-Subcription-status`, {
      Id: id,
      status: status
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createSubscription = async (accountId, planId) => {
  try {
    const response = await axios.post(`${API_URL}/createSubcription`, {
      accountId: accountId,
      planID: planId
    }, {
      params: {
        accountId,
        planID: planId
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data; // This will be the VNPay URL
  } catch (error) {
    throw error;
  }
};
