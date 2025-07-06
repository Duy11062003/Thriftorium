import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { createSubscription, getSubscriptionByAccountId } from '../../service/SubscriptionService';
import { getAllSubscriptionPlans } from '../../service/SubscriptionPlanService';
import { useAuth } from '../../context/AuthContext';

const Subscription = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('vnpay');
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    accountName: '',
    paymentDetails: '',
    billingPeriod: '',
    cardNumber: '',
    birthday: '',
    country: '',
    city: '',
    socialSecurity: ''
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
          setCurrentSubscription(userSub);
        }
      } catch (error) {
        message.error('Failed to fetch subscription data');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubscribe = async () => {
    if (!selectedPlan) {
      message.error('Please select a subscription plan');
      return;
    }

    if (!user) {
      message.error('Please login to subscribe');
      navigate('/signin');
      return;
    }

    try {
      setLoading(true);
      const vnpayUrl = await createSubscription(user.userID, selectedPlan.planID);
      // Redirect to VNPay payment page
      window.location.href = vnpayUrl;
    } catch (error) {
      message.error('Failed to create subscription');
      console.error('Error:', error);
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
          <span className="text-lg font-semibold text-gray-900">Thirtorium</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create your own shop</h2>
            <p className="text-gray-600 mb-8">
              Do more with the help of Thriftorium, shop that sell more sell on Thriftorium
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shop ID
                </label>
                <input
                  type="text"
                  name="accountName"
                  placeholder="Enter account name"
                  value={formData.accountName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Payment Method - Only VNPay */}
              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={() => setPaymentMethod('vnpay')}
                  className="p-3 border-2 border-purple-500 bg-purple-50 rounded-lg flex flex-col items-center"
                >
                  <div className="w-6 h-4 bg-purple-500 rounded mb-2 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">V</span>
                  </div>
                  <span className="text-xs font-medium text-purple-700">VNPay</span>
                </button>
              </div>

              <div className="flex space-x-4 pt-4">
                <button 
                  onClick={() => navigate('/')}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubscribe}
                  disabled={loading || !selectedPlan}
                  className={`flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium
                    ${loading || !selectedPlan ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                >
                  {loading ? 'Processing...' : 'Subscribe'}
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-4">
                By subscribing, you agree to our terms and conditions.
              </p>
            </div>
          </div>

          {/* Right Side - Subscription Plans */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Choose your subscription plan</h3>
            
            <div className="space-y-4">
              {subscriptionPlans.map((plan) => (
                <div 
                  key={plan.planID}
                  className={`p-4 border rounded-lg cursor-pointer ${
                    selectedPlan?.planID === plan.planID 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedPlan(plan)}
                >
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                      selectedPlan?.planID === plan.planID 
                        ? 'border-blue-500 bg-blue-500' 
                        : 'border-gray-300'
                    }`}>
                      {selectedPlan?.planID === plan.planID && (
                        <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{plan.planName}</h4>
                      <p className="text-sm text-gray-600">{plan.description}</p>
                      <p className="text-sm font-semibold text-blue-600 mt-1">{plan.price}đ / {plan.duration} days</p>
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
                  {selectedPlan ? `${selectedPlan.price}đ` : '0đ'}
                </span>
              </div>
              
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start">
                  <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
                  <span>Guaranteed to be safe & secure with VNPay payment gateway</span>
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
                  <span>Provide quality support in order & shipping management</span>
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