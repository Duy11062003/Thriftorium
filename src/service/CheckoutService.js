import axios from "axios";

const API_URL = "https://localhost:7208/api/Checkout";

const CheckoutService = {
  // Tạo đơn hàng PayOS
  createOrderPayOs: async (
    accountId,
    totals,
    userVoucherId = -1,
    shippingDetails
  ) => {
    try {
      const response = await axios.post(
        `${API_URL}/createOrderPayOs?accountId=${accountId}&totals=${totals}&userVoucherId=${userVoucherId}`,
        {
          detailAddress: shippingDetails.detailAddress,
          province: shippingDetails.province,
          provinceCode: shippingDetails.provinceCode,
          ward: shippingDetails.ward,
          district: shippingDetails.district,
          receiverName: shippingDetails.receiverName,
          phone: shippingDetails.phone,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Xử lý callback PayOS
  handlePayOsReturn: async (params) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await axios.get(
        `${API_URL}/payos-callback?${queryString}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // Helper function to validate shipping details
  validateShippingDetails: (shippingDetails) => {
    const required = [
      "detailAddress",
      "province",
      "provinceCode",
      "ward",
      "district",
      "receiverName",
      "phone",
    ];

    const missing = required.filter((field) => !shippingDetails[field]);
    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(", ")}`);
    }

    // Validate phone number format (Vietnam)
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(shippingDetails.phone)) {
      throw new Error("Invalid phone number format");
    }

    return true;
  },
};

export default CheckoutService;
