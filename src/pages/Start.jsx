// ./pages/Start.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/Logo-Better-Self-AI.png';
import { useUser } from "@clerk/clerk-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Start = () => {
  const navigate = useNavigate();
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    const checkUser = async () => {
      if (isSignedIn && user) {
        try {
          const response = await fetch(`${BACKEND_URL}/api/users/check-user/${user.id}`);
          const data = await response.json();

          if (data.exists) {
            localStorage.setItem("userId", user.id);
            localStorage.setItem("selectedName", data.name || "");
            localStorage.setItem("selectedPhotoId", data.photo || "");
            localStorage.setItem("selectedVoiceId", data.voice || "");
            navigate("/talk");
          }
        } catch (error) {
          console.error("Error checking user:", error);
        }
      }
    };

    checkUser();
  }, [isSignedIn, user, navigate]);

  useEffect(() => {
    localStorage.clear();
  }, []);

  const handleStart = () => {
    navigate('/onboarding');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4 w-full">
      {/* Logo en haut à gauche */}
      <div className="absolute top-4 left-4">
        <img src={logo} alt="Better Self AI Logo" className="w-24" />
      </div>

      {/* UserButton en haut à droite */}
      <div className="absolute top-10 right-10 ">
        <SignedIn>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-10 h-10", // Taille agrandie
              }
            }}
          />
        </SignedIn>
      </div>

      {/* Container centré */}
      <div className="w-full max-w-screen-md mx-auto flex flex-col items-center text-center">
        {/* Main Text */}
        <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
          AI Companion who truly understands and cares.
        </h1>

        {/* Subtext */}
        <p className="text-gray-600 mb-10">
          100% private: we will never share or sell your data.
        </p>

        {/* Button */}
        <button
          className="bg-gray-900 text-white px-6 py-3 rounded-full text-lg hover:bg-gray-800 transition duration-200"
          onClick={handleStart}
        >
          Start Talking
        </button>

        <SignedOut>
          <SignInButton
          forceRedirectUrl="/redirect-after-login"
          fallbackRedirectUrl="/"
          signUpForceRedirectUrl="/redirect-after-login"
          signUpFallbackRedirectUrl="/"
>
            <span className="text-black no-underline cursor-pointer hover:underline mt-4">Sign In →</span>
          </SignInButton>
        </SignedOut>

      </div>
    </div>
  );
};

export default Start;
