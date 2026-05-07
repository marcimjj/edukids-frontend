// services/api.js — cliente HTTP para comunicação com o backend Node.js
import axios from 'axios';

// cria instância do axios com configuração base
const api = axios.create({
  baseURL: 'https://edukids-backend-production.up.railway.app/api',
  timeout: 10000,    // timeout de 10 segundos
  headers: {
    'Content-Type': 'application/json', // formato de dados
  }
});

// interceptor de requisição — adiciona token de autenticação se existir
api.interceptors.request.use(config => {
  const token = localStorage.getItem('edukids_token'); // recupera token salvo
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // adiciona no header
  }
  return config; // retorna config modificada
});

// interceptor de resposta — trata erros globalmente
api.interceptors.response.use(
  response => response,          // sucesso: retorna resposta normalmente
  error => {
    if (error.response?.status === 401) {
      // token expirado ou inválido — limpa dados de sessão
      localStorage.removeItem('edukids_token');
    }
    return Promise.reject(error); // propaga o erro
  }
);

// ---- funções de autenticação dos pais ----

// cadastra um novo responsável
export const registerParent = (data) =>
  api.post('/auth/register', data);

// faz login do responsável
export const loginParent = (email, password) =>
  api.post('/auth/login', { email, password });

// ---- funções de perfil de criança ----

// busca todos os perfis vinculados ao responsável logado
export const getProfiles = () =>
  api.get('/profiles');

// cria um novo perfil de criança
export const createProfileApi = (data) =>
  api.post('/profiles', data);

// deleta um perfil pelo ID
export const deleteProfileApi = (id) =>
  api.delete(`/profiles/${id}`);

// ---- funções de progresso ----

// salva uma sessão de jogo no backend
export const saveGameSession = (profileId, categoria, stars, streak) =>
  api.post('/progress/session', { profileId, categoria, stars, streak });

// busca o progresso completo de um perfil
export const getProgress = (profileId) =>
  api.get(`/progress/${profileId}`);

// busca o relatório semanal de um perfil (para área dos pais)
export const getWeeklyReport = (profileId) =>
  api.get(`/progress/${profileId}/weekly`);

export default api; // exporta a instância configurada
