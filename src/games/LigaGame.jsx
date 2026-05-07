// games/LigaGame.jsx — jogo "Liga Letra à Imagem" (alfabeto)
// mostra uma imagem (emoji) e a criança escolhe com qual letra começa
import React, { useState } from 'react';
import GameShell from '../components/GameShell';
import styles from './SharedGame.module.css';

const PAIRS = [
  { image: '🍎', letter: 'A', options: ['A','B','C','D'] },
  { image: '🐶', letter: 'C', options: ['C','D','G','P'] },  // Cachorro
  { image: '🌙', letter: 'L', options: ['L','M','N','O'] },  // Lua
  { image: '🐸', letter: 'S', options: ['S','R','T','P'] },  // Sapo
  { image: '🌺', letter: 'F', options: ['F','E','G','H'] },  // Flor
  { image: '🐘', letter: 'E', options: ['E','F','A','I'] },  // Elefante
  { image: '🎈', letter: 'B', options: ['B','D','P','Q'] },  // Bola/Balão
  { image: '🏠', letter: 'C', options: ['C','G','H','K'] },  // Casa
];

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }
function sample(arr, n) { return shuffle(arr).slice(0, n); }

function LigaGame({ categoria, onEnd, onBack }) {
  const TOTAL = 6;
  const [rounds] = useState(() => sample(PAIRS, TOTAL));

  return (
    <GameShell title="Liga Letra à Imagem 🔗" categoria={categoria} totalRounds={TOTAL} onEnd={onEnd} onBack={onBack}>
      {({ round, onCorrect, onWrong }) => {
        const r = rounds[round - 1];
        return (
          <div className={styles.gameArea}>
            <p className={styles.instruction}>Com qual letra começa? 🤔</p>
            <div className={styles.numberBox} style={{ fontSize: '5rem' }}>{r.image}</div>
            <div className={styles.lettersGrid}>
              {shuffle(r.options).map((opt, i) => (
                <button key={i} className={styles.letterBtn}
                  onClick={() => opt === r.letter ? onCorrect() : onWrong()}>
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

export default LigaGame;
