// App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Start from './pages/Start';
import Onboarding from './pages/onboarding/Onboarding';
import Talk from './pages/Talk';
import Admin from './pages/Admin'; // Import de la page admin
import RedirectAfterLogin from './pages/RedirectAfterLogin'
import Success from './pages/Success';
import OptOut from './pages/OptOut'; // Importez la page OptOut

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/start" />} />
        <Route path="/start" element={<Start />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/talk" element={<Talk />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/success" element={<Success />} />
        <Route path="/redirect-after-login" element={<RedirectAfterLogin />} />
        <Route path="/opt-out" element={<OptOut />} /> {/* Ajout de la route */}
      </Routes>
    </Router>
  );
};

export default App;
