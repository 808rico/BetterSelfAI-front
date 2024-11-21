import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Success = () => {
  const navigate = useNavigate();
  const [statusMessage, setStatusMessage] = useState('Checking your subscription status...');
  const [attempts, setAttempts] = useState(0);
  const { user } = useUser();
  const [isUserLoaded, setIsUserLoaded] = useState(false); // Indicateur pour s'assurer que le user est chargé

  useEffect(() => {
    // Vérifier que le user est bien chargé
    if (user) {
      setIsUserLoaded(true);
    }
  }, [user]);

  useEffect(() => {
    if (!isUserLoaded) return; // Attendre que le user soit chargé

    const maxAttempts = 3;

    const checkSubscription = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/billing/is-subscribed`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user.id }), // Utiliser l'ID utilisateur réel
        });

        const data = await response.json();
        if (data.isSubscribed) {
          setStatusMessage('Subscription active! Redirecting to the chat...');
          setTimeout(() => navigate('/talk'), 2000);
        } else if (attempts + 1 >= maxAttempts) {
          setStatusMessage('Subscription check failed. Please contact support.');
        } else {
          setAttempts((prev) => prev + 1);
        }
      } catch (error) {
        console.error('Error checking subscription status:', error);
        setStatusMessage('An error occurred. Please try again later.');
      }
    };

    if (attempts < maxAttempts) {
      const interval = setInterval(() => {
        checkSubscription();
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [attempts, navigate, isUserLoaded, user]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="p-6 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-semibold text-green-600 mb-4">Thanks for your purchase!</h1>
        <p className="text-gray-600">{statusMessage}</p>
      </div>
    </div>
  );
};

export default Success;
