// games/DifferentGame.jsx — jogo "Qual é o diferente?" (lógica)
// a criança identifica qual item não pertence ao grupo
import React, { useState } from 'react';
import GameShell from '../components/GameShell';
import styles from './SharedGame.module.css';

const ROUNDS_DATA = [
  { items: ['🐶','🐱','🐸','🚗'], different: '🚗' },
  { items: ['🍎','🍊','🍋','🎈'], different: '🎈' },
  { items: ['🔴','🔵','🟡','🔺'], different: '🔺' }, // forma entre cores
  { items: ['⭐','🌙','☀️','🍕'], different: '🍕' },
  { items: ['✏️','📏','📐','🐘'], different: '🐘' },
  { items: ['1️⃣','2️⃣','3️⃣','🌸'], different: '🌸' },
  { items: ['🚗','🚌','🚂','🐦'], different: '🐦' },
];

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }
function sample(arr, n) { return shuffle(arr).slice(0, n); }

function DifferentGame({ categoria, onEnd, onBack }) {
  const TOTAL = 6;
  const [rounds] = useState(() => sample(ROUNDS_DATA, TOTAL));

  return (
    <GameShell title="Qual é o diferente? 🔍" categoria={categoria} totalRounds={TOTAL} onEnd={onEnd} onBack={onBack}>
      {({ round, onCorrect, onWrong }) => {
        const r = rounds[round - 1];
        const shuffled = shuffle(r.items); // embaralha posições

        return (
          <div className={styles.gameArea}>
            <p className={styles.instruction}>Qual não combina com os outros? 🤔</p>
            {/* exibe os 4 itens em grid 2x2 */}
            <div className={styles.optionsGrid}>
              {shuffled.map((item, i) => (
                <button
                  key={i}
                  className={styles.optionBtn}
                  onClick={() => item === r.different ? onCorrect() : onWrong()}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        );
      }}
    </GameShell>
  );
}

export default DifferentGame;
