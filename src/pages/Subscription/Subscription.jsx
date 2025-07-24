import React, { useState, useEffect } from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { createSubscriptionPayOs } from "../../service/SubscriptionService";
import { getAllSubscriptionPlans } from "../../service/SubscriptionPlanService";
import { useAuth } from "../../context/AuthContext";
import { getSubscriptionByAccountId } from "../../service/SubscriptionService";

const Subscription = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("payos");
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    paymentDetails: "",
    billingPeriod: "",
    cardNumber: "",
    birthday: "",
    country: "",
    city: "",
    socialSecurity: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch all subscription plans
        const plans = await getAllSubscriptionPlans();
        setSubscriptionPlans(plans);

        // Fetch current user's subscription if they have one
        if (user?.userID) {
          const userSub = await getSubscriptionByAccountId(user.userID);
          if (userSub) {
            console.log(userSub);
            setSelectedPlan(userSub);
            setCurrentSubscription(userSub);
          }
        }
      } catch (error) {
        message.error("Failed to fetch subscription data");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubscribe = async () => {
    if (!selectedPlan) {
      message.error("Please select a subscription plan");
      return;
    }

    if (!user) {
      message.error("Please login to subscribe");
      navigate("/signin");
      return;
    }

    try {
      setLoading(true);
      const payosUrl = await createSubscriptionPayOs(
        user.userID,
        selectedPlan.planID
      );
      // Redirect to PayOS payment page
      window.location.href = payosUrl;
    } catch (error) {
      message.error("Failed to create subscription");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <span className="text-lg font-semibold text-gray-900">
            Thirtorium
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Register subscription
            </h2>
            <p className="text-gray-600 mb-8">
              Register subscription to use Thriftorium
            </p>

            <div className="space-y-6">
              {/* Payment Method - Chỉ PayOS */}
              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={() => setPaymentMethod("payos")}
                  className="p-3 border-2 border-green-500 bg-green-50 rounded-lg flex flex-col items-center"
                >
                  <div className="w-6 h-4 bg-green-500 rounded mb-2 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">P</span>
                  </div>
                  <span className="text-xs font-medium text-green-700">
                    PayOS
                  </span>
                </button>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  onClick={() => navigate("/")}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubscribe}
                  disabled={
                    loading ||
                    !selectedPlan ||
                    selectedPlan.planID === currentSubscription?.planID
                  }
                  className={`flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium
                    ${
                      loading ||
                      !selectedPlan ||
                      selectedPlan.planID === currentSubscription?.planID
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-blue-700"
                    }`}
                >
                  {loading ? "Processing..." : "Subscribe"}
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-4">
                By subscribing, you agree to our terms and conditions.
              </p>
            </div>
          </div>

          {/* Right Side - Subscription Plans */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Choose your subscription plan
            </h3>

            <div className="space-y-4">
              {subscriptionPlans.map((plan) => (
                <div
                  key={plan.planID}
                  className={`p-4 border rounded-lg cursor-pointer ${
                    selectedPlan?.planID?.toString() === plan.planID?.toString()
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}
                  onClick={() => setSelectedPlan(plan)}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-4 h-4 rounded-full border-2 mr-3 ${
                        selectedPlan?.planID?.toString() ===
                        plan.planID?.toString()
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedPlan?.planID?.toString() ===
                        plan.planID?.toString() && (
                        <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {plan.planName}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {plan.description}
                      </p>
                      <p className="text-sm font-semibold text-blue-600 mt-1">
                        {plan.price}đ / {plan.duration} days
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-bold text-gray-900">Total</span>
                <span className="text-xl font-bold text-gray-900">
                  {selectedPlan?.price ? `${selectedPlan.price}đ` : "0đ"}
                </span>
              </div>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start">
                  <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
                  <span>
                    Guaranteed to be safe & secure with PayOS payment gateway
                  </span>
                </div>

                <div className="flex items-start">
                  <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  </div>
                  <span>Personalise your shop with your own info</span>
                </div>

                <div className="flex items-start">
                  <div className="w-4 h-4 rounded-full bg-orange-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  </div>
                  <span>
                    Provide quality support in order & shipping management
                  </span>
                </div>

                <div className="flex items-start">
                  <div className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  </div>
                  <span>This plan has trial period for 7 days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Subscription;
