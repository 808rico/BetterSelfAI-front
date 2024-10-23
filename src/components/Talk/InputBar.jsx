import React, { useState } from 'react';
import { FaArrowUp, FaMicrophone, FaTrash } from 'react-icons/fa';
import { useReactMediaRecorder } from "react-media-recorder";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const InputBar = ({ inputMessage, onChange, onSend }) => {
  const [statusRecording, setStatusRecording] = useState('notRecording'); // Trois états : 'notRecording', 'recording', 'readyToSend'

  const {
    startRecording,
    stopRecording,
    mediaBlobUrl,
    clearBlobUrl
  } = useReactMediaRecorder({ audio: true });

  // Fonction pour commencer l'enregistrement
  const handleMicrophoneClick = () => {
    if (statusRecording === 'notRecording') {
      startRecording();
      setStatusRecording('recording');
    }
  };

  // Fonction pour stopper l'enregistrement
  const handleStopRecording = () => {
    if (statusRecording === 'recording') {
      stopRecording();
      setStatusRecording('readyToSend');
    }
  };

  // Fonction pour annuler l'enregistrement
  const handleCancelRecording = () => {
    stopRecording(); // Arrêter l'enregistrement en cours
    clearBlobUrl(); // Effacer l'URL de l'audio enregistré
    setStatusRecording('notRecording'); // Réinitialiser l'état
  };

  // Fonction pour envoyer un message audio
  const handleSendAudio = async () => {
    if (mediaBlobUrl) {
      const audioBlob = await fetch(mediaBlobUrl).then((r) => r.blob());
      onSend('audio', audioBlob);
      clearBlobUrl();
      setStatusRecording('notRecording');
    }
  };

  // Fonction pour envoyer un message texte
  const handleSendText = () => {
    if (inputMessage.trim() !== '') {
      onSend('text');
      onChange(''); // Réinitialiser le champ de saisie après l'envoi
    }
  };

  return (
    <div className="flex items-center justify-between w-full max-w-2xl p-2 mx-auto bg-white rounded-full shadow border border-gray-300 relative">
      {statusRecording === 'recording' && (
        <button className="p-2 absolute z-10 left-2 rounded-full ml-2 bg-red-500 sm:hover:bg-red-600 transition" onClick={handleCancelRecording}>
          <FaTrash className="w-5 h-5 text-white" />
        </button>
      )}

      <textarea
        className="flex-1 p-2 rounded-full outline-none resize-none overflow-hidden bg-transparent"
        placeholder={
          statusRecording === 'recording'
            ? "           Recording..."
            : statusRecording === 'readyToSend'
              ? "           Ready to send"
              : "Message..."
        }
        value={inputMessage}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendText();
          }
        }}
        rows={1}
        style={{ minHeight: '40px', maxHeight: '96px' }}
        disabled={statusRecording === 'recording' || statusRecording === 'readyToSend'}
      />

      {inputMessage.trim() === '' ? (
        statusRecording === 'notRecording' ? (
          <button
            className={`p-2 rounded-full ml-2 bg-white sm:hover:bg-gray-100 transition ${statusRecording === 'recording' ? 'bg-blue-500 animate-pulse' : ''}`}
            onClick={handleMicrophoneClick}
          >
            <FaMicrophone className="w-5 h-5 text-black" />
          </button>
        ) : statusRecording === 'readyToSend' ? (
          <div className="flex items-center">
            <button className="p-2 rounded-full ml-2 bg-green-500 sm:hover:bg-green-600 transition" onClick={handleSendAudio}>
              Send Audio
            </button>
            <button className="p-2 absolute left-2 rounded-full ml-2 bg-red-500 sm:hover:bg-red-600 transition" onClick={handleCancelRecording}>
              <FaTrash className="w-5 h-5 text-white" />
            </button>
          </div>
        ) : (
          <button
            className="p-2 rounded-full ml-2 bg-blue-500 animate-pulse transition"
            onClick={handleStopRecording}
          >
            <FaMicrophone className="w-5 h-5 text-white" />
          </button>
        )
      ) : (
        <button
          className="p-2 rounded-full ml-2 bg-black sm:hover:bg-gray-800 transition"
          onClick={handleSendText}
          disabled={inputMessage.trim() === ''}
        >
          <FaArrowUp className="w-5 h-5 text-white" />
        </button>
      )}
    </div>
  );
};

export default InputBar;
