// games/FormaGame.jsx — jogo "Encaixe de Formas" (cores e formas)
// a criança identifica o nome da forma geométrica exibida
import React, { useState } from 'react';
import GameShell from '../components/GameShell';
import styles from './SharedGame.module.css';

const SHAPES = [
  { emoji: '🔵', name: 'Círculo',    options: ['Círculo','Quadrado','Triângulo','Losango'] },
  { emoji: '🟦', name: 'Quadrado',   options: ['Quadrado','Retângulo','Círculo','Triângulo'] },
  { emoji: '🔺', name: 'Triângulo',  options: ['Triângulo','Pirâmide','Círculo','Losango'] },
  { emoji: '🟣', name: 'Círculo',    options: ['Círculo','Oval','Quadrado','Hexágono'] },
  { emoji: '🔷', name: 'Losango',    options: ['Losango','Quadrado','Triângulo','Estrela'] },
  { emoji: '⭐', name: 'Estrela',    options: ['Estrela','Flor','Cruz','Sol'] },
  { emoji: '🟥', name: 'Retângulo',  options: ['Retângulo','Quadrado','Losango','Triângulo'] },
];

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }
function sample(arr, n) { return shuffle(arr).slice(0, n); }

function FormaGame({ categoria, onEnd, onBack }) {
  const TOTAL = 6;
  const [rounds] = useState(() => sample(SHAPES, TOTAL));

  return (
    <GameShell title="Encaixe de Formas 🔷" categoria={categoria} totalRounds={TOTAL} onEnd={onEnd} onBack={onBack}>
      {({ round, onCorrect, onWrong }) => {
        const r = rounds[round - 1];
        return (
          <div className={styles.gameArea}>
            <p className={styles.instruction}>Que forma é essa? 🤔</p>
            <div className={styles.numberBox} style={{ fontSize: '6rem' }}>{r.emoji}</div>
            <div className={styles.optionsGrid}>
              {shuffle(r.options).map((opt, i) => (
                <button key={i} className={styles.optionBtn}
                  style={{ fontSize: '0.95rem', fontFamily: 'var(--font-title)', padding: '16px 8px' }}
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

export default FormaGame;
