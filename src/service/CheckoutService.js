import axios from "axios";

const API_URL = "http://104.43.89.177/api/Checkout";

const CheckoutService = {
  createOrder: async (accountId, totals, userVoucherId = -1, shippingDetails) => {
    try {
      const response = await axios.post(
        `${API_URL}/createOrder?accountId=${accountId}&totals=${totals}&userVoucherId=${userVoucherId}`,
        {
          detailAddress: shippingDetails.detailAddress,
          province: shippingDetails.province,
          provinceCode: shippingDetails.provinceCode,
          ward: shippingDetails.ward,
          district: shippingDetails.district,
          receiverName: shippingDetails.receiverName,
          phone: shippingDetails.phone
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  handleVNPayReturn: async (params) => {
    try {
      const queryString = new URLSearchParams({
        Vnp_Amount: params.Vnp_Amount,
        Vnp_BankCode: params.Vnp_BankCode,
        Vnp_BankTranNo: params.Vnp_BankTranNo,
        Vnp_CardType: params.Vnp_CardType,
        Vnp_OrderInfo: params.Vnp_OrderInfo,
        Vnp_PayDate: params.Vnp_PayDate,
        Vnp_ResponseCode: params.Vnp_ResponseCode,
        Vnp_TmnCode: params.Vnp_TmnCode,
        Vnp_TransactionNo: params.Vnp_TransactionNo,
        Vnp_TransactionStatus: params.Vnp_TransactionStatus,
        Vnp_TxnRef: params.Vnp_TxnRef,
        Vnp_SecureHash: params.Vnp_SecureHash
      }).toString();

      const response = await axios.get(`${API_URL}/vnpay-return?${queryString}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // Helper function to validate shipping details
  validateShippingDetails: (shippingDetails) => {
    const required = [
      'detailAddress',
      'province',
      'provinceCode',
      'ward',
      'district',
      'receiverName',
      'phone'
    ];

    const missing = required.filter(field => !shippingDetails[field]);
    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }

    // Validate phone number format (Vietnam)
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(shippingDetails.phone)) {
      throw new Error('Invalid phone number format');
    }

    return true;
  },

  // Helper function to format VNPay parameters
  formatVNPayParams: (params) => {
    return {
      Vnp_Amount: parseInt(params.Vnp_Amount),
      Vnp_BankCode: params.Vnp_BankCode,
      Vnp_BankTranNo: params.Vnp_BankTranNo,
      Vnp_CardType: params.Vnp_CardType,
      Vnp_OrderInfo: params.Vnp_OrderInfo,
      Vnp_PayDate: params.Vnp_PayDate,
      Vnp_ResponseCode: params.Vnp_ResponseCode,
      Vnp_TmnCode: params.Vnp_TmnCode,
      Vnp_TransactionNo: params.Vnp_TransactionNo,
      Vnp_TransactionStatus: params.Vnp_TransactionStatus,
      Vnp_TxnRef: params.Vnp_TxnRef,
      Vnp_SecureHash: params.Vnp_SecureHash
    };
  }
};

export default CheckoutService;
