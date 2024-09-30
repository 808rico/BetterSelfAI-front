// ./components/MessageList.jsx
import React from 'react';
import MessageItem from './MessageItem';

const MessageList = ({ messages }) => {
  return (
    <div className="flex flex-col w-full p-4 space-y-2 rounded-lg overflow-y-auto">
      {messages.map((message, index) => (
        <MessageItem key={index} message={message} />
      ))}
    </div>
  );
};

export default MessageList;
