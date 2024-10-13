import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player'; // Import ReactPlayer
import { therapistPhotos } from '../../config/therapistPhotos'; // Import des photos configurées
import { FaPlay, FaPause } from 'react-icons/fa'; // Icons for play and pause

const MessageItem = ({ message }) => {
  const isAI = message.sender === 'AI';
  const [aiAvatar, setAiAvatar] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const selectedPhotoId = localStorage.getItem('selectedPhotoId');
    if (selectedPhotoId) {
      const selectedPhoto = therapistPhotos.find(photo => photo.id === selectedPhotoId);
      if (selectedPhoto) {
        setAiAvatar(selectedPhoto.file);
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
      <div className={`p-2 max-w-[80%] rounded-lg ${isAI ? 'bg-gray-100' : 'bg-blue-500 text-white'} relative`}>
        {message.type === 'audio' ? (
          <div className="flex items-center space-x-2">
            <ReactPlayer
              url={URL.createObjectURL(message.content)} // Utiliser l'URL Blob pour le fichier audio
              playing={isPlaying} // Déterminer si l'audio est en train de jouer
              height="0" // Masquer le lecteur (aucune interface visible)
              width="0" 
              onEnded={() => setIsPlaying(false)}
            />

            {/* Play/Pause Button with Animated Border */}
            <button
              onClick={() => setIsPlaying(!isPlaying)} // Bouton pour jouer/pause
              className={`text-white bg-transparent focus:outline-none p-2 rounded-full border-2 border-white ${isPlaying ? 'border-blue-400 animate-pulse' : 'border-transparent'}`}
            >
              {isPlaying ? <FaPause className='ml-0.5 my-px'/> : <FaPlay className='ml-0.5 my-px'/>}
            </button>

            {/* Voice message text */}
            <div className="text-sm text-white">
              Voice message
            </div>
          </div>
        ) : (
          message.content
        )}
      </div>
    </div>
  );
};

export default MessageItem;
