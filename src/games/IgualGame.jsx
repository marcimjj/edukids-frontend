// games/IgualGame.jsx — jogo "Encontre o Igual" (cores e formas)
// mostra um emoji e a criança encontra o igual entre 4 opções
import React, { useState } from 'react';
import GameShell from '../components/GameShell';
import styles from './SharedGame.module.css';

const ROUNDS_DATA = [
  { target: '🐶', options: ['🐱','🐶','🐸','🐭'] },
  { target: '⭐', options: ['🌙','☀️','⭐','🌟'] },
  { target: '🍎', options: ['🍊','🍋','🍇','🍎'] },
  { target: '🔵', options: ['🔴','🔵','🟡','🟢'] },
  { target: '🏠', options: ['🏯','🏠','🏡','🏢'] },
  { target: '🎈', options: ['🎀','🎁','🎈','🎉'] },
  { target: '🐘', options: ['🦒','🐘','🦁','🐅'] },
  { target: '🌸', options: ['🌺','🌻','🌸','🌹'] },
];

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }
function sample(arr, n) { return shuffle(arr).slice(0, n); }

function IgualGame({ categoria, onEnd, onBack }) {
  const TOTAL = 6;
  const [rounds] = useState(() => sample(ROUNDS_DATA, TOTAL));

  return (
    <GameShell title="Encontre o Igual 👁️" categoria={categoria} totalRounds={TOTAL} onEnd={onEnd} onBack={onBack}>
      {({ round, onCorrect, onWrong }) => {
        const r = rounds[round - 1];
        return (
          <div className={styles.gameArea}>
            <p className={styles.instruction}>Encontre o igual a esse! 🔍</p>
            {/* exibe o alvo */}
            <div className={styles.numberBox} style={{ fontSize: '5rem', background: '#F0F8FF', border: '3px solid var(--color-green)' }}>
              {r.target}
            </div>
            {/* opções embaralhadas */}
            <div className={styles.optionsGrid}>
              {shuffle(r.options).map((opt, i) => (
                <button key={i} className={styles.optionBtn}
                  onClick={() => opt === r.target ? onCorrect() : onWrong()}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );
      }}
    </GameShell>
  );
}

export default IgualGame;
