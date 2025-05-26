import React, { useState } from 'react';

const CreateShop = () => {
  const [selectedPlan, setSelectedPlan] = useState('basic');
  const [paymentMethod, setPaymentMethod] = useState('credit');
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

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

   const handleSubscribe = () => {
    if (paymentMethod === 'vnpay') {
      // Navigate to appropriate VNPay page based on selected plan
      if (selectedPlan === 'premium') {
        window.location.href = '/vnpay-premium';
      } else {
        window.location.href = '/vnpay-basic';
      }
    } else {
      console.log('Subscription data:', { selectedPlan, paymentMethod, formData });
      alert('Subscription process initiated!');
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Details
                </label>
                <input
                  type="text"
                  name="paymentDetails"
                  value={formData.paymentDetails}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Payment Method Selection */}
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => setPaymentMethod('credit')}
                  className={`p-3 border rounded-lg flex flex-col items-center ${
                    paymentMethod === 'credit' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300'
                  }`}
                >
                  <div className="w-6 h-4 bg-blue-500 rounded mb-2"></div>
                  <span className="text-xs font-medium">Credit Card</span>
                </button>

                <button
                  onClick={() => setPaymentMethod('bank')}
                  className={`p-3 border rounded-lg flex flex-col items-center ${
                    paymentMethod === 'bank' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300'
                  }`}
                >
                  <div className="w-6 h-4 bg-gray-600 rounded mb-2"></div>
                  <span className="text-xs font-medium">Bank Transfer</span>
                </button>

                <button
                  onClick={() => setPaymentMethod('vnpay')}
                  className={`p-3 border rounded-lg flex flex-col items-center ${
                    paymentMethod === 'vnpay' 
                      ? 'border-2 border-purple-500 bg-purple-50' 
                      : 'border-gray-300'
                  }`}
                >
                  <div className={`w-6 h-4 rounded mb-2 flex items-center justify-center ${
                    paymentMethod === 'vnpay' ? 'bg-purple-500' : 'bg-red-500'
                  }`}>
                    <span className="text-white text-xs font-bold">V</span>
                  </div>
                  <span className={`text-xs font-medium ${
                    paymentMethod === 'vnpay' ? 'text-purple-700' : 'text-gray-700'
                  }`}>VNPay</span>
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Billing period
                </label>
                <select
                  name="billingPeriod"
                  value={formData.billingPeriod}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select billing period</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter card number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <div className="absolute right-3 top-2.5">
                    <div className="w-8 h-5 bg-red-500 rounded"></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Birthday
                  </label>
                  <input
                    type="date"
                    name="birthday"
                    value={formData.birthday}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select country</option>
                    <option value="vietnam">Vietnam</option>
                    <option value="usa">USA</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select city</option>
                  <option value="hanoi">Hanoi</option>
                  <option value="hcmc">Ho Chi Minh City</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Social security number
                </label>
                <input
                  type="text"
                  name="socialSecurity"
                  value={formData.socialSecurity}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button 
                  onClick={handleSubscribe}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Subscribe
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-4">
                By providing your card information, you allow us to charge your card for future payment in 
                accordance with their terms.
              </p>
            </div>
          </div>

          {/* Right Side - Subscription Plans */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Choose your subscription plan</h3>
            
            <div className="space-y-4">
              {/* Basic Plan */}
              <div 
                className={`p-4 border rounded-lg cursor-pointer ${
                  selectedPlan === 'basic' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200'
                }`}
                onClick={() => setSelectedPlan('basic')}
              >
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                    selectedPlan === 'basic' 
                      ? 'border-blue-500 bg-blue-500' 
                      : 'border-gray-300'
                  }`}>
                    {selectedPlan === 'basic' && (
                      <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Basic Plan</h4>
                    <p className="text-sm text-gray-600">Basic subscription plan for a shop</p>
                  </div>
                </div>
              </div>

              {/* Premium Plan */}
              <div 
                className={`p-4 border rounded-lg cursor-pointer ${
                  selectedPlan === 'premium' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200'
                }`}
                onClick={() => setSelectedPlan('premium')}
              >
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                    selectedPlan === 'premium' 
                      ? 'border-blue-500 bg-blue-500' 
                      : 'border-gray-300'
                  }`}>
                    {selectedPlan === 'premium' && (
                      <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Premium subscription</h4>
                    <p className="text-sm text-gray-600">Premium plan with more exclusive features</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-bold text-gray-900">Total</span>
                <span className="text-xl font-bold text-gray-900">$XX / Month</span>
              </div>
              
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start">
                  <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
                  <span>Guaranteed to be safe & secure, ensuring that all transactions are protected with the highest level of security.</span>
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

export default CreateShop;