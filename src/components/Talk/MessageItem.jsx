import React, { useEffect, useRef, useState } from 'react';
import { therapistPhotos } from '../../config/therapistPhotos'; // Import des photos configurées
import { FaPlay, FaPause } from 'react-icons/fa'; // Icons for play and pause

const MessageItem = ({ message }) => {
  const isAI = message.sender === 'AI';
  const [aiAvatar, setAiAvatar] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState('0:00');
  const [currentTime, setCurrentTime] = useState('0:00');
  
  const audioRef = useRef(null);

  useEffect(() => {
    const selectedPhotoId = localStorage.getItem('selectedPhotoId');
    
    if (selectedPhotoId) {
      const selectedPhoto = therapistPhotos.find(photo => photo.id === selectedPhotoId);
      if (selectedPhoto) {
        setAiAvatar(selectedPhoto.file); // Set AI avatar
      }
    }
  }, []);

  // Convert seconds to MM:SS format
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const current = audioRef.current.currentTime;
    const duration = audioRef.current.duration;

    // Ensure duration is valid before updating the display
    if (!isNaN(duration)) {
      setCurrentTime(formatTime(current));
      setProgress((current / duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    const duration = audioRef.current.duration;

    // Ensure the duration is valid before setting it
    if (!isNaN(duration) && duration !== Infinity) {
      setAudioDuration(formatTime(duration));
    }
  };

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
            <audio
              ref={audioRef}
              src={URL.createObjectURL(message.content)}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />

            {/* Play/Pause Button */}
            <button
              onClick={handlePlayPause}
              className="text-white focus:outline-none"
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>

            {/* Spectrogram Placeholder (can be replaced by real animation) */}
            <div className="relative flex-grow h-4 bg-blue-300 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-white"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Time Display */}
            <div className="text-sm text-white">
              <span>{currentTime}</span> / <span>{audioDuration}</span>
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
