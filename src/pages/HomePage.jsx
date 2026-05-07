// pages/HomePage.jsx — tela de seleção de perfil de criança
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile, AVATARS } from '../hooks/useProfile';
import { useSound } from '../hooks/useSound';
import styles from './HomePage.module.css';

function HomePage() {
  const navigate = useNavigate();
  const { profiles, selectProfile, createProfile, deleteProfile } = useProfile();
  const { playClick } = useSound();

  const [showCreate, setShowCreate] = useState(false);
  const [newName,    setNewName]    = useState('');
  const [newAvatar,  setNewAvatar]  = useState(AVATARS[0]);
  const [newAge,     setNewAge]     = useState(4);

  // redireciona para onboarding se não houver perfis
  // usa useEffect para evitar navigate durante o render (causa tela branca)
  useEffect(() => {
    if (profiles.length === 0 && !showCreate) {
      navigate('/onboarding');
    }
  }, [profiles.length, showCreate, navigate]);

  // enquanto redireciona, não renderiza nada
  if (profiles.length === 0 && !showCreate) return null;

  // seleciona um perfil e vai para o menu de jogos
  const handleSelect = (profile) => {
    playClick();
    selectProfile(profile);
    navigate('/play');
  };

  // cria um novo perfil
  const handleCreate = () => {
    if (!newName.trim()) return;
    playClick();
    createProfile(newName.trim(), newAvatar, newAge);
    navigate('/play');
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <span className={styles.logo}>🎓</span>
        <h1 className={styles.logoText}>EduKids</h1>
        <button
          className={styles.parentBtn}
          onClick={() => { playClick(); navigate('/parent'); }}
        >
          👨‍👩‍👧 Pais
        </button>
      </header>

      <h2 className={styles.question}>Quem vai jogar hoje?</h2>

      <div className={styles.profilesGrid}>
        {profiles.map(p => (
          <div key={p.id} className={styles.profileCard}>
            <button
              className={styles.deleteBtn}
              onClick={() => { playClick(); deleteProfile(p.id); }}
              title="Remover perfil"
            >
              ✕
            </button>
            <button
              className={styles.profileBtn}
              onClick={() => handleSelect(p)}
            >
              <span className={styles.profileAvatar}>{p.avatar}</span>
              <span className={styles.profileName}>{p.name}</span>
              <span className={styles.profileAge}>{p.age} anos</span>
              <div className={styles.starsRow}>
                {'⭐'.repeat(Math.min(
                  Object.values(p.progress).reduce((acc, c) => acc + c.stars, 0),
                  10
                ))}
              </div>
            </button>
          </div>
        ))}

        {profiles.length < 4 && (
          <button
            className={styles.addBtn}
            onClick={() => { playClick(); setShowCreate(true); }}
          >
            <span className={styles.addIcon}>+</span>
            <span>Novo perfil</span>
          </button>
        )}
      </div>

      {showCreate && (
        <div className={styles.modalOverlay} onClick={() => setShowCreate(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Novo Perfil</h3>
            <input
              className={styles.input}
              placeholder="Nome da criança..."
              value={newName}
              onChange={e => setNewName(e.target.value)}
              maxLength={20}
              autoFocus
            />
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
