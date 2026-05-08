// App.jsx — componente raiz com todas as rotas da aplicação
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useProfile } from './hooks/useProfile';

import HomePage         from './pages/HomePage';
import PlayMenuPage     from './pages/PlayMenuPage';
import GamePage         from './pages/GamePage';
import ProgressPage     from './pages/ProgressPage';
import ParentPage       from './pages/ParentPage';
import OnboardingPage   from './pages/OnboardingPage';
import ColoringMenuPage from './pages/ColoringMenuPage';
import ColoringPage     from './pages/ColoringPage';

function PrivateRoute({ children }) {
  const { profile } = useProfile();
  return profile ? children : <Navigate to="/" replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/onboarding"    element={<OnboardingPage />} />
      <Route path="/"              element={<HomePage />} />
      <Route path="/play"          element={<PrivateRoute><PlayMenuPage /></PrivateRoute>} />
      <Route path="/game/:tipo"    element={<PrivateRoute><GamePage /></PrivateRoute>} />
      <Route path="/progress"      element={<PrivateRoute><ProgressPage /></PrivateRoute>} />
      <Route path="/parent"        element={<ParentPage />} />
      <Route path="/coloring"      element={<PrivateRoute><ColoringMenuPage /></PrivateRoute>} />
      <Route path="/coloring/:id"  element={<PrivateRoute><ColoringPage /></PrivateRoute>} />
      <Route path="*"              element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
