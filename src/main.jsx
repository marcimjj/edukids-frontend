// main.jsx — ponto de entrada da aplicação React
import React from 'react';                          // importa o React
import ReactDOM from 'react-dom/client';            // importa o renderizador DOM do React 18
import { BrowserRouter } from 'react-router-dom';   // provedor de roteamento
import App from './App';                            // componente raiz da aplicação
import './styles/global.css';                       // estilos globais da aplicação

// monta a aplicação no elemento #root do index.html
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* BrowserRouter habilita a navegação por rotas */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
