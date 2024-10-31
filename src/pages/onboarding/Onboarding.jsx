// ./pages/onboarding/Onboarding.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import StepName from './StepName';
import StepPhoto from './StepPhoto';
import StepVoice from './StepVoice';

// Get the backend URL from the environment variable
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [userInfo, setUserInfo] = useState({ name: '', photo: '', voice: '' });

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Générer le hash de l'utilisateur une fois l'onboarding terminé
      const userHash = uuidv4();
      localStorage.setItem('userHash', userHash);
  
      // Envoi des données utilisateur et création de conversation en une seule requête
      try {
        const response = await fetch(`${BACKEND_URL}/api/new-user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userHash,
            name: userInfo.name,
            photo: userInfo.photo,
            voice: userInfo.voice,
          }),
        });
  
        if (response.ok) {
          const data = await response.json();
          const { conversationHash, welcomeMessage, audio } = data;
  
          // Sauvegarder les informations de la conversation
          localStorage.setItem('selectedPhotoId', userInfo.photo);
          localStorage.setItem('selectedVoiceId', userInfo.voice);
          localStorage.setItem('welcomeMessage', welcomeMessage);
          localStorage.setItem('welcomeAudio', audio);
  
          console.log('User and conversation data saved successfully');
  
          // Naviguer vers la page /talk
          navigate('/talk');
        } else {
          console.error('Failed to create user and conversation');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };
  

  const handleChange = (field, value) => {
    setUserInfo({ ...userInfo, [field]: value });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {step === 1 && <StepName name={userInfo.name} onChange={handleChange} onNext={handleNext} />}
      {step === 2 && (
        <StepPhoto
          name={userInfo.name}
          selectedPhoto={userInfo.photo}
          onChange={handleChange}
          onNext={handleNext}
        />
      )}
      {step === 3 && (
        <StepVoice
          name={userInfo.name}
          selectedVoice={userInfo.voice}
          onChange={handleChange}
          onNext={handleNext}
        />
      )}
    </div>
  );
};

export default Onboarding;
