// pages/HomePage.jsx — tela de seleção de perfil de criança
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile, AVATARS } from '../hooks/useProfile';
import { useSound } from '../hooks/useSound';
import styles from './HomePage.module.css';

function HomePage() {
  const navigate = useNavigate();
  const { profiles, selectProfile, createProfile, deleteProfile } = useProfile();
  const { playClick } = useSound();

  const [showCreate, setShowCreate] = useState(false); // exibe form de novo perfil
  const [newName,   setNewName]   = useState('');      // nome do novo perfil
  const [newAvatar, setNewAvatar] = useState(AVATARS[0]); // avatar do novo perfil
  const [newAge,    setNewAge]    = useState(4);           // idade do novo perfil

  // seleciona um perfil e vai para o menu de jogos
  const handleSelect = (profile) => {
    playClick();
    selectProfile(profile); // ativa o perfil
    navigate('/play');       // navega para o menu
  };

  // cria um novo perfil
  const handleCreate = () => {
    if (!newName.trim()) return; // valida nome
    playClick();
    createProfile(newName.trim(), newAvatar, newAge); // cria o perfil
    navigate('/play'); // vai direto para jogar
  };

  // primeiro acesso — sem perfis — redireciona para onboarding
  if (profiles.length === 0 && !showCreate) {
    navigate('/onboarding');
    return null;
  }

  return (
    <div className={styles.container}>
      {/* cabeçalho com logo */}
      <header className={styles.header}>
        <span className={styles.logo}>🎓</span>
        <h1 className={styles.logoText}>EduKids</h1>
        {/* botão área dos pais */}
        <button
          className={styles.parentBtn}
          onClick={() => { playClick(); navigate('/parent'); }}
        >
          👨‍👩‍👧 Pais
        </button>
      </header>

      <h2 className={styles.question}>Quem vai jogar hoje?</h2>

      {/* grid de perfis cadastrados */}
      <div className={styles.profilesGrid}>
        {profiles.map(p => (
          <div key={p.id} className={styles.profileCard}>
            {/* botão de deletar perfil */}
            <button
              className={styles.deleteBtn}
              onClick={() => { playClick(); deleteProfile(p.id); }}
              title="Remover perfil"
            >
              ✕
            </button>
            {/* clica no card para selecionar */}
            <button
              className={styles.profileBtn}
              onClick={() => handleSelect(p)}
            >
              <span className={styles.profileAvatar}>{p.avatar}</span>
              <span className={styles.profileName}>{p.name}</span>
              <span className={styles.profileAge}>{p.age} anos</span>
              {/* barra de progresso total */}
              <div className={styles.starsRow}>
                {'⭐'.repeat(Math.min(
                  Object.values(p.progress).reduce((acc, c) => acc + c.stars, 0),
                  10
                ))}
              </div>
            </button>
          </div>
        ))}

        {/* botão de adicionar novo perfil */}
        {profiles.length < 4 && ( // máximo 4 perfis
          <button
            className={styles.addBtn}
            onClick={() => { playClick(); setShowCreate(true); }}
          >
            <span className={styles.addIcon}>+</span>
            <span>Novo perfil</span>
          </button>
        )}
      </div>

      {/* modal de criação de perfil */}
      {showCreate && (
        <div className={styles.modalOverlay} onClick={() => setShowCreate(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Novo Perfil</h3>

            {/* campo de nome */}
            <input
              className={styles.input}
              placeholder="Nome da criança..."
              value={newName}
              onChange={e => setNewName(e.target.value)}
              maxLength={20}
              autoFocus
            />

            {/* seleção de avatar */}
            <p className={styles.label}>Personagem:</p>
            <div className={styles.avatarRow}>
              {AVATARS.slice(0, 5).map(a => (
                <button
                  key={a}
                  className={`${styles.avatarBtn} ${newAvatar === a ? styles.avatarSelected : ''}`}
                  onClick={() => { playClick(); setNewAvatar(a); }}
                >
                  {a}
                </button>
              ))}
            </div>

            {/* seleção de idade */}
            <p className={styles.label}>Idade:</p>
            <div className={styles.ageRow}>
              {[3,4,5,6,7].map(a => (
                <button
                  key={a}
                  className={`${styles.ageBtn} ${newAge === a ? styles.ageSelected : ''}`}
                  onClick={() => { playClick(); setNewAge(a); }}
                >
                  {a}
                </button>
              ))}
            </div>

            {/* botões de ação */}
            <div className={styles.modalActions}>
              <button className={styles.btnSecondary} onClick={() => setShowCreate(false)}>
                Cancelar
              </button>
              <button
                className={styles.btnPrimary}
                onClick={handleCreate}
                disabled={!newName.trim()}
              >
                Criar! 🎉
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
