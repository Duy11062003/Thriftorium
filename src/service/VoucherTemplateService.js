import axios from "axios";

const API_URL = "https://ticketo.store/api/VoucherTemplate";

const VoucherTemplateService = {
  getAllVoucherTemplates: async () => {
    try {
      const response = await axios.get(`${API_URL}/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  getVoucherTemplateById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  createVoucherTemplate: async (templateData) => {
    try {
      const response = await axios.post(`${API_URL}`, {
        name: templateData.name,
        milestoneAmount: templateData.milestoneAmount,
        voucherTypes: templateData.voucherTypes,
        description: templateData.description,
        isMembership: templateData.isMembership,
        discountPercentage: templateData.discountPercentage,
        startedAt: templateData.startedAt,
        expiredAt: templateData.expiredAt,
        status: templateData.status
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
  },

  updateVoucherTemplate: async (templateData) => {
    try {
      const response = await axios.put(`${API_URL}`, {
        name: templateData.name,
        milestoneAmount: templateData.milestoneAmount,
        voucherTypes: templateData.voucherTypes,
        description: templateData.description,
        isMembership: templateData.isMembership,
        discountPercentage: templateData.discountPercentage,
        startedAt: templateData.startedAt,
        expiredAt: templateData.expiredAt,
        status: templateData.status
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
  },

  deleteVoucherTemplate: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
};

export default VoucherTemplateService;
