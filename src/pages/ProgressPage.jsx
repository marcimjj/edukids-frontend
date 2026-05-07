// pages/ProgressPage.jsx — tela de progresso e conquistas da criança
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import { useSound } from '../hooks/useSound';
import styles from './ProgressPage.module.css';

// configuração visual de cada categoria
const CATEGORIES = [
  { id: 'logica',     label: 'Lógica',         icon: '🧩', color: 'var(--color-blue)'   },
  { id: 'matematica', label: 'Matemática',      icon: '🔢', color: 'var(--color-yellow)' },
  { id: 'alfabeto',   label: 'Alfabeto',        icon: '📖', color: 'var(--color-red)'    },
  { id: 'cores',      label: 'Cores e Formas',  icon: '🎨', color: 'var(--color-green)'  },
];

// lista de conquistas possíveis no jogo
const ACHIEVEMENTS = [
  { id: 'first_game',   label: 'Primeira Partida!', icon: '🎮', condition: (p) => Object.values(p.progress).some(c => c.gamesPlayed > 0) },
  { id: 'star5',        label: '5 Estrelas',        icon: '⭐', condition: (p) => Object.values(p.progress).reduce((a,c) => a + c.stars, 0) >= 5 },
  { id: 'star20',       label: '20 Estrelas',       icon: '🌟', condition: (p) => Object.values(p.progress).reduce((a,c) => a + c.stars, 0) >= 20 },
  { id: 'streak3',      label: 'Sequência de 3',    icon: '🔥', condition: (p) => Object.values(p.progress).some(c => c.bestStreak >= 3) },
  { id: 'all_cats',     label: 'Explorador',        icon: '🗺️', condition: (p) => Object.values(p.progress).every(c => c.gamesPlayed > 0) },
  { id: 'games10',      label: '10 Jogos!',         icon: '🏆', condition: (p) => Object.values(p.progress).reduce((a,c) => a + c.gamesPlayed, 0) >= 10 },
];

function ProgressPage() {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { playClick } = useSound();

  if (!profile) {
    navigate('/');
    return null;
  }

  // calcula o total geral de estrelas e jogos
  const totalStars  = Object.values(profile.progress).reduce((a,c) => a + c.stars, 0);
  const totalGames  = Object.values(profile.progress).reduce((a,c) => a + c.gamesPlayed, 0);

  return (
    <div className={styles.container}>
      {/* header */}
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => { playClick(); navigate('/play'); }}>
          ← Voltar
        </button>
        <h1 className={styles.title}>Minhas Conquistas 🏆</h1>
      </header>

      {/* card do perfil com totais */}
      <div className={styles.profileCard}>
        <span className={styles.avatar}>{profile.avatar}</span>
        <div className={styles.profileInfo}>
          <span className={styles.profileName}>{profile.name}</span>
          <span className={styles.profileStats}>
            ⭐ {totalStars} estrelas • 🎮 {totalGames} jogos
          </span>
        </div>
      </div>

      {/* progresso por categoria */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Progresso por categoria</h2>
        <div className={styles.catList}>
          {CATEGORIES.map(cat => {
            const prog = profile.progress[cat.id] || { stars: 0, gamesPlayed: 0 };
            return (
              <div key={cat.id} className={styles.catCard}>
                {/* ícone colorido */}
                <div className={styles.catIcon} style={{ background: cat.color }}>
                  {cat.icon}
                </div>
                <div className={styles.catDetails}>
                  <span className={styles.catName}>{cat.label}</span>
                  <span className={styles.catStats}>
                    ⭐ {prog.stars} estrelas • {prog.gamesPlayed} jogos
                  </span>
                  {/* barra de progresso visual */}
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{
                        width: `${Math.min((prog.stars / 18) * 100, 100)}%`, // 18 = max possível (6 jogos × 3 estrelas)
                        background: cat.color,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* conquistas desbloqueadas */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Medalhas</h2>
        <div className={styles.achievementsGrid}>
          {ACHIEVEMENTS.map(ach => {
            const unlocked = ach.condition(profile); // verifica se foi desbloqueada
            return (
              <div
                key={ach.id}
                className={`${styles.achCard} ${unlocked ? styles.achUnlocked : styles.achLocked}`}
              >
                <span className={styles.achIcon}>{unlocked ? ach.icon : '🔒'}</span>
                <span className={styles.achLabel}>{ach.label}</span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default ProgressPage;
