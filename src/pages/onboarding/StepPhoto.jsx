// ./pages/onboarding/StepPhoto.jsx
import React, { useEffect, useState } from 'react';
import logo from '../../assets/Logo-Better-Self-AI.png';
import { therapistPhotos } from '../../config/therapistPhotos'; // Import your photo configuration
import { FaCheckCircle } from 'react-icons/fa';

const StepPhoto = ({ name, selectedPhoto, onChange, onNext }) => {
  const [shuffledPhotos, setShuffledPhotos] = useState([]);

  // Function to shuffle the photos
  const shuffleArray = (array) => {
    return array
      .map((item) => ({ ...item, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map((item) => ({ id: item.id, file: item.file, name: item.name })); // Keep only the original properties
  };

  useEffect(() => {
    // Shuffle photos when the component mounts
    setShuffledPhotos(shuffleArray(therapistPhotos));
  }, []);

  const handlePhotoSelect = (photoId) => {
    onChange('photo', photoId);
  };

  return (
    <div className="relative flex flex-col items-center justify-between min-h-screen w-full px-4">
      {/* Logo et texte en haut */}
      <div className="flex flex-col items-center w-full">
        <div className="absolute top-4 left-4">
          <img src={logo} alt="Better Self AI Logo" className="w-24" />
        </div>
        <h2 className="mt-28 text-2xl md:text-3xl font-bold text-gray-900 mb-4 text-center"> 
          Hey {name}, select which therapist you prefer.
        </h2>
      </div>

      {/* Container scrollable pour les photos */}
      <div className="flex-1 overflow-y-auto w-full max-w-xl max-h-[60vh] my-4 px-4">
        <div className="grid grid-cols-2 gap-4 justify-items-center"> 
          {shuffledPhotos.map((photo) => (
            <div 
              key={photo.id} 
              className="relative cursor-pointer w-40 h-40"
              onClick={() => handlePhotoSelect(photo.id)}
            >
              <img 
                src={photo.file} 
                alt={`Therapist ${photo.name}`} 
                className={`w-full h-full rounded-lg object-cover border-2 ${selectedPhoto === photo.id ? 'border-blue-500' : 'border-transparent'}`}
              />
              {selectedPhoto === photo.id && (
                <FaCheckCircle 
                  className="absolute top-1 right-1 text-green-500 text-2xl" 
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Continue Button */}
      <div className="w-full flex justify-center p-4">
        <button 
          className={`bg-gray-900 text-white px-6 py-3 rounded-full text-lg hover:bg-gray-800 transition duration-200 ${!selectedPhoto ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={onNext}
          disabled={!selectedPhoto} // Disable the button if no photo is selected
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default StepPhoto;
