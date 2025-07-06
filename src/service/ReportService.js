import axios from "axios";

const API_URL = "https://localhost:7208/api/Report";

const ReportService = {
  getAllReports: async () => {
    try {
      const response = await axios.get(`${API_URL}/get-all-reports`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  searchReports: async (search, pageIndex, pageSize) => {
    try {
      const response = await axios.get(`${API_URL}/search`, {
        params: {
          search,
          pageIndex,
          pageSize,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  getReportById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/get-report-by-id/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  createReport: async (formData) => {
    try {
      const response = await axios.post(`${API_URL}/create-report`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  deleteReport: async (id) => {
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

  updateReport: async (id, reportData) => {
    try {
      const formData = new FormData();
      formData.append("ReportText", reportData.ReportText);
      formData.append("ResponseText", reportData.ResponseText || "");
      formData.append(
        "UpdateAt",
        reportData.UpdateAt || new Date().toISOString()
      );

      if (reportData.ImageFile) {
        formData.append("ImageFile", reportData.ImageFile);
      }

      const response = await axios.put(
        `${API_URL}/update-report?id=${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
};

export default ReportService;
