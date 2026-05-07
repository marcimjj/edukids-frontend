// games/TamanhoGame.jsx — jogo "Ordene por tamanho" (lógica)
// a criança escolhe o maior ou menor entre os itens apresentados
import React, { useState } from 'react';
import GameShell from '../components/GameShell';
import styles from './SharedGame.module.css';

const ROUNDS_DATA = [
  { question: 'Qual é o MAIOR?', items: ['🐘','🐭','🐱'], answer: '🐘' },
  { question: 'Qual é o MENOR?', items: ['🦕','🐸','🐛'], answer: '🐛' },
  { question: 'Qual é o MAIOR?', items: ['🏠','🏡','🏯'], answer: '🏯' },
  { question: 'Qual é o MENOR?', items: ['🌳','🌱','🌲'], answer: '🌱' },
  { question: 'Qual é o MAIOR?', items: ['🍉','🍇','🫐'], answer: '🍉' },
  { question: 'Qual é o MENOR?', items: ['🦒','🐕','🐜'], answer: '🐜' },
  { question: 'Qual é o MAIOR?', items: ['🚂','🚗','🛴'], answer: '🚂' },
];

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }
function sample(arr, n) { return shuffle(arr).slice(0, n); }

function TamanhoGame({ categoria, onEnd, onBack }) {
  const TOTAL = 6;
  const [rounds] = useState(() => sample(ROUNDS_DATA, TOTAL));

  return (
    <GameShell title="Ordene por Tamanho 📏" categoria={categoria} totalRounds={TOTAL} onEnd={onEnd} onBack={onBack}>
      {({ round, onCorrect, onWrong }) => {
        const r = rounds[round - 1];
        const shuffled = shuffle(r.items);

        return (
          <div className={styles.gameArea}>
            <p className={styles.instruction}>{r.question}</p>
            {/* exibe os itens lado a lado */}
            <div className={styles.compareRow}>
              {shuffled.map((item, i) => (
                <button key={i} className={styles.optionBtn} style={{ flex: 1 }}
                  onClick={() => item === r.answer ? onCorrect() : onWrong()}
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

export default TamanhoGame;
