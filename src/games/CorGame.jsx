// games/CorGame.jsx — jogo "Identifique a Cor" (cores e formas)
import React, { useState } from 'react';
import GameShell from '../components/GameShell';
import styles from './SharedGame.module.css';

const COLORS_DATA = [
  { color: '#FF6B6B', name: 'Vermelho', options: ['Vermelho','Azul','Verde','Amarelo'] },
  { color: '#4D96FF', name: 'Azul',     options: ['Azul','Verde','Roxo','Laranja'] },
  { color: '#6BCB77', name: 'Verde',    options: ['Verde','Azul','Amarelo','Rosa'] },
  { color: '#FFD93D', name: 'Amarelo',  options: ['Amarelo','Laranja','Branco','Verde'] },
  { color: '#FF922B', name: 'Laranja',  options: ['Laranja','Vermelho','Amarelo','Marrom'] },
  { color: '#C77DFF', name: 'Roxo',     options: ['Roxo','Rosa','Azul','Cinza'] },
  { color: '#FF69B4', name: 'Rosa',     options: ['Rosa','Vermelho','Roxo','Laranja'] },
];

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }
function sample(arr, n) { return shuffle(arr).slice(0, n); }

function CorGame({ categoria, onEnd, onBack }) {
  const TOTAL = 6;
  const [rounds] = useState(() => sample(COLORS_DATA, TOTAL));

  return (
    <GameShell title="Identifique a Cor 🌈" categoria={categoria} totalRounds={TOTAL} onEnd={onEnd} onBack={onBack}>
      {({ round, onCorrect, onWrong }) => {
        const r = rounds[round - 1];
        return (
          <div className={styles.gameArea}>
            <p className={styles.instruction}>Que cor é essa? 🎨</p>
            {/* mostra um quadrado grande com a cor */}
            <div className={styles.colorSample} style={{ background: r.color }} />
            {/* opções em grid de botões coloridos */}
            <div className={styles.colorsGrid}>
              {shuffle(r.options).map((opt, i) => (
                <button key={i}
                  className={styles.optionBtn}
                  style={{ fontSize: '1rem', fontFamily: 'var(--font-title)', padding: '16px 8px' }}
                  onClick={() => opt === r.name ? onCorrect() : onWrong()}
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

export default CorGame;
