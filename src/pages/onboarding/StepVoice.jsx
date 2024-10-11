import React, { useRef, useState } from 'react';
import logo from '../../assets/Logo-Better-Self-AI.png';
import { therapistVoices } from '../../config/therapistVoices'; // Import your voice configuration
import { FaCheckCircle, FaVolumeUp, FaSpinner } from 'react-icons/fa';
import {ImSpinner8} from "react-icons/im";

const StepVoice = ({ name, selectedVoice, onChange, onNext }) => {
  const audioRefs = useRef({});
  const [isLoading, setIsLoading] = useState(false); // Nouvel état pour le chargement

  const stopAllAudio = () => {
    Object.keys(audioRefs.current).forEach((key) => {
      if (audioRefs.current[key]) {
        audioRefs.current[key].pause();
        audioRefs.current[key].currentTime = 0; // Remettre à zéro
      }
    });
  };
  

  const handleVoiceSelect = (voiceId) => {
    // Stop all other audio files
    Object.keys(audioRefs.current).forEach((key) => {
      if (audioRefs.current[key] && key !== voiceId) {
        audioRefs.current[key].pause();
        audioRefs.current[key].currentTime = 0; // Reset audio to its beginning
      }
    });

    // Update the selected voice
    onChange('voice', voiceId);

    // Play the selected voice audio
    if (audioRefs.current[voiceId]) {
      audioRefs.current[voiceId].play();
    }
  };

  const handleNextStep = async () => {
    stopAllAudio();
    setIsLoading(true); // Active l'état de chargement
    await onNext(); // Appel de la fonction onNext (incluant l'API)
    setIsLoading(false); // Désactive l'état de chargement
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full px-4">
      {/* Logo en haut à gauche */}
      <div className="absolute top-4 left-4">
        <img src={logo} alt="Better Self AI Logo" className="w-24" />
      </div>

      {/* Main Text */}
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 text-center">
        Good choice {name}, how do you want me to sound?
      </h2>

      {/* Liste des voix */}
      <div className="flex flex-col gap-2 w-full max-w-md">
        {therapistVoices.map((voice) => (
          <div
            key={voice.id}
            className={`flex items-center justify-between bg-gray-100 p-4 rounded-lg cursor-pointer border-2 ${
              selectedVoice === voice.id ? 'border-blue-500' : 'border-transparent'
            }`}
            onClick={() => handleVoiceSelect(voice.id)}
          >
            <span className="text-lg">{voice.name}</span> {/* Display the voice name from the config */}
            <div className="flex items-center space-x-2">
              {/* Icône de haut-parleur */}
              <FaVolumeUp
                className="text-gray-600 text-2xl cursor-pointer hover:text-gray-800"
                onClick={(e) => {
                  e.stopPropagation();
                  if (audioRefs.current[voice.id]) {
                    audioRefs.current[voice.id].play();
                  }
                }}
              />
              {/* Icône de validation si sélectionné */}
              {selectedVoice === voice.id && (
                <FaCheckCircle className="text-green-500 text-2xl" />
              )}
              {/* Élément audio caché */}
              <audio ref={(el) => (audioRefs.current[voice.id] = el)} src={voice.voicePreview} />
            </div>
          </div>
        ))}
      </div>

      {/* Continue Button */}
      <button 
        className={`bg-gray-900 text-white px-6 py-3 rounded-full text-lg hover:bg-gray-800 transition duration-200 mt-6 flex items-center justify-center ${
          (!selectedVoice || isLoading) ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={handleNextStep}
        disabled={!selectedVoice || isLoading} // Disable button if no voice is selected or if loading
      >
        {isLoading ? <ImSpinner8 className="animate-spin mr-2" /> : 'Continue'}
      </button>
    </div>
  );
};

export default StepVoice;
