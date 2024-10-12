// ./pages/Admin.jsx
import React, { useState, useEffect } from 'react';
import { therapistPhotos } from '../config/therapistPhotos'; // Importing therapistPhotos

const Admin = () => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userDetails, setUserDetails] = useState(null);

  const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD;

  // Function to handle password submission
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === correctPassword) {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password!');
    }
  };

  // Function to fetch conversations
  const fetchConversations = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/conversations?page=1`);
      const data = await response.json();
      setConversations(data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  // Function to fetch conversation details
  const fetchConversationDetails = async (hash) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/conversations/${hash}?page=1`);
      const data = await response.json();
      setUserDetails(data.user);
      setMessages(data.messages);
    } catch (error) {
      console.error('Error fetching conversation details:', error);
    }
  };

  // Load conversations after authentication
  useEffect(() => {
    if (isAuthenticated) {
      fetchConversations();
    }
  }, [isAuthenticated]);

  // Handle conversation selection
  const handleSelectConversation = (event) => {
    const hash = event.target.value;
    setSelectedConversation(hash);
    fetchConversationDetails(hash);
  };

  // Get the corresponding photo based on the voiceId
  const getTherapistPhoto = (voiceId) => {
    const therapist = therapistPhotos.find((photo) => photo.id === voiceId);
    return therapist ? therapist.file : null;
  };

  // If the user is not authenticated, show the login form
  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md w-80">
          <h2 className="text-xl font-semibold mb-4 text-center">Admin Login</h2>
          <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Admin Password"
              className="border p-2 rounded-md"
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-8 gap-2">
      <meta name="robots" content="noindex,nofollow" />
      
      {/* Section 1: Dropdown for selecting conversation */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Select a Conversation</h2>
        <select
          id="conversationSelect"
          onChange={handleSelectConversation}
          className="w-full p-2 border rounded-md"
        >
          <option value="">-- Select a conversation --</option>
          {conversations.map((conversation) => (
            <option key={conversation.conversation_hash} value={conversation.conversation_hash}>
              {`${conversation.conversation_hash} - ${new Date(conversation.created_at).toLocaleString()}`}
            </option>
          ))}
        </select>
      </div>
  
      {/* Section 2: User Details */}
      {userDetails && (
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">User Details</h2>
          <div className="flex items-center gap-4">
            <img
              src={getTherapistPhoto(userDetails.voice)}
              alt="Therapist Avatar"
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <p className="text-lg font-semibold">{userDetails.name}</p>
              <p className="text-sm text-gray-500">Voice: {userDetails.voice}</p>
            </div>
          </div>
        </div>
      )}
  
      {/* Section 3: Messages */}
      {messages.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl mx-auto  overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Messages</h2>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.sender === 'AI' ? 'justify-start' : 'justify-end'}`}>
                {message.sender === 'AI' && (
                  <img
                    src={getTherapistPhoto(userDetails.voice)}
                    alt="AI Avatar"
                    className="w-10 h-10 rounded-full object-cover mr-2"
                  />
                )}
                <div
                  className={`p-4 rounded-lg max-w-xs ${
                    message.sender === 'AI' ? 'bg-gray-100 text-black' : 'bg-blue-500 text-white'
                  }`}
                >
                  <p>{message.message}</p>
                  <span className="block text-sm mt-2 text-right">
                    {new Date(message.created_at).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
  
};

export default Admin;
