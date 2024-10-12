import React, { useState, useRef } from 'react';
import { FaArrowUp, FaMicrophone, FaTrash } from 'react-icons/fa';

const InputBar = ({ inputMessage, onChange, onSend }) => {
  const [isRecording, setIsRecording] = useState(false); // État pour savoir si on est en enregistrement
  const audioStreamRef = useRef(null); // Référence pour stocker le flux audio

  // Fonction pour vérifier et demander l'accès au micro
  const handleMicrophoneClick = async () => {
    if (isRecording) {
      // Si déjà en enregistrement, terminer l'enregistrement
      handleStopRecording();
      // Appeler onSend avec un type "audio"
      onSend('audio');
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (stream) {
          // Autorisation donnée, on commence l'enregistrement
          audioStreamRef.current = stream; // Stocker le flux dans la référence
          setIsRecording(true);
        }
      } catch (err) {
        console.error('Microphone permission denied or error:', err);
        alert('Please enable microphone access in your browser settings.');
      }
    }
  };

  // Fonction pour arrêter l'enregistrement (ou annuler)
  const handleStopRecording = () => {
    setIsRecording(false);

    // Arrêter tous les tracks du flux pour libérer le micro
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach(track => track.stop());
      audioStreamRef.current = null; // Réinitialiser la référence du flux
    }
  };

  // Fonction pour envoyer un message texte
  const handleSend = () => {
    if (inputMessage.trim() !== '') {
      onSend('text');
      onChange(''); // Réinitialiser le champ de saisie après l'envoi
    }
  };

  return (
    <div className="flex items-center justify-between w-full max-w-2xl p-2 mx-auto bg-white rounded-full shadow border border-gray-300 relative">
      {/* Bouton poubelle affiché seulement si en enregistrement */}
      {isRecording && (
        <button className="absolute left-2 text-red-500">
          <FaTrash className="w-5 h-5" onClick={handleStopRecording} />
        </button>
      )}

      {/* Zone de texte */}
      <textarea
        className="flex-1 p-2 rounded-full outline-none resize-none overflow-hidden bg-transparent"
        placeholder={isRecording ? "" : "Message..."}
        value={inputMessage}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Empêche l'ajout d'une nouvelle ligne
            handleSend();
          }
        }}
        rows={1} // Nombre de lignes minimum visibles
        style={{ minHeight: '40px', maxHeight: '96px' }} // Hauteur minimum et maximum
      />

      {/* Bouton dynamique (micro ou envoi) */}
      {inputMessage.trim() === '' ? (
        // Afficher le bouton micro si inputMessage est vide
        <button
          className={`p-2 rounded-full ml-2 bg-white hover:bg-gray-100 hover:border-white transition ${isRecording ? 'bg-blue-500 animate-pulse' : ''}`}
          onClick={handleMicrophoneClick}
        >
          <FaMicrophone className="w-5 h-5 text-black" />
        </button>
      ) : (
        // Afficher le bouton d'envoi si inputMessage n'est pas vide
        <button
          className={`p-2 rounded-full ml-2 bg-black hover:bg-gray-800 transition`}
          onClick={handleSend}
          disabled={inputMessage.trim() === ''}
        >
          <FaArrowUp className="w-5 h-5 text-white" />
        </button>
      )}
    </div>
  );
};

export default InputBar;
