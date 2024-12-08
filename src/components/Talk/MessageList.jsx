import React, { useEffect, useRef } from 'react';
import MessageItem from './MessageItem';

const MessageList = ({ messages }) => {
  const messageEndRef = useRef(null);

  // Fonction pour scroller vers le bas
  const scrollToBottom = () => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scrolle chaque fois que les messages changent
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col w-full p-4 space-y-2 rounded-lg overflow-y-auto">
      {messages.map((message, index) => (
        <MessageItem key={index} message={message} />
      ))}
      {/* Élément invisible pour scroller à la fin */}
      <div ref={messageEndRef} />
    </div>
  );
};

export default MessageList;
