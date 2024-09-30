// ./pages/Talk.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Talk/Header';
import MessageList from '../components/Talk/MessageList';
import InputBar from '../components/Talk/InputBar';
import { therapistVoices } from '../config/therapistVoices'; // Import the voices configuration

const Talk = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isMuted, setIsMuted] = useState(localStorage.getItem('audioMuted') === 'true'); // Check localStorage

  useEffect(() => {
    const userHash = localStorage.getItem('userHash');
    const conversationHash = localStorage.getItem('conversationHash');

    if (!userHash || !conversationHash) {
      navigate('/start');
      return;
    }

    fetch(`http://localhost:5001/api/users/${userHash}`)
      .then(response => response.json())
      .then(data => {
        setUserInfo(data);
        setMessages([{ sender: 'AI', text: 'Bonjour' }]);
      })
      .catch(error => console.error('Error fetching user info:', error));
  }, [navigate]);

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;

    const userHash = localStorage.getItem('userHash');
    const conversationHash = localStorage.getItem('conversationHash');
    const selectedVoiceId = localStorage.getItem('selectedVoiceId'); // Get selected voice ID

    // Find the voice modelId from therapistVoices based on the selectedVoiceId
    const selectedVoice = therapistVoices.find(voice => voice.id === selectedVoiceId);
    const modelId = selectedVoice ? selectedVoice.modelId : null;

    const newMessages = [...messages, { sender: 'user', text: inputMessage }];
    setMessages(newMessages);
    setInputMessage('');

    fetch('http://localhost:5001/api/conversations/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userHash,
        conversationHash,
        message: inputMessage,
        modelId // Send the modelId to the backend
      }),
    })
      .then(response => response.json())
      .then(data => {
        setMessages([...newMessages, { sender: 'AI', text: data.reply }]);
        
        // Play the audio if it exists and is not muted
        if (data.audio && !isMuted) {
          const audio = new Audio(data.audio);
          audio.play();
        }
      })
      .catch(error => console.error('Error fetching AI response:', error));
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
