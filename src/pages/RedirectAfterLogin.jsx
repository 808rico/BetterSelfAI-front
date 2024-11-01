import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const RedirectAfterLogin = () => {
  const navigate = useNavigate();
  const { user, isSignedIn } = useUser();

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
