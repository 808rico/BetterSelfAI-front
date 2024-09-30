// ./components/InputBar.jsx
import React from 'react';
import { FaArrowUp } from 'react-icons/fa'; // Utilisation de FaArrowUp pour une flèche vers le haut

const InputBar = ({ inputMessage, onChange, onSend }) => {
  // Fonction pour gérer l'envoi du message
  const handleSend = () => {
    if (inputMessage.trim() !== '') {
      onSend();
      onChange(''); // Réinitialiser le champ de saisie après l'envoi
    }
  };

  return (
    <div className="flex items-center justify-between w-full max-w-2xl p-2 mx-auto bg-white rounded-full shadow border border-gray-300">
      {/* Zone de texte */}
      <textarea
        className="flex-1 p-2 rounded-full outline-none resize-none overflow-hidden bg-transparent"
        placeholder="Type your message..."
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

      {/* Bouton d'envoi */}
      <button
        className={`p-2 rounded-full ml-2 ${
          inputMessage.trim() === '' ? 'bg-gray-300 cursor-not-allowed' : 'bg-black hover:bg-gray-800'
        } transition`}
        onClick={handleSend}
        disabled={inputMessage.trim() === ''}
      >
        <FaArrowUp className="w-5 h-5 text-white" />
      </button>
    </div>
  );
};

export default InputBar;
