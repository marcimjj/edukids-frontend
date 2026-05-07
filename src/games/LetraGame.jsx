// games/LetraGame.jsx — jogo "Qual letra é essa?" (alfabeto)
// mostra uma letra e a criança identifica o nome correto
import React, { useState } from 'react';
import GameShell from '../components/GameShell';
import styles from './SharedGame.module.css';

const LETTERS = [
  { letter: 'A', options: ['A','B','D','E'] },
  { letter: 'B', options: ['B','D','P','Q'] },
  { letter: 'C', options: ['C','G','O','Q'] },
  { letter: 'D', options: ['D','B','P','Q'] },
  { letter: 'E', options: ['E','F','A','L'] },
  { letter: 'F', options: ['F','E','T','I'] },
  { letter: 'G', options: ['G','C','O','Q'] },
  { letter: 'H', options: ['H','N','M','K'] },
  { letter: 'I', options: ['I','J','L','T'] },
  { letter: 'M', options: ['M','N','H','W'] },
  { letter: 'O', options: ['O','Q','C','G'] },
  { letter: 'P', options: ['P','B','D','Q'] },
];

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }
function sample(arr, n) { return shuffle(arr).slice(0, n); }

function LetraGame({ categoria, onEnd, onBack }) {
  const TOTAL = 6;
  const [rounds] = useState(() => sample(LETTERS, TOTAL));

  return (
    <GameShell title="Qual Letra É Essa? 🔤" categoria={categoria} totalRounds={TOTAL} onEnd={onEnd} onBack={onBack}>
      {({ round, onCorrect, onWrong }) => {
        const r = rounds[round - 1];

        return (
          <div className={styles.gameArea}>
            <p className={styles.instruction}>Que letra é essa? 👀</p>
            {/* exibe a letra grande */}
            <div className={styles.numberBox} style={{ fontSize: '6rem', color: 'var(--color-red)' }}>
              {r.letter}
            </div>
            {/* opções de letras */}
            <div className={styles.lettersGrid}>
              {shuffle(r.options).map((opt, i) => (
                <button
                  key={i}
                  className={styles.letterBtn}
                  onClick={() => opt === r.letter ? onCorrect() : onWrong()}
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

export default LetraGame;
