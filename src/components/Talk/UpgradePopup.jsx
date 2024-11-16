import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { FaTimes } from 'react-icons/fa';


const stripePromise = loadStripe('pk_test_51PMEaoIOSPC7ROIBJB08UPVLJRIpJ7YGfO5ob5quBxjPI3GqSc6mH4TQsS4tssCCUFrsI3ketpb39YiklfD8AMJp00p9JGHJ3i');
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const UpgradePopup = ({ onClose }) => {
  const [selectedPlan, setSelectedPlan] = useState('yearly');

  const handleCheckout = async () => {
    const stripe = await stripePromise;

    try {
      const response = await fetch(`${BACKEND_URL}/api/billing/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan: selectedPlan }),
      });

      const { sessionId } = await response.json();
      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('Failed to start checkout. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-11/12 md:w-1/3 p-6 rounded-lg shadow-lg relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-600 hover:text-gray-800">
          <FaTimes className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 pr-11">Get the most out of your AI Therapist!</h2>
        <ul className="text-gray-700 mb-6 space-y-2">
          <li>✔ Unlimited text messages</li>
          <li>✔ Unlimited audio messages</li>
          <li>✔ Customize your therapist</li>
        </ul>
        <div className="space-y-4">
          <div
            onClick={() => setSelectedPlan('yearly')}
            className={`relative p-4 border rounded-lg hover:border-blue-500 cursor-pointer ${
              selectedPlan === 'yearly' ? 'border-blue-500 bg-blue-50' : ''
            }`}
          >
            <div className="absolute top-[-10px] right-[-8px] bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded">
              Save 30%
            </div>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Yearly Plan</h3>
                <p className="text-gray-500">12 months - $99.99</p>
              </div>
              <p className="text-lg font-semibold">$8.33 / mo</p>
            </div>
          </div>
          <div
            onClick={() => setSelectedPlan('monthly')}
            className={`flex justify-between items-center p-4 border rounded-lg hover:border-blue-500 cursor-pointer ${
              selectedPlan === 'monthly' ? 'border-blue-500 bg-blue-50' : ''
            }`}
          >
            <div>
              <h3 className="text-lg font-medium">Monthly Plan</h3>
              <p className="text-gray-500">1 month - $11.99</p>
            </div>
            <p className="text-lg font-semibold">$11.99 / mo</p>
          </div>
        </div>
        <button
          className="w-full mt-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
          onClick={handleCheckout}
        >
          Continue
        </button>
        <p className="text-center text-gray-500 text-sm mt-2">Cancel anytime.</p>
      </div>
    </div>
  );
};

export default UpgradePopup;
