import React, { useEffect, useState } from 'react';
import { MdOutlineContactSupport } from "react-icons/md";
import { FaTimes, FaVolumeMute, FaVolumeUp, FaHeadset } from 'react-icons/fa'; // Icons for various buttons

const SidePanel = ({ onClose, onToggleAudio }) => {
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Vérifier la valeur dans le localStorage au chargement
    const audioMuted = localStorage.getItem('audioMuted') === 'true';
    setIsMuted(audioMuted);
  }, []);

  const handleMuteToggle = () => {
    const newMutedStatus = !isMuted;
    setIsMuted(newMutedStatus);
    localStorage.setItem('audioMuted', newMutedStatus);
    onToggleAudio(newMutedStatus);
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Side Panel with animation */}
      <div className="w-3/4 md:w-1/2 bg-white shadow-lg h-full p-6 relative transform transition-transform duration-500 ease-in-out translate-x-0">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          {/* Title */}
          <h2 className="text-xl font-semibold text-gray-900">Better Self AI</h2>
          
          {/* Close Button */}
          <button className="bg-white text-gray-600 hover:text-gray-800" onClick={onClose}>
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-4"></div>

        {/* Panel Content */}
        <div className="space-y-6 mt-4">
          {/* Mute/Unmute Audio Button */}
          <button 
            className="flex items-center w-full bg-white text-left text-gray-700 hover:bg-gray-100 px-4 py-2" 
            onClick={handleMuteToggle}
          >
            {isMuted ? <FaVolumeMute className="mr-2" /> : <FaVolumeUp className="mr-2" />}
            {isMuted ? 'Unmute Audio' : 'Mute Audio'}
          </button>
          
          {/* Contact Support Button */}
          <button 
            className="flex items-center w-full bg-white text-left text-gray-700 hover:bg-gray-100 px-4 py-2" 
            onClick={() => window.open("https://form.jotform.com/243101017721339", "_blank")}
          >
            <MdOutlineContactSupport className="mr-2" />
            Contact Support
          </button>
        </div>
      </div>

      {/* Overlay */}
      <div className="flex-1 bg-black bg-opacity-25" onClick={onClose}></div>
    </div>
  );
};

export default SidePanel;
