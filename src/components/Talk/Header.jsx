import React, { useState, useRef, useEffect } from 'react';
import { FaBars, FaRegUserCircle } from 'react-icons/fa'; // Burger icon
import logo from '../../assets/Logo-Better-Self-AI.png';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import SidePanel from './SidePanel'; // Import SidePanel

const Header = ({ onToggleAudio }) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  return (
    <div className="relative flex items-center justify-between w-full p-4">
      {/* Burger Icon on the left */}
      <FaBars className="w-6 h-6 cursor-pointer" onClick={togglePanel} />

      {/* Centered Logo */}
      <img src={logo} alt="Better Self AI Logo" className="w-24 mx-auto" />

      {/* Login or User Button on the right */}
      <div className="flex items-center">
        <SignedOut>
          <SignInButton
          forceRedirectUrl="/redirect-after-login"
          fallbackRedirectUrl="/talk"
          signUpForceRedirectUrl="/redirect-after-login"
          signUpFallbackRedirectUrl="/talk"
          >
            <FaRegUserCircle className="w-8 h-8 cursor-pointer hover:text-blue-900 hover:scale-110 transition duration-200" />
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>

      {/* Side Panel */}
      {isPanelOpen && <SidePanel onClose={togglePanel} onToggleAudio={onToggleAudio} />}
    </div>
  );
};

export default Header;
