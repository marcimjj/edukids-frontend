// hooks/useProfile.js — hook para gerenciar o perfil ativo da criança
import { useState, useEffect } from 'react';

// chave usada para persistência no localStorage
const PROFILE_KEY   = 'edukids_active_profile';
const PROFILES_KEY  = 'edukids_profiles';

// avatares disponíveis para as crianças escolherem
export const AVATARS = ['🐶','🐱','🐸','🦊','🐼','🦁','🐨','🐧','🦋','🐙'];

// hook principal de perfil
export function useProfile() {
  // perfil atualmente ativo (criança jogando)
  const [profile, setProfileState] = useState(() => {
    try {
      const saved = localStorage.getItem(PROFILE_KEY); // tenta recuperar do storage
      return saved ? JSON.parse(saved) : null;          // retorna objeto ou null
    } catch {
      return null; // em caso de erro, começa sem perfil
    }
  });

  // lista de todos os perfis cadastrados
  const [profiles, setProfilesState] = useState(() => {
    try {
      const saved = localStorage.getItem(PROFILES_KEY); // tenta recuperar do storage
      return saved ? JSON.parse(saved) : [];             // retorna array ou vazio
    } catch {
      return []; // em caso de erro, começa vazio
    }
  });

  // salva o perfil ativo no localStorage sempre que mudar
  useEffect(() => {
    if (profile) {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); // persiste
    } else {
      localStorage.removeItem(PROFILE_KEY); // limpa se null
    }
  }, [profile]);

  // salva a lista de perfis no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles)); // persiste
  }, [profiles]);

  // seleciona o perfil ativo para jogar
  const selectProfile = (p) => setProfileState(p);

  // desseleciona o perfil ativo (volta para tela de seleção)
  const clearProfile = () => setProfileState(null);

  // cria um novo perfil de criança
  const createProfile = (name, avatar, age) => {
    const newProfile = {
      id:        Date.now().toString(),  // ID único baseado no timestamp
      name,                              // nome da criança
      avatar,                            // emoji do avatar
      age,                               // idade
      createdAt: new Date().toISOString(), // data de criação
      progress: {                        // progresso inicial zerado por categoria
        logica:  { stars: 0, gamesPlayed: 0, bestStreak: 0 },
        matematica: { stars: 0, gamesPlayed: 0, bestStreak: 0 },
        alfabeto: { stars: 0, gamesPlayed: 0, bestStreak: 0 },
        cores:    { stars: 0, gamesPlayed: 0, bestStreak: 0 },
      },
      achievements: [], // conquistas desbloqueadas
    };
    setProfilesState(prev => [...prev, newProfile]); // adiciona à lista
    setProfileState(newProfile);                     // seleciona automaticamente
    return newProfile;
  };

  // atualiza o progresso de um perfil após uma sessão de jogo
  const updateProgress = (categoria, stars, streak) => {
    setProfileState(prev => {
      if (!prev) return prev; // segurança: ignora se sem perfil
      const cat = prev.progress[categoria] || { stars: 0, gamesPlayed: 0, bestStreak: 0 };
      const updated = {
        ...prev,
        progress: {
          ...prev.progress,
          [categoria]: {
            stars:       cat.stars + stars,                    // acumula estrelas
            gamesPlayed: cat.gamesPlayed + 1,                  // incrementa jogos
            bestStreak:  Math.max(cat.bestStreak, streak || 0), // melhor sequência
          }
        }
      };
      // sincroniza na lista de perfis também
      setProfilesState(prevList =>
        prevList.map(p => p.id === updated.id ? updated : p)
      );
      return updated; // retorna perfil atualizado
    });
  };

  // deleta um perfil pelo ID
  const deleteProfile = (id) => {
    setProfilesState(prev => prev.filter(p => p.id !== id)); // remove da lista
    if (profile?.id === id) clearProfile(); // desativa se era o ativo
  };

  return {
    profile,         // perfil ativo atual
    profiles,        // todos os perfis cadastrados
    selectProfile,   // função para selecionar perfil
    clearProfile,    // função para limpar perfil ativo
    createProfile,   // função para criar novo perfil
    updateProgress,  // função para atualizar progresso
    deleteProfile,   // função para deletar perfil
  };
}
