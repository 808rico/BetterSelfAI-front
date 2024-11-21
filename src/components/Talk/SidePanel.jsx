import React, { useEffect, useState } from 'react';
import { MdOutlineContactSupport } from "react-icons/md";
import { FaTimes, FaVolumeMute, FaVolumeUp, FaHeadset, FaGem } from 'react-icons/fa'; // Icons for various buttons
import { useUser, SignedIn, SignedOut, } from '@clerk/clerk-react'; // Import Clerk's useUser hook
import UpgradePopup from './UpgradePopup'; // Importing the new UpgradePopup component
import useFetch from '../../hooks/useFetch';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const SidePanel = ({ onClose, onToggleAudio }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [showUpgradePopup, setShowUpgradePopup] = useState(false); // State for showing the upgrade popup
  const [isLoading, setIsLoading] = useState(false); // Loading state for Billing Portal button
  const { isSignedIn } = useUser(); // Retrieve the authenticated user with Clerk
  const authenticatedFetch = useFetch(); // Appel de useFetch
  const isCustomer = localStorage.getItem('have_stripe_customer_id') === 'true';


  console.log(isCustomer)

  useEffect(() => {

    const audioMuted = localStorage.getItem('audioMuted') === 'true';
    setIsMuted(audioMuted);
  }, []);

  const handleMuteToggle = () => {
    const newMutedStatus = !isMuted;
    setIsMuted(newMutedStatus);
    localStorage.setItem('audioMuted', newMutedStatus);
    onToggleAudio(newMutedStatus);
  };

  const handleBillingPortal = async () => {
    if (!isSignedIn) {
      alert('You must be signed in to access the billing portal.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authenticatedFetch(`${BACKEND_URL}/api/billing/billing-portal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok && data.url) {
        window.location.href = data.url; // Redirect to Billing Portal
      } else {
        alert(data.error || 'Failed to fetch Billing Portal URL. Please try again later.');
      }
    } catch (err) {
      console.error('Error fetching Billing Portal:', err);
      alert('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="w-3/4 md:w-1/2 bg-white shadow-lg h-full p-6 relative transform transition-transform duration-500 ease-in-out translate-x-0">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Better Self AI</h2>
          <button className="bg-white text-gray-600 hover:text-gray-800" onClick={onClose}>
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        <div className="border-t border-gray-200 my-4"></div>

        <div className="space-y-6 mt-4">
          <button
            className="flex items-center w-full bg-white text-left text-gray-700 hover:bg-gray-100 px-4 py-2"
            onClick={handleMuteToggle}
          >
            {isMuted ? <FaVolumeMute className="mr-2" /> : <FaVolumeUp className="mr-2" />}
            {isMuted ? 'Unmute Audio' : 'Mute Audio'}
          </button>

          <button
            className="flex items-center w-full bg-white text-left text-gray-700 hover:bg-gray-100 px-4 py-2"
            onClick={() => window.open("https://form.jotform.com/243101017721339", "_blank")}
          >
            <MdOutlineContactSupport className="mr-2" />
            Contact Support
          </button>

          <SignedIn>



            <button
              className={`flex items-center w-full text-white bg-gradient-to-r from-blue-400 to-blue-600 shadow-lg hover:shadow-xl hover:from-blue-400 hover:to-blue-600 px-4 py-3 rounded-lg`}
              onClick={() => setShowUpgradePopup(true)}
            >
              <FaGem className="mr-2" />
              Upgrade to Pro
            </button>

            {isCustomer && (
              <button
                className={`flex items-center w-full bg-white text-left text-gray-700 hover:bg-gray-100 px-4 py-2 ${isLoading && 'opacity-50'}`}
                onClick={handleBillingPortal}
                disabled={isLoading}
              >
                {isLoading ? <span>Loading...</span> : <>
                  <FaHeadset className="mr-2" />
                  Billing Portal
                </>}
              </button>
            )}
          </SignedIn>
        </div>
      </div>

      <div className="flex-1 bg-black bg-opacity-25" onClick={onClose}></div>
      {showUpgradePopup && <UpgradePopup onClose={() => setShowUpgradePopup(false)} />}
    </div>
  );
};

export default SidePanel;
