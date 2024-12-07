import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import mixpanel from 'mixpanel-browser';
import { useUser } from '@clerk/clerk-react';

mixpanel.init(import.meta.env.VITE_MIXPANEL_PROJECT_TOKEN);

const OptOut = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSignedIn } = useUser();

  const [eventSent, setEventSent] = useState(false); // Drapeau pour suivre l'état de l'événement

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const userId = params.get('userId');

    if (userId && !eventSent) {
      // Envoyer l'événement Mixpanel une seule fois
      mixpanel.track('UNSUBSCRIBE AFTER FOLLOW UP', {
        $user_id: userId,
      });
      setEventSent(true); // Marquer l'événement comme envoyé
    }

    const timer = setTimeout(() => {
      if (isSignedIn) {
        navigate('/talk');
      } else {
        navigate('/start');
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [ navigate]); // Inclure `eventSent` comme dépendance

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">You have successfully unsubscribed!</h1>
      <p className="text-center">Redirecting you shortly...</p>
    </div>
  );
};

export default OptOut;
