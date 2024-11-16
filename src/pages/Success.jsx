import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Success = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Attendre 2 secondes avant de rediriger
    const timer = setTimeout(() => {
      navigate('/talk');
    }, 2500);

    // Nettoyer le timeout en cas de démontage du composant
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="p-6 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-semibold text-green-600 mb-4">Payment Successful!</h1>
        <p className="text-gray-600">Redirecting you to the chat...</p>
      </div>
    </div>
  );
};

export default Success;
