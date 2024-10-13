import React, { useState, useRef } from 'react';
import { FaArrowUp, FaMicrophone, FaTrash } from 'react-icons/fa';

const InputBar = ({ inputMessage, onChange, onSend }) => {
  const [isRecording, setIsRecording] = useState(false); // État pour savoir si on est en enregistrement
  const audioStreamRef = useRef(null); // Référence pour stocker le flux audio
  const mediaRecorderRef = useRef(null); // Référence pour stocker le MediaRecorder
  const audioChunksRef = useRef([]); // Référence pour stocker les morceaux de l'enregistrement audio

  // Fonction pour vérifier et demander l'accès au micro
  const handleMicrophoneClick = async () => {
    if (isRecording) {
      // Si déjà en enregistrement, terminer l'enregistrement
      handleStopRecording();
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (stream) {
          // Autorisation donnée, on commence l'enregistrement
          audioStreamRef.current = stream; // Stocker le flux dans la référence
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;

          // Événement qui se déclenche à chaque fois qu'il y a un nouveau chunk d'audio
          mediaRecorder.ondataavailable = (event) => {
            audioChunksRef.current.push(event.data);
          };

          // Démarrer l'enregistrement
          mediaRecorder.start();
          setIsRecording(true);
        }
      } catch (err) {
        console.error('Microphone permission denied or error:', err);
        alert('Please enable microphone access in your browser settings.');
      }
    }
  };

  // Fonction pour arrêter l'enregistrement et envoyer l'audio
  const handleStopRecording = (sendAudio = true) => {
    setIsRecording(false);

    // Arrêter tous les tracks du flux pour libérer le micro
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach(track => track.stop());
      audioStreamRef.current = null; // Réinitialiser la référence du flux
    }

    if (sendAudio && mediaRecorderRef.current) {
      // Terminer l'enregistrement et créer un Blob audio si l'utilisateur souhaite envoyer l'audio
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        audioChunksRef.current = []; // Réinitialiser les chunks
        // Appeler onSend avec un type "audio" et le contenu audio
        onSend('audio', audioBlob);
      };
    } else {
      // Réinitialiser les chunks sans envoyer l'audio
      audioChunksRef.current = [];
      mediaRecorderRef.current = null;
    }
  };

  // Fonction pour annuler l'enregistrement
  const handleCancelRecording = () => {
    handleStopRecording(false); // Annuler l'enregistrement sans envoyer l'audio
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
        <button className="absolute left-2 text-red-500" onClick={handleCancelRecording}>
          <FaTrash className="w-5 h-5" />
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
