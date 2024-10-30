// ./components/Talk/Header.jsx
import React, { useState, useRef, useEffect } from 'react';
import { FaBars, FaEllipsisH } from 'react-icons/fa'; // Assurez-vous d'avoir installé react-icons
import logo from '../../assets/Logo-Better-Self-AI.png';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { useUser } from '@clerk/clerk-react'


const Header = ({ onToggleAudio }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(localStorage.getItem('audioMuted') === 'true'); // Check localStorage
  const menuRef = useRef(null);
  const { isSignedIn, user, isLoaded } = useUser()
  

  

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
    onToggleAudio(newMutedState); // Pass the muted state to the parent component
    setIsMenuOpen(false); // Close the menu
  };

  // Fonction pour effectuer l'appel API au backend
  const handleUserSignIn = async () => {
    try {
      const token = await getToken();
      if (token) {
        // Appel API vers le backend avec le token d'authentification
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/login`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: 'User has signed in' })
        });

        if (!response.ok) {
          throw new Error('Failed to send login notification');
        }

        console.log('User login notification sent successfully');
      }
    } catch (error) {
      console.error('Error sending login notification:', error);
    }
  };

  return (
    <div className="relative flex items-center justify-between w-full p-4">
      {/* Menu Icon on the left 
      <FaBars className="w-6 h-6 cursor-pointer" />*/}

      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>

      {/* Centered Logo */}
      <img src={logo} alt="Better Self AI Logo" className="w-24 mx-auto" />

      {/* Three Dots Icon on the right */}
      <div className="relative">
        <FaEllipsisH className="w-6 h-6 cursor-pointer" onClick={() => setIsMenuOpen(!isMenuOpen)} />

        {isMenuOpen && (
          <div
            ref={menuRef}
            className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-2"
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
    </div>
  );
};

export default Header;
