// pages/ParentPage.jsx — área protegida por PIN para os pais verem relatórios
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import { useSound } from '../hooks/useSound';
import styles from './ParentPage.module.css';

const CORRECT_PIN = '1234'; // PIN padrão — em produção vem do backend

function ParentPage() {
  const navigate = useNavigate();
  const { profiles } = useProfile();
  const { playClick, playCorrect, playWrong } = useSound();

  const [pin,       setPin]       = useState('');     // PIN digitado
  const [unlocked,  setUnlocked]  = useState(false);  // se passou no PIN
  const [pinError,  setPinError]  = useState(false);  // erro de PIN

  // tenta desbloquear com o PIN digitado
  const tryUnlock = () => {
    if (pin === CORRECT_PIN) {
      playCorrect();
      setUnlocked(true);  // libera a área
    } else {
      playWrong();
      setPinError(true);  // mostra erro
      setPin('');         // limpa o campo
      setTimeout(() => setPinError(false), 1500); // some o erro após 1.5s
    }
  };

  // adiciona dígito ao PIN (máximo 4)
  const addDigit = (d) => {
    playClick();
    if (pin.length < 4) setPin(p => p + d);
  };

  // apaga o último dígito
  const backspace = () => {
    playClick();
    setPin(p => p.slice(0, -1));
  };

  // calcula estatísticas para um perfil
  const getStats = (profile) => {
    const progress = profile.progress;
    const totalStars  = Object.values(progress).reduce((a,c) => a + c.stars, 0);
    const totalGames  = Object.values(progress).reduce((a,c) => a + c.gamesPlayed, 0);
    const bestStreak  = Math.max(...Object.values(progress).map(c => c.bestStreak));
    return { totalStars, totalGames, bestStreak };
  };

  // ---- tela de PIN ----
  if (!unlocked) {
    return (
      <div className={styles.container}>
        <button className={styles.backBtn} onClick={() => { playClick(); navigate('/'); }}>
          ← Voltar
        </button>
        <div className={styles.pinCard}>
          <div className={styles.pinIcon}>👨‍👩‍👧</div>
          <h2 className={styles.pinTitle}>Área dos Pais</h2>
          <p className={styles.pinSubtitle}>Digite o PIN para entrar</p>
          <p className={styles.pinHint}>(PIN padrão: 1234)</p>

          {/* indicadores de dígitos */}
          <div className={styles.pinDots}>
            {[0,1,2,3].map(i => (
              <div
                key={i}
                className={`${styles.pinDot} ${i < pin.length ? styles.pinDotFilled : ''} ${pinError ? styles.pinDotError : ''}`}
              />
            ))}
          </div>

          {/* teclado numérico */}
          <div className={styles.numpad}>
            {[1,2,3,4,5,6,7,8,9].map(d => (
              <button key={d} className={styles.numBtn} onClick={() => addDigit(String(d))}>{d}</button>
            ))}
            <div /> {/* célula vazia */}
            <button className={styles.numBtn} onClick={() => addDigit('0')}>0</button>
            <button className={`${styles.numBtn} ${styles.numBtnBack}`} onClick={backspace}>⌫</button>
          </div>

          {/* botão confirmar */}
          <button
            className={styles.confirmBtn}
            onClick={tryUnlock}
            disabled={pin.length < 4}
          >
            Entrar →
          </button>

          {pinError && <p className={styles.errorMsg}>PIN incorreto. Tente novamente!</p>}
        </div>
      </div>
    );
  }

  // ---- área desbloqueada — relatórios ----
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => { playClick(); navigate('/'); }}>
          ← Sair
        </button>
        <h1 className={styles.title}>Relatório dos Filhos 📊</h1>
      </header>

      {profiles.length === 0 ? (
        <p className={styles.empty}>Nenhum perfil cadastrado ainda.</p>
      ) : (
        <div className={styles.reportsList}>
          {profiles.map(profile => {
            const stats = getStats(profile);
            return (
              <div key={profile.id} className={styles.reportCard}>
                {/* cabeçalho do card */}
                <div className={styles.reportHeader}>
                  <span className={styles.reportAvatar}>{profile.avatar}</span>
                  <div>
                    <p className={styles.reportName}>{profile.name}</p>
                    <p className={styles.reportAge}>{profile.age} anos</p>
                  </div>
                </div>

                {/* estatísticas globais */}
                <div className={styles.statsRow}>
                  <div className={styles.statBox}>
                    <span className={styles.statValue}>⭐ {stats.totalStars}</span>
                    <span className={styles.statLabel}>Estrelas</span>
                  </div>
                  <div className={styles.statBox}>
                    <span className={styles.statValue}>🎮 {stats.totalGames}</span>
                    <span className={styles.statLabel}>Jogos</span>
                  </div>
                  <div className={styles.statBox}>
                    <span className={styles.statValue}>🔥 {stats.bestStreak}</span>
                    <span className={styles.statLabel}>Melhor sequência</span>
                  </div>
                </div>

                {/* progresso por categoria */}
                <div className={styles.catBreakdown}>
                  {Object.entries(profile.progress).map(([cat, prog]) => {
                    const labels = { logica:'Lógica', matematica:'Matemática', alfabeto:'Alfabeto', cores:'Cores' };
                    const icons  = { logica:'🧩', matematica:'🔢', alfabeto:'📖', cores:'🎨' };
                    return (
                      <div key={cat} className={styles.catRow}>
                        <span className={styles.catRowIcon}>{icons[cat]}</span>
                        <span className={styles.catRowLabel}>{labels[cat]}</span>
                        <span className={styles.catRowStats}>⭐{prog.stars} | 🎮{prog.gamesPlayed}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ParentPage;
