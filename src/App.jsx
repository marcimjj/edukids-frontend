// App.jsx — componente raiz com todas as rotas da aplicação
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';  // componentes de roteamento

// importa todas as páginas da aplicação
import HomePage        from './pages/HomePage';        // seleção de perfil
import PlayMenuPage    from './pages/PlayMenuPage';    // menu de categorias
import GamePage        from './pages/GamePage';        // tela de jogo ativo
import ProgressPage    from './pages/ProgressPage';   // progresso e conquistas
import ParentPage      from './pages/ParentPage';      // área dos pais
import OnboardingPage  from './pages/OnboardingPage';  // cadastro inicial

// hook de autenticação/perfil
import { useProfile }  from './hooks/useProfile';

function App() {
  const { profile } = useProfile(); // pega o perfil ativo do localStorage

  return (
    <Routes>
      {/* rota de boas-vindas / onboarding — primeira vez */}
      <Route path="/onboarding" element={<OnboardingPage />} />

      {/* rota home — seleção de perfil de criança */}
      <Route path="/" element={<HomePage />} />

      {/* rota do menu de jogos — requer perfil selecionado */}
      <Route
        path="/play"
        element={profile ? <PlayMenuPage /> : <Navigate to="/" replace />}
      />

      {/* rota do jogo ativo — recebe o tipo via parâmetro de rota */}
      <Route
        path="/game/:tipo"
        element={profile ? <GamePage /> : <Navigate to="/" replace />}
      />

      {/* rota de progresso e conquistas */}
      <Route
        path="/progress"
        element={profile ? <ProgressPage /> : <Navigate to="/" replace />}
      />

      {/* rota da área dos pais — protegida por PIN */}
      <Route path="/parent" element={<ParentPage />} />

      {/* redireciona qualquer rota desconhecida para home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App; // exporta o componente App
