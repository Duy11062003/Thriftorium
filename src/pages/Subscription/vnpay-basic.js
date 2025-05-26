import React, { useState } from 'react';

const VNPayBasic = () => {
  const [selectedPlan, setSelectedPlan] = useState('basic');

  const handleCancel = () => {
    // Navigate back to create shop page
    window.history.back();
  };

  const handleSubscribe = () => {
    // Process VNPay payment
    window.location.href = '/vnpay-basicqr';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-container mx-auto px-4 py-8">
        {/* Header with Logo */}
        <div className="flex items-center mb-8">
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <span className="text-lg font-semibold text-gray-900">Thirtorium</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Shop Creation Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create your own shop</h2>
            <p className="text-gray-600 mb-8">
              Do more with the help of Thriftorium, shop that sell more sell on Thriftorium
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Billed To
                </label>
                <input
                  type="text"
                  placeholder="Enter account name..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Details
                </label>
              </div>

              {/* Payment Method Selection - VNPay selected */}
              <div className="grid grid-cols-3 gap-4">
                <button className="p-3 border border-gray-300 rounded-lg flex flex-col items-center opacity-50">
                  <div className="w-6 h-4 bg-blue-500 rounded mb-2"></div>
                  <span className="text-xs font-medium">Credit Card</span>
                </button>

                <button className="p-3 border border-gray-300 rounded-lg flex flex-col items-center opacity-50">
                  <div className="w-6 h-4 bg-gray-600 rounded mb-2"></div>
                  <span className="text-xs font-medium">Bank Transfer</span>
                </button>

                <button className="p-3 border-2 border-purple-500 bg-purple-50 rounded-lg flex flex-col items-center">
                  <div className="w-6 h-4 bg-purple-500 rounded mb-2 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">V</span>
                  </div>
                  <span className="text-xs font-medium text-purple-700">VNPay</span>
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4">
                <button 
                  onClick={handleCancel}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubscribe}
                  className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
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
              {/* Basic Plan - Selected */}
              <div 
                className="p-4 border-2 border-blue-500 bg-blue-50 rounded-lg cursor-pointer"
                onClick={() => setSelectedPlan('basic')}
              >
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full border-2 border-blue-500 bg-blue-500 mr-3 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Basic Plan</h4>
                    <p className="text-sm text-gray-600">Basic subscription plan for a shop</p>
                  </div>
                </div>
              </div>

              {/* Premium Plan */}
              <div 
                className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300"
                onClick={() => setSelectedPlan('premium')}
              >
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full border-2 border-gray-300 mr-3">
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

export default VNPayBasic;