import axios from "axios";

const API_URL = "https://104.43.89.177/api/category";

export const getAllSubscriptionPlans = async () => {
  try {
    const response = await axios.get(`${API_URL}/GetAllSubcriptionPlan`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getSubscriptionPlanById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/GetSubcriptionPlan/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const createSubscriptionPlan = async (planData) => {
  try {
    const response = await axios.post(`${API_URL}/CreateSubcriptionPlan`, {
      planName: planData.planName,
      price: planData.price,
      description: planData.description,
      duration: planData.duration
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

export const updateSubscriptionPlan = async (planData) => {
  try {
    const response = await axios.put(`${API_URL}/UpdateSubscriptionPlan?id=${planData.planID}`, {
      planName: planData.planName,
      price: planData.price,
      description: planData.description,
      duration: planData.duration
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
