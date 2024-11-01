import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import useFetch from '../hooks/useFetch';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const RedirectAfterLogin = () => {
    const navigate = useNavigate();
    const { user, isSignedIn } = useUser();
    const authenticatedFetch = useFetch(); // Appel de useFetch

    useEffect(() => {
        const checkUserExists = async () => {
            if (isSignedIn && user) {
                try {
                    // Appel API pour vérifier l'existence de l'utilisateur dans la base de données
                    const response = await fetch(`${BACKEND_URL}/api/users/check-user/${user.id}`);
                    const data = await response.json();

                    // Redirection et stockage des données dans le localStorage
                    if (data.exists) {
                        localStorage.setItem("userId", user.id);
                        localStorage.setItem("selectedName", data.name || "");
                        localStorage.setItem("selectedPhotoId", data.photo || "");
                        localStorage.setItem("selectedVoiceId", data.voice || "");
                        navigate("/talk");
                    } else if (localStorage.getItem('userHash')) {
                        console.log('switch')
                        const oldUserHash = localStorage.getItem('userHash');

                        // Faire l'appel pour switcher userHash par userID
                        authenticatedFetch(`${BACKEND_URL}/api/users/switch-user-hash`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ oldUserHash })
                        })
                            .then(response => {

                                if (!response.ok) {
                                    throw new Error('Failed to update user hash');
                                }
                                return response.json();
                            })
                            .then(data => {
                                console.log('User hash updated successfully:', data);
                                localStorage.removeItem('userHash');
                                localStorage.setItem('userId', user.id)
                                navigate("/talk");
                            })
                            .catch(error => {
                                console.error('Error updating user hash:', error);
                            });


                    } else {
                        localStorage.setItem("userId", user.id);
                        navigate("/onboarding");
                    }
                } catch (error) {
                    console.error("Error fetching user:", error);
                    // Gérer les erreurs si nécessaire
                }
            }
        };

        checkUserExists();
    }, [isSignedIn, user, navigate]);

    return null;
};

export default RedirectAfterLogin;
