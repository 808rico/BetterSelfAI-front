// ./components/Talk/Header.jsx
import React, { useState, useRef, useEffect } from 'react';
import { FaBars, FaEllipsisH, FaRegUserCircle } from 'react-icons/fa'; // Assurez-vous d'avoir installé react-icons
import logo from '../../assets/Logo-Better-Self-AI.png';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { useUser } from '@clerk/clerk-react';

const Header = ({ onToggleAudio }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(localStorage.getItem('audioMuted') === 'true');
  const menuRef = useRef(null);
  const { isSignedIn } = useUser();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMuteToggle = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    localStorage.setItem('audioMuted', newMutedState);
    onToggleAudio(newMutedState);
    setIsMenuOpen(false);
  };

  return (
    <div className="relative flex items-center justify-between w-full p-4">
      {/* Three Dots Icon on the left */}
      <div className="relative">
        <FaEllipsisH className="w-6 h-6 cursor-pointer" onClick={() => setIsMenuOpen(!isMenuOpen)} />

        {isMenuOpen && (
          <div
            ref={menuRef}
            className="absolute left-0 mt-2 w-40 bg-white rounded-md shadow-lg py-2"
          >
            <button
              className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
              onClick={handleMuteToggle}
            >
              {isMuted ? 'Unmute Audio' : 'Mute Audio'}
            </button>
          </div>
        )}
      </div>

      {/* Centered Logo */}
      <img src={logo} alt="Better Self AI Logo" className="w-24 mx-auto" />

      {/* Login or User Button on the right */}
      <div className="flex items-center">
        <SignedOut>
          <SignInButton>
            <FaRegUserCircle className="w-8 h-8 cursor-pointer hover:text-blue-900 hover:scale-110 transition duration-200" />
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
};

export default Header;
