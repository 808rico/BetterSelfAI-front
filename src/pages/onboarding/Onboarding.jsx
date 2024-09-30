// ./pages/onboarding/Onboarding.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import StepName from './StepName';
import StepPhoto from './StepPhoto';
import StepVoice from './StepVoice';

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

      // Envoi des données utilisateur à votre back-end
      try {
        const userResponse = await fetch('http://localhost:5001/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: userInfo.name,
            photo: userInfo.photo,
            voice: userInfo.voice,
            userHash,
          }),
        });

        if (userResponse.ok) {
          console.log('User data saved successfully');
          
          // Maintenant, créez une nouvelle conversation avec l'utilisateur
          const conversationResponse = await fetch('http://localhost:5001/api/conversations/new-conversation', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userHash }),
          });

          if (conversationResponse.ok) {
            const conversationData = await conversationResponse.json();
            const { conversationHash } = conversationData;

            // Stocker le conversationHash dans le localStorage
            localStorage.setItem('conversationHash', conversationHash);

            // Stocker l'ID de la photo sélectionnée dans le localStorage
            localStorage.setItem('selectedPhotoId', userInfo.photo);

            // Stocker l'ID de la voix sélectionnée dans le localStorage
            localStorage.setItem('selectedVoiceId', userInfo.voice);

            console.log('Conversation created successfully');
            
            // Naviguer vers la page /talk
            navigate('/talk');
          } else {
            console.error('Failed to create a new conversation');
          }
        } else {
          console.error('Failed to save user data');
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
