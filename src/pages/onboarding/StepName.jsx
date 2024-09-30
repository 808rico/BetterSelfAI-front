// ./pages/onboarding/StepName.jsx
import React from 'react';
import logo from '../../assets/Logo-Better-Self-AI.png'; // Assurez-vous que le chemin est correct

const StepName = ({ name, onChange, onNext }) => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full px-4">
      {/* Logo en haut à gauche */}
      <div className="absolute top-4 left-4">
        <img src={logo} alt="Better Self AI Logo" className="w-24" /> {/* w-24 correspond à 100px */}
      </div>

      {/* Contenu principal centré */}
      <div className="flex flex-col items-center justify-center">
        {/* Main Text */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          What's your name?
        </h2>

        {/* Input */}
        <input 
          type="text" 
          name="name"
          value={name} 
          onChange={(e) => onChange('name', e.target.value)}
          className="border border-gray-300 rounded-lg p-4 w-80 mb-4 text-center placeholder-gray-400 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your name here"
        />

        {/* Continue Button */}
        <button 
          className="bg-gray-900 text-white px-6 py-3 rounded-full text-lg hover:bg-gray-800 transition duration-200"
          onClick={onNext} // Appelle la fonction onNext pour passer à l'étape suivante
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default StepName;
