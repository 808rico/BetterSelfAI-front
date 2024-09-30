// ./components/MessageItem.jsx
import React, { useEffect, useState } from 'react';
import { therapistPhotos } from '../../config/therapistPhotos'; // Import des photos configurées

const MessageItem = ({ message }) => {
  const isAI = message.sender === 'AI';
  const [aiAvatar, setAiAvatar] = useState(null);

  useEffect(() => {
    // Récupérer l'ID de l'image sélectionnée depuis le localStorage
    const selectedPhotoId = localStorage.getItem('selectedPhotoId');
    
    if (selectedPhotoId) {
      // Trouver la photo correspondante à partir de therapistPhotos
      const selectedPhoto = therapistPhotos.find(photo => photo.id === selectedPhotoId);
      if (selectedPhoto) {
        setAiAvatar(selectedPhoto.file); // Mettre à jour l'avatar de l'IA avec le fichier d'image correspondant
      }
    }
  }, []);

  return (
    <div className={`flex ${isAI ? 'justify-start' : 'justify-end'} w-full mb-2`}>
      {isAI && aiAvatar && (
        <img 
          src={aiAvatar} 
          alt="AI Avatar" 
          className="w-10 h-10 rounded-full mr-2 object-cover" 
        />
      )}
      <div 
        className={`p-2 max-w-[80%] rounded-lg ${isAI ? 'bg-gray-100' : 'bg-blue-500 text-white'}`}
      >
        {message.text}
      </div>
    </div>
  );
};

export default MessageItem;
