// ./pages/Talk.jsx
import React, { useEffect, useState, } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Talk/Header';
import MessageList from '../components/Talk/MessageList';
import InputBar from '../components/Talk/InputBar';
import { therapistVoices } from '../config/therapistVoices'; // Import the voices configuration
import useFetch from '../hooks/useFetch';

import { useSignIn } from '@clerk/clerk-react'
import { useUser } from '@clerk/clerk-react'



// Use the backend URL from the Vite environment variable
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Talk = () => {
  const navigate = useNavigate();
  const authenticatedFetch = useFetch(); // Appel de useFetch
  const [userInfo, setUserInfo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isMuted, setIsMuted] = useState(localStorage.getItem('audioMuted') === 'true'); // Check localStorage

  const { isSignedIn, user, isLoaded } = useUser()

  useEffect(() => {
    const userHash = localStorage.getItem('userId') || localStorage.getItem('userHash');
    const conversationHash = localStorage.getItem('conversationHash');
    const welcomeMessage = localStorage.getItem('welcomeMessage');
    const welcomeAudio = localStorage.getItem('welcomeAudio');

    if (!userHash) {
      navigate('/start');
      return;
    }

    // Récupérer les informations de l'utilisateur et les 100 derniers messages
    fetch(`${BACKEND_URL}/api/users/${userHash}`)
      .then(response => response.json())
      .then(data => {
        setUserInfo(data.userInfo);

        // Charger les messages de la conversation
        const initialMessages = data.messages || [];

        console.log(initialMessages)

        setMessages([...initialMessages]);

        // Jouer l'audio de bienvenue si disponible
        if (welcomeAudio && !isMuted) {
          const audio = new Audio(welcomeAudio);
          audio.play();
        }

        // Effacer le welcomeAudio pour éviter la répétition lors du rechargement
        localStorage.removeItem('welcomeAudio');
      })
      .catch(error => console.error('Error fetching user info and messages:', error));
  }, [navigate]);


  useEffect(() => {
    if (isSignedIn && isLoaded) {
      const oldUserHash = localStorage.getItem('userHash');
      if (oldUserHash) {
        

        // Faire l'appel pour switcher userHash par userID
        authenticatedFetch(`${BACKEND_URL}/api/users/switch-user-hash`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ oldUserHash })
        })
          .then(response => {
           
            if (!response.ok) {
              throw new Error('Failed to update user hash');
            }
            return response.json();
          })
          .then(data => {
            console.log('User hash updated successfully:', data);
            localStorage.removeItem('userHash');
            localStorage.setItem('userId', user.id)
          })
          .catch(error => {
            console.error('Error updating user hash:', error);
          });
      }
    }
  }, [isLoaded, isSignedIn]);




  const handleSendMessage = (messageType, content) => {
    console.log('onsend')
    const userHash = localStorage.getItem('userId') || localStorage.getItem('userHash');
    const selectedVoiceId = localStorage.getItem('selectedVoiceId'); // Get selected voice ID

    // Find the voice modelId from therapistVoices based on the selectedVoiceId
    const selectedVoice = therapistVoices.find(voice => voice.id === selectedVoiceId);
    const modelId = selectedVoice ? selectedVoice.modelId : null;

    if (messageType === 'text') {
      // Gérer les messages texte
      if (inputMessage.trim() === '') return;

      const newMessages = [...messages, { sender: 'user', content: inputMessage, type: 'text' }];
      setMessages(newMessages);
      setInputMessage('');

      authenticatedFetch(`${BACKEND_URL}/api/conversations/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userHash,
          message: inputMessage,
          modelId, // Send the modelId to the backend
          type: 'text', // Spécifier que c'est un message texte
        }),
      })
        .then(response => response.json())
        .then(data => {
          setMessages([...newMessages, { sender: 'AI', content: data.reply, type: 'text' }]);

          // Play the audio if it exists and is not muted
          if (data.audio && !isMuted) {
            const audio = new Audio(data.audio);
            audio.play();
          }
        })
        .catch(error => console.error('Error fetching AI response:', error));
    } else if (messageType === 'audio') {
      // Gérer les messages audio
      const newMessages = [...messages, { sender: 'user', content, type: 'audio' }];
      setMessages(newMessages);

      // Utiliser FormData pour envoyer le fichier audio
      const formData = new FormData();
      formData.append('userHash', userHash);
      formData.append('message', content); // Le fichier audio (Blob)
      formData.append('modelId', modelId);
      formData.append('type', 'audio'); // Spécifier que c'est un message audio

      authenticatedFetch(`${BACKEND_URL}/api/conversations/message`, {
        method: 'POST',
        body: formData, // Envoyer FormData
      })
        .then(response => response.json())
        .then(data => {
          setMessages([...newMessages, { sender: 'AI', content: data.reply, type: 'text' }]);

          // Play the audio if it exists and is not muted
          if (data.audio && !isMuted) {
            const audio = new Audio(data.audio);
            audio.play();
          }
        })
        .catch(error => console.error('Error fetching AI response:', error));


    }
  };





  const handleToggleAudio = (muted) => {
    setIsMuted(muted);
  };

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-shrink-0">
        <Header onToggleAudio={handleToggleAudio} />
      </div>
      <div className="flex-1 overflow-y-auto w-full max-w-2xl mx-auto">
        <MessageList messages={messages} />
      </div>
      <div className="flex-shrink-0 w-full max-w-2xl mx-auto px-2 my-2">
        <InputBar
          inputMessage={inputMessage}
          onChange={setInputMessage}
          onSend={handleSendMessage}
        />
      </div>
    </div>
  );
};

export default Talk;
