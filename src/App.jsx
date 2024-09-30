// App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Start from './pages/Start';
import Onboarding from './pages/onboarding/Onboarding';
import Talk from './pages/Talk';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/start" />} />
        <Route path="/start" element={<Start />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/talk" element={<Talk />} />
      </Routes>
    </Router>
  );
};

export default App;
